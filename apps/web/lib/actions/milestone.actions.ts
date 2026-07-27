"use server";

import { revalidatePath } from "next/cache";
import { milestoneRepository } from "@/lib/repositories/milestone.repository";
import { logActivity } from "./activity.actions";

export async function getMilestones(projectId: string) {
  return milestoneRepository.findByProject(projectId);
}

export async function createMilestone(data: {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: string;
  projectId: string;
}) {
  const milestone = await milestoneRepository.create(data);

  await logActivity({
    type: "MILESTONE_CREATED",
    title: data.title,
    description: "Milestone created",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return milestone;
}

export async function deleteMilestone(id: string) {
  return milestoneRepository.delete(id);
}