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