"use server";

import { projectRepository } from "@/lib/repositories/project.repository";
import { revalidatePath } from "next/cache";
import { deleteFromGoogleDrive } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";

export async function getProjects() {
  return projectRepository.findAll();
}

export async function getProject(id: string) {
  return projectRepository.findById(id);
}

export async function createProject(data: {
  name: string;
  description?: string;
}) {
  return projectRepository.create(data);
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
  }
) {
  return projectRepository.update(id, data);
}

export async function deleteProject(id: string) {
  const project = await projectRepository.findById(id);
  if (!project) throw new Error("Project not found.");

  const documents = await prisma.document.findMany({
    where: { projectId: id, driveFileId: { not: null } },
    select: { driveFileId: true },
  });
  for (const document of documents) {
    if (document.driveFileId) await deleteFromGoogleDrive(document.driveFileId);
  }

  await projectRepository.delete(id);
  revalidatePath("/projects");
  revalidatePath("/documents");
}
