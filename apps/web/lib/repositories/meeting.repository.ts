import { prisma } from "@/lib/prisma";

export interface CreateMeetingInput {
  title: string;
  description?: string;
  meetingDate: Date;
  location?: string;
  projectId?: string;
}

export interface UpdateMeetingInput {
  title?: string;
  description?: string;
 meetingDate?: Date;
  location?: string;
  status?:
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
}

class MeetingRepository {
  async findByProject(projectId: string) {
    return prisma.meeting.findMany({
      where: {
        projectId,
      },
      orderBy: {
        meetingDate: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.meeting.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateMeetingInput) {
  return prisma.meeting.create({
    data: {
      title: data.title,
      description: data.description,
      meetingDate: data.meetingDate,
      location: data.location,

      ...(data.projectId
        ? { project: { connect: { id: data.projectId } } }
        : {}),
    },
  });
}

  async update(id: string, data: UpdateMeetingInput) {
    return prisma.meeting.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    return prisma.meeting.delete({
      where: {
        id,
      },
    });
  }
}

export const meetingRepository = new MeetingRepository();