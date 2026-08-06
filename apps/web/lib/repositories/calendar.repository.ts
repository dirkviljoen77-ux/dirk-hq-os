import { prisma } from "@/lib/prisma";

class CalendarRepository {
  async getCalendar() {
    const [tasks, meetings, milestones] = await Promise.all([
      prisma.task.findMany({
        where: {
          status: { not: "COMPLETE" },
          OR: [{ scheduledAt: { not: null } }, { dueDate: { not: null } }],
        },
      }),

      prisma.meeting.findMany(),

      prisma.milestone.findMany({
      where: {
  dueDate: {
    not: null,
  },
},  
      }),
    ]);

    const events = [
      ...tasks.map((task: any) => ({
        id: task.id,
        title: `✓ ${task.title}`,
        start: task.scheduledAt ?? task.dueDate!,
        end: task.scheduledAt
          ? new Date(task.scheduledAt.getTime() + task.durationMinutes * 60_000)
          : undefined,
        allDay: !task.scheduledAt,
        color: "#F59E0B",
        extendedProps: { kind: "task", projectId: task.projectId },
      })),

      ...meetings.map((meeting: any) => ({
        id: meeting.id,
        title: `📅 ${meeting.title}`,
        start: meeting.meetingDate,
        color: "#2563EB",
        extendedProps: { kind: "meeting" },
      })),

      ...milestones.map((milestone: any) => ({
        id: milestone.id,
        title: `🏁 ${milestone.title}`,
        start: milestone.dueDate!,
        color: "#10B981",
        extendedProps: { kind: "milestone", projectId: milestone.projectId },
      })),
    ];

    return events;
  }
}

export const calendarRepository = new CalendarRepository();
