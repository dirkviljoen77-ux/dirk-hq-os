"use server";

import { revalidatePath } from "next/cache";
import { meetingRepository } from "@/lib/repositories/meeting.repository";
import { logActivity } from "./activity.actions";

export async function getMeetings(projectId: string) {
  return meetingRepository.findByProject(projectId);
}

export async function createMeeting(data: {
  title: string;
  description?: string;
  meetingDate: Date;
  location?: string;
  projectId: string;
}) {
  const meeting = await meetingRepository.create(data);

  await logActivity({
    type: "MEETING_CREATED",
    title: data.title,
    description: "Meeting created",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return meeting;
}

export async function deleteMeeting(id: string) {
  const meeting = await meetingRepository.findById(id);

  if (meeting) {
    await logActivity({
      type: "MEETING_DELETED",
      title: meeting.title,
      description: "Meeting deleted",
      projectId: meeting.projectId,
    });
  }

  return meetingRepository.delete(id);
}