"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function todayInHarare() {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Harare", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return new Date(`${date}T00:00:00+02:00`);
}

function refresh() {
  revalidatePath("/plan");
  revalidatePath("/");
}

export async function getDailyPlan() {
  const planDate = todayInHarare();
  const tomorrow = new Date(planDate.getTime() + 24 * 60 * 60_000);
  const [plan, candidates, meetings] = await Promise.all([
    prisma.dailyPlan.findUnique({
      where: { planDate },
      include: {
        items: {
          orderBy: { position: "asc" },
          include: { task: { include: { project: { select: { id: true, name: true } } } } },
        },
        notes: {
          include: { journalEntry: { include: { project: { select: { id: true, name: true } } } } },
        },
      },
    }),
    prisma.task.findMany({
      where: { status: { not: "COMPLETE" } },
      include: { project: { select: { id: true, name: true } } },
      orderBy: [{ dueDate: "asc" }, { priority: "asc" }, { createdAt: "desc" }],
      take: 30,
    }),
    prisma.meeting.findMany({
      where: { meetingDate: { gte: planDate, lt: tomorrow }, status: { not: "CANCELLED" } },
      orderBy: { meetingDate: "asc" },
      select: { id: true, title: true, meetingDate: true },
    }),
  ]);

  return { planDate, plannedItems: plan?.items ?? [], plannedNotes: plan?.notes ?? [], candidates, meetings };
}

export async function addToDailyPlan(taskId: string) {
  const planDate = todayInHarare();
  const plan = await prisma.dailyPlan.upsert({ where: { planDate }, update: {}, create: { planDate } });
  const nextPosition = await prisma.dailyPlanItem.count({ where: { dailyPlanId: plan.id } });
  await prisma.dailyPlanItem.upsert({
    where: { dailyPlanId_taskId: { dailyPlanId: plan.id, taskId } },
    update: {},
    create: { dailyPlanId: plan.id, taskId, position: nextPosition },
  });
  refresh();
}

export async function removeFromDailyPlan(taskId: string) {
  const plan = await prisma.dailyPlan.findUnique({ where: { planDate: todayInHarare() } });
  if (!plan) return;
  await prisma.dailyPlanItem.deleteMany({ where: { dailyPlanId: plan.id, taskId } });
  refresh();
}

export async function pinNoteToDailyPlan(journalEntryId: string) {
  const planDate = todayInHarare();
  const plan = await prisma.dailyPlan.upsert({ where: { planDate }, update: {}, create: { planDate } });
  await prisma.dailyPlanNote.upsert({
    where: { dailyPlanId_journalEntryId: { dailyPlanId: plan.id, journalEntryId } },
    update: {},
    create: { dailyPlanId: plan.id, journalEntryId },
  });
  refresh();
}

export async function removeNoteFromDailyPlan(journalEntryId: string) {
  const plan = await prisma.dailyPlan.findUnique({ where: { planDate: todayInHarare() } });
  if (!plan) return;
  await prisma.dailyPlanNote.deleteMany({ where: { dailyPlanId: plan.id, journalEntryId } });
  refresh();
}
