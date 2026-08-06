import { prisma } from "@/lib/prisma";

class DashboardRepository {
  async getLiveDashboard() {
    const now = new Date();
    const harareDate = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const todayStart = new Date(`${harareDate}T00:00:00+02:00`);
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const [projectCount, outstandingTasks, meetingsToday, documents, recentProjects, priorities, upcomingMeetings, meetingsTodayList] = await Promise.all([
      prisma.project.count(),
      prisma.task.count({ where: { status: { not: "COMPLETE" } } }),
      prisma.meeting.count({ where: { meetingDate: { gte: todayStart, lt: tomorrowStart }, status: { not: "CANCELLED" } } }),
      prisma.document.count(),
      prisma.project.findMany({
        take: 4,
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, status: true },
      }),
      prisma.task.findMany({
        where: { dueDate: { gte: todayStart, lt: tomorrowStart }, status: { not: "COMPLETE" } },
        take: 4,
        orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
        select: { id: true, title: true, project: { select: { name: true } } },
      }),
      prisma.meeting.findMany({
        where: { meetingDate: { gte: now }, status: { not: "CANCELLED" } },
        take: 4,
        orderBy: { meetingDate: "asc" },
        select: { id: true, title: true, meetingDate: true },
      }),
      prisma.meeting.findMany({
        where: { meetingDate: { gte: todayStart, lt: tomorrowStart }, status: { not: "CANCELLED" } },
        orderBy: { meetingDate: "asc" },
        select: { id: true, title: true, meetingDate: true },
      }),
    ]);

    return { projectCount, outstandingTasks, meetingsToday, documents, recentProjects, priorities, upcomingMeetings, meetingsTodayList };
  }

  async getSummary() {
    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      totalMeetings,
      totalPeople,
      totalDocuments,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({
        where: {
          status: "Active",
        },
      }),
      prisma.task.count(),
      prisma.task.count({
        where: {
          status: "COMPLETE",
        },
      }),
      prisma.meeting.count(),
      prisma.person.count(),
      prisma.document.count(),
    ]);

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      totalMeetings,
      totalPeople,
      totalDocuments,
    };
  }
}

export const dashboardRepository =
  new DashboardRepository();
