import { prisma } from "@/lib/prisma";

export interface CreateProjectInput {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: string;
}

class ProjectRepository {
  async findAll() {
    return prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateProjectInput) {
    return prisma.project.create({
      data,
    });
  }

  async update(id: string, data: UpdateProjectInput) {
    return prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.project.delete({
      where: {
        id,
      },
    });
  }
}

export const projectRepository = new ProjectRepository();