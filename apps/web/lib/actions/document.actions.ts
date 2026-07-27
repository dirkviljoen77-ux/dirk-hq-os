"use server";

import { revalidatePath } from "next/cache";
import { documentRepository } from "@/lib/repositories/document.repository";
import { logActivity } from "./activity.actions";

export async function getDocuments(projectId: string) {
  return documentRepository.findByProject(projectId);
}

export async function createDocument(data: {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  projectId: string;
}) {
  const document = await documentRepository.create(data);

  await logActivity({
    type: "DOCUMENT_ADDED",
    title: data.name,
    description: "Document added",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return document;
}

export async function deleteDocument(id: string) {
  return documentRepository.delete(id);
}