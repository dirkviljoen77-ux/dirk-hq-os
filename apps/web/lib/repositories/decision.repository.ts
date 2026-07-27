import { prisma } from "@/lib/prisma";

export interface CreateDecisionInput {
  title: string;
  description?: string;
  status?: string;
  owner?: string;
  projectId: string;
}

export interface UpdateDecisionInput {
  title?: string;
  description?: string;
  status?: string;
  owner?: string;
}

class DecisionRepository {
  async findByProject(projectId: string) {
    return prisma.decision.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateDecisionInput) {
    return prisma.decision.create({
      data,
    });
  }

  async update(id: string, data: UpdateDecisionInput) {
    return prisma.decision.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.decision.delete({
      where: {
        id,
      },
    });
  }
}

export const decisionRepository =
  new DecisionRepository();