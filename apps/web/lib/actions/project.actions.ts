"use server";

import { projectRepository } from "@/lib/repositories/project.repository";

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
  return projectRepository.delete(id);
}