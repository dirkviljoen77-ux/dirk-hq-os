import { prisma } from "@/lib/prisma";

class ReportRepository {
  async getProjectReport(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: true,
        meetings: true,
        people: true,
        documents: true,
        decisions: true,
        risks: true,
        milestones: true,
        finance: true,
        journalEntries: true,
      },
    });

    return project;
  }
}

export const reportRepository =
  new ReportRepository();