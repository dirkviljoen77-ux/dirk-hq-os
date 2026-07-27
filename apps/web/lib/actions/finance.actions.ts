"use server";

import { revalidatePath } from "next/cache";
import { financeRepository } from "@/lib/repositories/finance.repository";
import { logActivity } from "./activity.actions";

export async function getFinance(
  projectId: string
) {
  return financeRepository.get(projectId);
}

export async function updateFinance(
  projectId: string,
  data: {
    approvedBudget?: number;
    forecastCost?: number;
    actualCost?: number;
    contingency?: number;
    currency?: string;
  }
) {
  const finance =
    await financeRepository.update(
      projectId,
      data
    );

  await logActivity({
    type: "FINANCE_UPDATED",
    title: "Finance updated",
    projectId,
  });

  revalidatePath(`/projects/${projectId}`);

  return finance;
}