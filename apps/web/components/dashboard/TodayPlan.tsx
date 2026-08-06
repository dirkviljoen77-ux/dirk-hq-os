"use client";

import { useState, useTransition } from "react";
import { completeTask } from "@/lib/actions/task.actions";
import DashboardPanel from "./DashboardPanel";

type Task = {
  id: string;
  title: string;
  project: { name: string };
};

type Meeting = {
  id: string;
  title: string;
  meetingDate: Date;
};

type Props = {
  tasks: Task[];
  meetings: Meeting[];
};

export default function TodayPlan({ tasks: initialTasks, meetings }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function markComplete(task: Task) {
    setPendingTaskId(task.id);
    startTransition(async () => {
      await completeTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setPendingTaskId(null);
    });
  }

  return (
    <DashboardPanel title="Today">
      <p style={{ margin: "0 0 14px", color: "#94A3B8", fontSize: 14 }}>
        Your meetings and work due today.
      </p>

      {meetings.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <strong style={{ color: "#93C5FD", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Meetings</strong>
          {meetings.map((meeting) => (
            <div key={meeting.id} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #334155" }}>
              <span style={{ color: "#93C5FD", fontWeight: 600, whiteSpace: "nowrap" }}>
                {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Harare" }).format(meeting.meetingDate)}
              </span>
              <span>{meeting.title}</span>
            </div>
          ))}
        </div>
      )}

      <div>
        <strong style={{ color: "#93C5FD", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tasks</strong>
        {tasks.length === 0 ? (
          <p style={{ margin: "10px 0 0", color: "#94A3B8" }}>Nothing due today.</p>
        ) : tasks.map((task) => (
          <div key={task.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid #334155" }}>
            <button
              type="button"
              aria-label={`Complete ${task.title}`}
              disabled={isPending}
              onClick={() => markComplete(task)}
              style={{ marginTop: 3, width: 18, height: 18, padding: 0, border: "1px solid #94A3B8", borderRadius: 4, background: "transparent", cursor: "pointer" }}
            />
            <div>
              <div>{pendingTaskId === task.id ? "Completing…" : task.title}</div>
              <div style={{ color: "#94A3B8", fontSize: 13 }}>{task.project.name}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
