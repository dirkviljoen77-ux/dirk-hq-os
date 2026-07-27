import { prisma } from "@/lib/prisma";

class DashboardRepository {
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