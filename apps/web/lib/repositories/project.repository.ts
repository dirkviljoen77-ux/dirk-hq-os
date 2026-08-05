import { prisma } from "@/lib/prisma";

export interface CreateProjectInput {
  name: string;
  description?: string;
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
    const workspace = await prisma.workspace.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!workspace) {
      throw new Error(
        "No Workspace found. Run: pnpm prisma db seed"
      );
    }

    return prisma.project.create({
      data: {
        ...data,
        status: "Planned",
        workspaceId: workspace.id,
      },
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
    return prisma.$transaction([
      prisma.activity.deleteMany({ where: { projectId: id } }),
      prisma.decision.deleteMany({ where: { projectId: id } }),
      prisma.risk.deleteMany({ where: { projectId: id } }),
      prisma.milestone.deleteMany({ where: { projectId: id } }),
      prisma.finance.deleteMany({ where: { projectId: id } }),
      prisma.journalEntry.deleteMany({ where: { projectId: id } }),
      prisma.task.deleteMany({ where: { projectId: id } }),
      prisma.person.deleteMany({ where: { projectId: id } }),
      prisma.document.deleteMany({ where: { projectId: id } }),
      prisma.meeting.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);
  }
}

export const projectRepository = new ProjectRepository();
