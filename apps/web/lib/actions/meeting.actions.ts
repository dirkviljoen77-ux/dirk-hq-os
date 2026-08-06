"use server";

import { revalidatePath } from "next/cache";
import { meetingRepository } from "@/lib/repositories/meeting.repository";
import { scheduleMeetingReminder } from "@/lib/meeting-reminders";
import { prisma } from "@/lib/prisma";
import { logActivity } from "./activity.actions";
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent, updateGoogleCalendarEvent } from "@/lib/google-drive";

export async function getMeetings(projectId: string) {
  return meetingRepository.findByProject(projectId);
}

export async function getMeeting(id: string) {
  return meetingRepository.findById(id);
}

export async function createMeeting(data: {
  title: string;
  description?: string;
  meetingDate: Date;
  location?: string;
  projectId?: string;
}) {
  const meeting = await meetingRepository.create(data);

  try {
    const googleEventId = await createGoogleCalendarEvent(meeting);
    await meetingRepository.update(meeting.id, { googleEventId });
    meeting.googleEventId = googleEventId;
  } catch {
    // Dirk HQ remains usable if Google Calendar has not yet been reconnected with edit permission.
  }

  const scheduledFor = new Date(meeting.meetingDate.getTime() - 60 * 60_000);
  if (scheduledFor > new Date()) {
    await prisma.meetingReminder.upsert({
      where: { meetingId: meeting.id },
      update: { scheduledFor, sentAt: null },
      create: { meetingId: meeting.id, scheduledFor },
    });
    try {
      await scheduleMeetingReminder(meeting);
    } catch {
      // A reminder scheduling problem must never prevent a meeting from being saved.
    }
  }

  if (data.projectId) {
    await logActivity({
      type: "MEETING_CREATED",
      title: data.title,
      description: "Meeting created",
      projectId: data.projectId,
    });

    revalidatePath(`/projects/${data.projectId}`);
  }

  revalidatePath("/calendar");
  revalidatePath("/meetings");

  return meeting;
}

export async function updateMeeting(
  id: string,
  data: {
    title?: string;
    description?: string;
    meetingDate?: Date;
    location?: string;
    status?:
      | "SCHEDULED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "CANCELLED";
  }
) {
  const meeting = await meetingRepository.update(id, data);

  try {
    if (meeting.googleEventId) {
      await updateGoogleCalendarEvent(meeting.googleEventId, meeting);
    } else {
      const googleEventId = await createGoogleCalendarEvent(meeting);
      await meetingRepository.update(meeting.id, { googleEventId });
    }
  } catch {
    // Preserve the Dirk HQ update when Google Calendar is unavailable.
  }

  revalidatePath("/calendar");
  revalidatePath("/meetings");

  if (meeting.projectId) {
    revalidatePath(`/projects/${meeting.projectId}`);
  }

  return meeting;
}

export async function deleteMeeting(id: string) {
  const meeting = await meetingRepository.findById(id);

  if (meeting) {
    await logActivity({
      type: "MEETING_DELETED",
      title: meeting.title,
      description: "Meeting deleted",
      projectId: meeting.projectId ?? undefined,
    });
  }

  if (meeting?.googleEventId) {
    try {
      await deleteGoogleCalendarEvent(meeting.googleEventId);
    } catch {
      // Preserve the Dirk HQ deletion when Google Calendar is unavailable.
    }
  }

  await meetingRepository.delete(id);

  revalidatePath("/calendar");
  revalidatePath("/meetings");

  if (meeting?.projectId) {
    revalidatePath(`/projects/${meeting.projectId}`);
  }
}
