import { prisma } from "@/lib/prisma";

export interface CreateDocumentInput {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  projectId: string;
}
export interface UpdateDocumentInput {
  name?: string;
  description?: string;
}
class DocumentRepository {
  async findByProject(projectId: string) {
    return prisma.document.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateDocumentInput) {
    return prisma.document.create({
      data,
    });
  }
async update(
  id: string,
  data: UpdateDocumentInput
) {
  return prisma.document.update({
    where: {
      id,
    },
    data,
  });
}
  async delete(id: string) {
    return prisma.document.delete({
      where: {
        id,
      },
    });
  }
}

export const documentRepository = new DocumentRepository();