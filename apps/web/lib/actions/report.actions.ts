"use server";

import { reportRepository } from "@/lib/repositories/report.repository";

export async function getProjectReport(
  projectId: string
) {
  return reportRepository.getProjectReport(
    projectId
  );
}