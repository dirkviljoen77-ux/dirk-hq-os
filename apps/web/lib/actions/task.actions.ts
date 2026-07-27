"use server";

import { revalidatePath } from "next/cache";
import { taskRepository } from "@/lib/repositories/task.repository";

export async function getTasks(projectId: string) {
  return taskRepository.findByProject(projectId);
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: number;
  dueDate?: Date;
  projectId: string;
}) {
  const task = await taskRepository.create(data);

  revalidatePath(`/projects/${data.projectId}`);

  return task;
}

export async function completeTask(id: string) {
  const task = await taskRepository.update(id, {
    status: "COMPLETE",
  });

  return task;
}

export async function deleteTask(id: string) {
  return taskRepository.delete(id);
}