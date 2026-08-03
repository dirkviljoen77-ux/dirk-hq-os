import { prisma } from "@/lib/prisma";

class ReportRepository {
  async getProjectReport(projectId: string) {
    const [project, activity] =
      await Promise.all([
        prisma.project.findUnique({
          where: {
            id: projectId,
          },
          include: {
            tasks: true,
            meetings: true,
            documents: true,
          },
        }),

        prisma.activity.findMany({
          where: {
            projectId,
          },
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

    return {
      ...project,
      activity,
    };
  }
}

export const reportRepository =
  new ReportRepository();