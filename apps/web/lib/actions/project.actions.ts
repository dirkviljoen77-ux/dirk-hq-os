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
  const project = await projectRepository.create(data);
  revalidatePath("/");
  revalidatePath("/projects");
  return project;
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
  }
) {
  const project = await projectRepository.update(id, data);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function deleteProject(id: string) {
  try {
    const project = await projectRepository.findById(id);
    if (!project) return { error: "Project not found." };

    const documents = await prisma.document.findMany({
      where: { projectId: id, driveFileId: { not: null } },
      select: { driveFileId: true },
    });
    for (const document of documents) {
      if (document.driveFileId) await deleteFromGoogleDrive(document.driveFileId);
    }

    await projectRepository.delete(id);
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/documents");
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to delete this project." };
  }
}
