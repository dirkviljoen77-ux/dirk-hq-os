"use server";

import { revalidatePath } from "next/cache";
import { meetingRepository } from "@/lib/repositories/meeting.repository";
import { logActivity } from "./activity.actions";

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

  await meetingRepository.delete(id);

  revalidatePath("/calendar");
  revalidatePath("/meetings");

  if (meeting?.projectId) {
    revalidatePath(`/projects/${meeting.projectId}`);
  }
}