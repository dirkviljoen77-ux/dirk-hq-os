import { prisma } from "@/lib/prisma";

class CalendarRepository {
  async getCalendar() {
    const [tasks, meetings, milestones] = await Promise.all([
      prisma.task.findMany({
       where: {
  dueDate: {
    not: null,
  },
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
        title: `✅ ${task.title}`,
        start: task.dueDate!,
        color: "#F59E0B",
      })),

      ...meetings.map((meeting: any) => ({
        id: meeting.id,
        title: `📅 ${meeting.title}`,
        start: meeting.meetingDate,
        color: "#2563EB",
      })),

      ...milestones.map((milestone: any) => ({
        id: milestone.id,
        title: `🏁 ${milestone.title}`,
        start: milestone.dueDate!,
        color: "#10B981",
      })),
    ];

    return events;
  }
}

export const calendarRepository = new CalendarRepository();