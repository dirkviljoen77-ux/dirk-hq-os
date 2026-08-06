import { prisma } from "@/lib/prisma";

class InboxRepository {
  findAll() {
    return prisma.inboxItem.findMany({ orderBy: { createdAt: "desc" } });
  }

  create(content: string) {
    return prisma.inboxItem.create({ data: { content } });
  }

  findById(id: string) {
    return prisma.inboxItem.findUnique({ where: { id } });
  }

  delete(id: string) {
    return prisma.inboxItem.delete({ where: { id } });
  }
}

export const inboxRepository = new InboxRepository();
