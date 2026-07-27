"use server";

import { revalidatePath } from "next/cache";
import { decisionRepository } from "@/lib/repositories/decision.repository";
import { logActivity } from "./activity.actions";

export async function getDecisions(projectId: string) {
  return decisionRepository.findByProject(projectId);
}

export async function createDecision(data: {
  title: string;
  description?: string;
  status?: string;
  owner?: string;
  projectId: string;
}) {
  const decision = await decisionRepository.create(data);

  await logActivity({
    type: "DECISION_CREATED",
    title: data.title,
    description: "Decision recorded",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return decision;
}

export async function deleteDecision(id: string) {
  return decisionRepository.delete(id);
}