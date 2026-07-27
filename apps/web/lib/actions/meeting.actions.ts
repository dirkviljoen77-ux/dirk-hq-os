"use server";

import { revalidatePath } from "next/cache";
import { meetingRepository } from "@/lib/repositories/meeting.repository";

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

  revalidatePath(`/projects/${data.projectId}`);

  return meeting;
}

export async function deleteMeeting(id: string) {
  return meetingRepository.delete(id);
}