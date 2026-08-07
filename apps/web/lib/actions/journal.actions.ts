"use server";

import { revalidatePath } from "next/cache";
import { journalRepository } from "@/lib/repositories/journal.repository";
import { logActivity } from "./activity.actions";

export async function getJournalEntries(
  projectId: string
) {
  return journalRepository.findByProject(projectId);
}

export async function createJournalEntry(data: {
  title: string;
  content: string;
  category?: string;
  projectId: string;
}) {
  const entry =
    await journalRepository.create(data);

  await logActivity({
    type: "JOURNAL_ENTRY_CREATED",
    title: data.title,
    description: "Journal entry added",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return entry;
}

export async function deleteJournalEntry(
  id: string
) {
  return journalRepository.delete(id);
}

export async function updateJournalEntry(data: {
  id: string;
  title: string;
  content: string;
  projectId: string;
}) {
  const title = data.title.trim();
  const content = data.content.trim();
  if (!title || !content) throw new Error("A note needs both a title and text.");

  const entry = await journalRepository.update(data.id, { title, content });
  await logActivity({
    type: "JOURNAL_ENTRY_UPDATED",
    title,
    description: "Journal entry updated",
    projectId: data.projectId,
  });
  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath("/plan");

  return entry;
}
