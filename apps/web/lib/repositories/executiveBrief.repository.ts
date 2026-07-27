import { prisma } from "@/lib/prisma";

class ExecutiveBriefRepository {
  async build(projectId: string) {
    const [
      project,
      tasks,
      meetings,
      people,
      documents,
      activity,
    ] = await Promise.all([
      prisma.project.findUnique({
        where: {
          id: projectId,
        },
      }),

      prisma.task.findMany({
        where: {
          projectId,
        },
      }),

      prisma.meeting.findMany({
        where: {
          projectId,
        },
        orderBy: {
          meetingDate: "asc",
        },
      }),

      prisma.person.findMany({
        where: {
          projectId,
        },
      }),

      prisma.document.findMany({
        where: {
          projectId,
        },
      }),

      prisma.activity.findMany({
        where: {
          projectId,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const openTasks = tasks.filter(
  (t) => t.status !== "COMPLETE"
);

const nextMeeting =
  meetings.length > 0 ? meetings[0] : null;

return {
  project,
  tasks,
  meetings,
  people,
  documents,
  activity,

  summary: {
    openTasks: openTasks.length,
    completedTasks:
      tasks.length - openTasks.length,

    totalPeople: people.length,

    totalDocuments:
      documents.length,

    recentActivity:
      activity.length,

    nextMeeting,
  },
};
  }
}

export const executiveBriefRepository =
  new ExecutiveBriefRepository();