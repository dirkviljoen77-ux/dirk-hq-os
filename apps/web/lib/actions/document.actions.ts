"use server";

import { revalidatePath } from "next/cache";
import { documentRepository } from "@/lib/repositories/document.repository";
import { uploadToGoogleDrive } from "@/lib/google-drive";
import { logActivity } from "./activity.actions";

export async function getDocuments(projectId: string) {
  return documentRepository.findByProject(projectId);
}

export async function getAllDocuments() {
  return documentRepository.findAll();
}

export async function createDocument(data: {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  driveFileId?: string;
  webViewLink?: string;
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

export async function uploadDocument(formData: FormData) {
  const file = formData.get("file");
  const projectId = formData.get("projectId");
  const name = formData.get("name");

  if (!(file instanceof File) || !projectId || typeof projectId !== "string") {
    throw new Error("Choose a file and project before uploading.");
  }

  if (file.size > 25 * 1024 * 1024) {
    throw new Error("Files must be 25 MB or smaller.");
  }

  const driveFile = await uploadToGoogleDrive(file);
  const document = await createDocument({
    name: typeof name === "string" && name.trim() ? name.trim() : file.name,
    fileName: file.name,
    fileType: file.type || "application/octet-stream",
    fileSize: file.size,
    projectId,
    driveFileId: driveFile.id,
    webViewLink: driveFile.webViewLink ?? `https://drive.google.com/open?id=${driveFile.id}`,
  });

  revalidatePath("/documents");
  return document;
}
export async function updateDocument(
  id: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  const document =
    await documentRepository.update(id, data);

  await logActivity({
    type: "DOCUMENT_UPDATED",
    title: document.name,
    description: "Document updated",
    projectId: document.projectId,
  });

  revalidatePath(
    `/projects/${document.projectId}`
  );

  return document;
}
export async function deleteDocument(id: string) {
  return documentRepository.delete(id);
}
