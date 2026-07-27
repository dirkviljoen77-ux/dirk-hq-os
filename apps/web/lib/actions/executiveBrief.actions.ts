"use server";

import { executiveBriefRepository } from "@/lib/repositories/executiveBrief.repository";

export async function getExecutiveBrief(projectId: string) {
  return executiveBriefRepository.build(projectId);
}