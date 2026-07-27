import { prisma } from "@/lib/prisma";

export interface UpdateFinanceInput {
  approvedBudget?: number;
  forecastCost?: number;
  actualCost?: number;
  contingency?: number;
  currency?: string;
}

class FinanceRepository {
  async get(projectId: string) {
    return prisma.finance.findUnique({
      where: {
        projectId,
      },
    });
  }

  async create(projectId: string) {
    return prisma.finance.create({
      data: {
        projectId,
      },
    });
  }

  async update(
    projectId: string,
    data: UpdateFinanceInput
  ) {
    return prisma.finance.upsert({
      where: {
        projectId,
      },
      update: data,
      create: {
        projectId,
        ...data,
      },
    });
  }
}

export const financeRepository =
  new FinanceRepository();