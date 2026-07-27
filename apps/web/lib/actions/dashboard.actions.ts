"use server";

import { dashboardRepository } from "@/lib/repositories/dashboard.repository";

export async function getDashboardSummary() {
  return dashboardRepository.getSummary();
}