import { prisma } from "@/lib/prisma";

export interface CreateJournalInput {
  title: string;
  content: string;
  category?: string;
  projectId: string;
}

export interface UpdateJournalInput {
  title: string;
  content: string;
}

class JournalRepository {
  async findByProject(projectId: string) {
    return prisma.journalEntry.findMany({
      where: { projectId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateJournalInput) {
    return prisma.journalEntry.create({
      data,
    });
  }

  async update(id: string, data: UpdateJournalInput) {
    return prisma.journalEntry.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.journalEntry.delete({
      where: { id },
    });
  }
}

export const journalRepository =
  new JournalRepository();
