import { prisma } from "@/lib/prisma";

export interface CreateActivityInput {
  type: string;
  title: string;
  description?: string;
  projectId?: string;
}

class ActivityRepository {
  async latest(limit = 20) {
    return prisma.activity.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });
  }

  async latestByProject(
    projectId: string,
    limit = 20
  ) {
    return prisma.activity.findMany({
      where: {
        projectId,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateActivityInput) {
    return prisma.activity.create({
      data,
    });
  }
}

export const activityRepository =
  new ActivityRepository();