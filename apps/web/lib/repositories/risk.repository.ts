import { prisma } from "@/lib/prisma";

export interface CreateRiskInput {
  title: string;
  description?: string;
  probability?: number;
  impact?: number;
  owner?: string;
  mitigation?: string;
  status?: string;
  projectId: string;
}

class RiskRepository {
  async findByProject(projectId: string) {
    return prisma.risk.findMany({
      where: { projectId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateRiskInput) {
    return prisma.risk.create({
      data,
    });
  }

  async delete(id: string) {
    return prisma.risk.delete({
      where: { id },
    });
  }
}

export const riskRepository = new RiskRepository();