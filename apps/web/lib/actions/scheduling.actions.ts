"use server";

import { prisma } from "@/lib/prisma";

const timeZone = "Africa/Harare";
const slotSizeMinutes = 30;

function harareDateString(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dayBounds(date: Date) {
  const dateString = harareDateString(date);
  return {
    start: new Date(`${dateString}T08:00:00+02:00`),
    end: new Date(`${dateString}T18:00:00+02:00`),
  };
}

function roundUpToSlot(date: Date) {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  const remainder = rounded.getMinutes() % slotSizeMinutes;
  if (remainder) rounded.setMinutes(rounded.getMinutes() + slotSizeMinutes - remainder);
  return rounded;
}

export async function getSchedulingSuggestions(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.status === "COMPLETE") return [];

  const durationMinutes = Math.max(15, task.durationMinutes || 60);
  const now = new Date();
  const suggestions: Date[] = [];

  for (let offset = 0; offset < 4 && suggestions.length < 3; offset += 1) {
    const date = new Date(now.getTime() + offset * 24 * 60 * 60_000);
    const { start: dayStart, end: dayEnd } = dayBounds(date);
    const [meetings, scheduledTasks] = await Promise.all([
      prisma.meeting.findMany({
        where: { meetingDate: { gte: dayStart, lt: dayEnd }, status: { not: "CANCELLED" } },
        select: { meetingDate: true },
      }),
      prisma.task.findMany({
        where: {
          id: { not: taskId },
          status: { not: "COMPLETE" },
          scheduledAt: { gte: dayStart, lt: dayEnd },
        },
        select: { scheduledAt: true, durationMinutes: true },
      }),
    ]);

    const blocked = [
      ...meetings.map((meeting) => ({ start: meeting.meetingDate, end: new Date(meeting.meetingDate.getTime() + 60 * 60_000) })),
      ...scheduledTasks.filter((task) => task.scheduledAt).map((task) => ({ start: task.scheduledAt!, end: new Date(task.scheduledAt!.getTime() + task.durationMinutes * 60_000) })),
    ];

    let candidate = roundUpToSlot(offset === 0 && now > dayStart ? now : dayStart);
    while (candidate.getTime() + durationMinutes * 60_000 <= dayEnd.getTime() && suggestions.length < 3) {
      const candidateEnd = new Date(candidate.getTime() + durationMinutes * 60_000);
      const overlaps = blocked.some((block) => candidate < block.end && candidateEnd > block.start);
      if (!overlaps) suggestions.push(new Date(candidate));
      candidate = new Date(candidate.getTime() + slotSizeMinutes * 60_000);
    }
  }

  return suggestions;
}
