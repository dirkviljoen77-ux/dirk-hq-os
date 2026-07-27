"use server";

import { activityRepository } from "@/lib/repositories/activity.repository";

export async function getLatestActivity() {
  return activityRepository.latest();
}

export async function getProjectActivity(
  projectId: string
) {
  return activityRepository.latestByProject(
    projectId
  );
}

export async function logActivity(data: {
  type: string;
  title: string;
  description?: string;
  projectId?: string;
}) {
  return activityRepository.create(data);
}