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
const completedTasks = tasks.filter(
  (t) => t.status === "COMPLETE"
);

const milestones =
  await prisma.milestone.findMany({
    where: {
      projectId,
    },
  });

const upcomingMeetings = meetings.filter(
  (m) => m.meetingDate >= new Date()
);

const upcomingMilestones =
  milestones.filter(
    (m) =>
      m.dueDate &&
      m.dueDate >= new Date() &&
      m.status !== "COMPLETE"
  );

const projectHealth =
  openTasks.length === 0
    ? "On Track"
    : openTasks.length <= 5
    ? "Attention"
    : "At Risk";

return {
  projectName: project?.name ?? "",

  projectHealth,

  progress: 0,

  openTasks: openTasks.length,

  completedTasks:
    completedTasks.length,

  upcomingMeetings:
    upcomingMeetings.length,

  upcomingMilestones:
    upcomingMilestones.length,

  people: people.length,

  documents: documents.length,

  recentActivity:
    activity.length,
};

  }
}

export const executiveBriefRepository =
  new ExecutiveBriefRepository();