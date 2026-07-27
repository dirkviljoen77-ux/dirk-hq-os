import { prisma } from "@/lib/prisma";

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: number;
  dueDate?: Date;
  projectId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETE";
  priority?: number;
  dueDate?: Date;
}

class TaskRepository {
  async findByProject(projectId: string) {
    return prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: [
        {
          priority: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async findById(id: string) {
    return prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateTaskInput) {
    return prisma.task.create({
      data,
    });
  }

  async update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return prisma.task.delete({
      where: {
        id,
      },
    });
  }
}

export const taskRepository = new TaskRepository();