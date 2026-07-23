import { Task } from "../types/task";

export const tasks: Task[] = [
  {
    id: 1,
    projectId: 1,
    title: "Call Liam Middleton",
    completed: false,
    createdAt: "2026-07-10T09:00:00Z",
  },
  {
    id: 2,
    projectId: 1,
    title: "Review World Rugby budget",
    completed: true,
    createdAt: "2026-07-10T10:30:00Z",
  },
  {
    id: 3,
    projectId: 2,
    title: "Approve podcast equipment list",
    completed: false,
    createdAt: "2026-07-10T11:15:00Z",
  },
];