"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createTask,
  getTasks,
  completeTask,
  deleteTask,
} from "@/lib/actions/task.actions";

type Props = {
  projectId: string;
  projectName: string;
};

type Task = {
  id: string;
  title: string;
  status: string;
};

export default function TasksPanel({
  projectId,
  projectName,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [, startTransition] = useTransition();

  async function loadTasks() {
    const data = await getTasks(projectId);
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAdd() {
    if (!newTask.trim()) return;

    startTransition(async () => {
      await createTask({
        title: newTask,
        projectId,
      });

      setNewTask("");
      await loadTasks();
    });
  }

  async function handleComplete(id: string) {
    startTransition(async () => {
      await completeTask(id);
      await loadTasks();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTask(id);
      await loadTasks();
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Tasks</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`New task for ${projectName}`}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <button
          onClick={handleAdd}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: 8,
            background: "#2563EB",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={task.status === "COMPLETE"}
              onChange={() => handleComplete(task.id)}
            />

            <span
              style={{
                marginLeft: 10,
                textDecoration:
                  task.status === "COMPLETE"
                    ? "line-through"
                    : "none",
              }}
            >
              {task.title}
            </span>
          </div>

          <button
            onClick={() => handleDelete(task.id)}
            style={{
              border: "none",
              background: "transparent",
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}