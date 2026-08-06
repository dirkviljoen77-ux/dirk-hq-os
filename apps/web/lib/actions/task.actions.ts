"use server";

import { revalidatePath } from "next/cache";
import { taskRepository } from "@/lib/repositories/task.repository";
import { logActivity } from "./activity.actions";

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

  await logActivity({
    type: "TASK_CREATED",
    title: data.title,
    description: "Task created",
    projectId: data.projectId,
  });

  revalidatePath(`/projects/${data.projectId}`);

  return task;
}

export async function completeTask(id: string) {
  const task = await taskRepository.update(id, {
    status: "COMPLETE",
  });

  await logActivity({
    type: "TASK_COMPLETED",
    title: task.title,
    description: "Task completed",
    projectId: task.projectId,
  });

  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath(`/projects/${task.projectId}`);

  return task;
}

export async function deleteTask(id: string) {
  const task = await taskRepository.findById(id);

  if (task) {
    await logActivity({
      type: "TASK_DELETED",
      title: task.title,
      description: "Task deleted",
      projectId: task.projectId,
    });
  }

  return taskRepository.delete(id);
}
