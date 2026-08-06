"use server";

import { revalidatePath } from "next/cache";
import { inboxRepository } from "@/lib/repositories/inbox.repository";
import { taskRepository } from "@/lib/repositories/task.repository";
import { meetingRepository } from "@/lib/repositories/meeting.repository";
import { journalRepository } from "@/lib/repositories/journal.repository";
import { logActivity } from "./activity.actions";

function refreshInbox() {
  revalidatePath("/inbox");
  revalidatePath("/");
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
  const item = await inboxRepository.findById(id);
  if (!item) throw new Error("This inbox item no longer exists.");
  if (!projectId) throw new Error("Choose a project for this task.");

  const task = await taskRepository.create({ title: item.content, projectId });
  await inboxRepository.delete(id);
  await logActivity({ type: "TASK_CREATED", title: task.title, description: "Created from Inbox", projectId });
  refreshInbox();
  revalidatePath("/tasks");
  revalidatePath(`/projects/${projectId}`);
  return task;
}

export async function turnInboxIntoNote(id: string, projectId: string) {
  const item = await inboxRepository.findById(id);
  if (!item) throw new Error("This inbox item no longer exists.");
  if (!projectId) throw new Error("Choose a project for this note.");

  const note = await journalRepository.create({ title: item.content.slice(0, 80), content: item.content, category: "Inbox", projectId });
  await inboxRepository.delete(id);
  await logActivity({ type: "JOURNAL_ENTRY_CREATED", title: note.title, description: "Created from Inbox", projectId });
  refreshInbox();
  revalidatePath(`/projects/${projectId}`);
  return note;
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
