"use server";

import { aiRepository } from "@/lib/repositories/ai.repository";

export async function getProjectContext(projectId: string) {
  return aiRepository.getProjectContext(projectId);
}