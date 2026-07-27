import { prisma } from "@/lib/prisma";

class AIRepository {
  async getProjectContext(projectId: string) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        tasks: true,
        meetings: true,
        people: true,
        documents: true,
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
      },
    });

    return project;
  }
}

export const aiRepository =
  new AIRepository();