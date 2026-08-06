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
  scheduledAt?: Date;
  durationMinutes?: number;
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

export async function scheduleTask(id: string, scheduledAt: Date, durationMinutes = 60) {
  if (Number.isNaN(scheduledAt.getTime())) throw new Error("Choose a valid date and time.");
  if (!Number.isInteger(durationMinutes) || durationMinutes < 15 || durationMinutes > 480) {
    throw new Error("Choose a duration between 15 minutes and 8 hours.");
  }

  const task = await taskRepository.update(id, { scheduledAt, durationMinutes });
  revalidatePath("/");
  revalidatePath("/calendar");
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
