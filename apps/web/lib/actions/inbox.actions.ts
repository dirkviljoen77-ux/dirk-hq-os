"use server";

import { revalidatePath } from "next/cache";
import { inboxRepository } from "@/lib/repositories/inbox.repository";
import { meetingRepository } from "@/lib/repositories/meeting.repository";
import { prisma } from "@/lib/prisma";

function refreshInbox() {
  revalidatePath("/inbox");
  revalidatePath("/");
}

function todayInHarare() {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Harare",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return new Date(`${date}T00:00:00+02:00`);
}

export async function getInboxItems() {
  return inboxRepository.findAll();
}

export async function captureInboxItem(content: string) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error("Write something before adding it to Inbox.");
  const item = await inboxRepository.create(trimmed);
  refreshInbox();
  return item;
}

export async function archiveInboxItem(id: string) {
  await inboxRepository.delete(id);
  refreshInbox();
}

export async function turnInboxIntoTask(id: string, projectId: string) {
  if (!projectId) return { error: "Choose a project for this task." };

  try {
    await prisma.$transaction(async (transaction) => {
      const item = await transaction.inboxItem.findUnique({ where: { id } });
      if (!item) throw new Error("MISSING_INBOX_ITEM");

      const task = await transaction.task.create({ data: { title: item.content, projectId } });
      await transaction.activity.create({
        data: { type: "TASK_CREATED", title: task.title, description: "Created from Inbox", projectId },
      });
      await transaction.inboxItem.delete({ where: { id } });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING_INBOX_ITEM") {
      return { error: "This Inbox item no longer exists." };
    }
    return { error: "Unable to create the task. Nothing was changed—please try again." };
  }

  refreshInbox();
  revalidatePath("/tasks");
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function turnInboxIntoNote(id: string, projectId: string) {
  if (!projectId) return { error: "Choose a project for this note." };

  try {
    await prisma.$transaction(async (transaction) => {
      const item = await transaction.inboxItem.findUnique({ where: { id } });
      if (!item) throw new Error("MISSING_INBOX_ITEM");

      const note = await transaction.journalEntry.create({
        data: { title: item.content.slice(0, 80), content: item.content, category: "Inbox", projectId },
      });
      await transaction.activity.create({
        data: { type: "JOURNAL_ENTRY_CREATED", title: note.title, description: "Created from Inbox", projectId },
      });
      await transaction.inboxItem.delete({ where: { id } });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING_INBOX_ITEM") {
      return { error: "This Inbox item no longer exists." };
    }
    return { error: "Unable to create the project note. Nothing was changed—please try again." };
  }

  refreshInbox();
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function turnInboxIntoFocusNote(id: string, projectId: string) {
  if (!projectId) return { error: "Choose a project for this focus note." };

  try {
    await prisma.$transaction(async (transaction) => {
      const item = await transaction.inboxItem.findUnique({ where: { id } });
      if (!item) throw new Error("MISSING_INBOX_ITEM");

      const note = await transaction.journalEntry.create({
        data: { title: item.content.slice(0, 80), content: item.content, category: "Focus", projectId },
      });
      const plan = await transaction.dailyPlan.upsert({
        where: { planDate: todayInHarare() },
        update: {},
        create: { planDate: todayInHarare() },
      });
      await transaction.dailyPlanNote.upsert({
        where: { dailyPlanId_journalEntryId: { dailyPlanId: plan.id, journalEntryId: note.id } },
        update: {},
        create: { dailyPlanId: plan.id, journalEntryId: note.id },
      });
      await transaction.activity.create({
        data: { type: "JOURNAL_ENTRY_CREATED", title: note.title, description: "Focus note created from Inbox", projectId },
      });
      await transaction.inboxItem.delete({ where: { id } });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING_INBOX_ITEM") {
      return { error: "This Inbox item no longer exists." };
    }
    return { error: "Unable to create the focus note. Nothing was changed—please try again." };
  }

  refreshInbox();
  revalidatePath("/plan");
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}

export async function turnInboxIntoMeeting(id: string, meetingDate: Date) {
  const item = await inboxRepository.findById(id);
  if (!item) throw new Error("This inbox item no longer exists.");
  if (Number.isNaN(meetingDate.getTime())) throw new Error("Choose a valid meeting time.");

  const meeting = await meetingRepository.create({ title: item.content, meetingDate });
  await inboxRepository.delete(id);
  refreshInbox();
  revalidatePath("/calendar");
  revalidatePath("/meetings");
  return meeting;
}
