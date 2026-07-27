import { prisma } from "@/lib/prisma";

export interface CreateMilestoneInput {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: string;
  projectId: string;
}

class MilestoneRepository {
  async findByProject(projectId: string) {
    return prisma.milestone.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async create(data: CreateMilestoneInput) {
    return prisma.milestone.create({
      data,
    });
  }

  async delete(id: string) {
    return prisma.milestone.delete({
      where: {
        id,
      },
    });
  }
}

export const milestoneRepository =
  new MilestoneRepository();