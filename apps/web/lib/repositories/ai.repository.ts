import { prisma } from "@/lib/prisma";

class AIRepository {
  async getProjectContext(projectId: string) {
    const [project, activities] =
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
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        }),
      ]);

    return {
      ...project,
      activities,
    };
  }
}

export const aiRepository =
  new AIRepository();