"use server";

import { revalidatePath } from "next/cache";
import { riskRepository } from "@/lib/repositories/risk.repository";
import { logActivity } from "./activity.actions";

export async function getRisks(projectId: string) {
  return riskRepository.findByProject(projectId);
}

export async function createRisk(data: {
  title: string;
  description?: string;
  probability?: number;
  impact?: number;
  owner?: string;
  mitigation?: string;
  status?: string;
  projectId: string;
}) {
  const risk = await riskRepository.create(data);

  await logActivity({
    type: "RISK_CREATED",
    title: data.title,
    description: "Risk added",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return risk;
}

export async function deleteRisk(id: string) {
  return riskRepository.delete(id);
}