import { prisma } from "@/lib/prisma";
import { getGoogleCalendarEvents } from "@/lib/google-drive";

class CalendarRepository {
  async getCalendar() {
    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - 14);
    const rangeEnd = new Date();
    rangeEnd.setDate(rangeEnd.getDate() + 90);
    const [tasks, meetings, milestones, googleCalendar] = await Promise.all([
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
      getGoogleCalendarEvents(rangeStart, rangeEnd),
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

    return { events: [...events, ...googleCalendar.events], googleCalendarConnected: googleCalendar.connected };
  }
}

export const calendarRepository = new CalendarRepository();
