"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createTask,
  getTasks,
  completeTask,
  deleteTask,
  scheduleTask,
} from "@/lib/actions/task.actions";

type Props = {
  projectId: string;
  projectName: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: number;
  status: string;
  scheduledAt?: Date | null;
  durationMinutes?: number;
};

export default function TasksPanel({
  projectId,
  projectName,
}: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(2);
  const [scheduleValues, setScheduleValues] = useState<Record<string, string>>({});
  const [durationValues, setDurationValues] = useState<Record<string, number>>({});

  const [, startTransition] = useTransition();

  async function loadTasks() {
    const data = await getTasks(projectId);
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  async function handleAdd() {
    if (!newTask.trim()) return;

    startTransition(async () => {
      await createTask({
        title: newTask,
        projectId,
        priority,
        dueDate: dueDate
          ? new Date(`${dueDate}T09:00:00`)
          : undefined,
      });

      setNewTask("");
      setDueDate("");
      setPriority(2);

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

  async function handleSchedule(task: Task) {
    const value = scheduleValues[task.id];
    if (!value) return;

    startTransition(async () => {
      await scheduleTask(task.id, new Date(value), durationValues[task.id] ?? task.durationMinutes ?? 60);
      await loadTasks();
    });
  }

  function toDateTimeInput(value?: Date | null) {
    if (!value) return "";
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Harare",
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date(value))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Tasks</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 170px 130px 100px",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`New task for ${projectName}`}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(Number(e.target.value))
          }
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        >
          <option value={1}>High</option>
          <option value={2}>Normal</option>
          <option value={3}>Low</option>
        </select>

        <button
          onClick={handleAdd}
          style={{
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
            alignItems: "center",
            padding: 14,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <input
              type="checkbox"
              checked={task.status === "COMPLETE"}
              onChange={() =>
                handleComplete(task.id)
              }
            />

            <span
              style={{
                marginLeft: 10,
                textDecoration:
                  task.status === "COMPLETE"
                    ? "line-through"
                    : "none",
                fontWeight: 600,
              }}
            >
              {task.title}
            </span>

            {task.dueDate && (
              <div
                style={{
                  marginTop: 6,
                  marginLeft: 28,
                  fontSize: 13,
                  color: "#94A3B8",
                }}
              >
                Due:{" "}
                {new Date(
                  task.dueDate
                ).toLocaleDateString()}
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 10, marginLeft: 28 }}>
              <input
                type="datetime-local"
                aria-label={`Schedule ${task.title}`}
                value={scheduleValues[task.id] ?? toDateTimeInput(task.scheduledAt)}
                onChange={(event) => setScheduleValues((current) => ({ ...current, [task.id]: event.target.value }))}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #475569", background: "#0F172A", color: "white" }}
              />
              <select
                aria-label={`Duration for ${task.title}`}
                value={durationValues[task.id] ?? task.durationMinutes ?? 60}
                onChange={(event) => setDurationValues((current) => ({ ...current, [task.id]: Number(event.target.value) }))}
                style={{ padding: 8, borderRadius: 6, border: "1px solid #475569", background: "#0F172A", color: "white" }}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hour</option>
                <option value={90}>1½ hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
              <button onClick={() => handleSchedule(task)} style={{ padding: "8px 10px", border: 0, borderRadius: 6, background: "#334155", color: "white", cursor: "pointer" }}>Time-block</button>
            </div>
          </div>

          <button
            onClick={() =>
              handleDelete(task.id)
            }
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
