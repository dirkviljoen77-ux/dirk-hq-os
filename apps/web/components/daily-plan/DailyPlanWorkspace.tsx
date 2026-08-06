"use client";

import { useMemo, useState, useTransition } from "react";
import { addToDailyPlan, removeFromDailyPlan } from "@/lib/actions/daily-plan.actions";

type Task = { id: string; title: string; dueDate: Date | null; priority: number; project: { id: string; name: string } };
type PlannedItem = { id: string; task: Task };
type Meeting = { id: string; title: string; meetingDate: Date };
type Props = { plannedItems: PlannedItem[]; candidates: Task[]; meetings: Meeting[] };

export default function DailyPlanWorkspace({ plannedItems: initialItems, candidates, meetings }: Props) {
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const plannedTaskIds = useMemo(() => new Set(items.map((item) => item.task.id)), [items]);
  const availableTasks = candidates.filter((task) => !plannedTaskIds.has(task.id));

  function add(task: Task) {
    startTransition(async () => {
      await addToDailyPlan(task.id);
      setItems((current) => [...current, { id: task.id, task }]);
      setMessage("Added to today’s plan.");
    });
  }

  function remove(taskId: string) {
    startTransition(async () => {
      await removeFromDailyPlan(taskId);
      setItems((current) => current.filter((item) => item.task.id !== taskId));
      setMessage("Removed from today’s plan.");
    });
  }

  return (
    <section style={{ color: "#F8FAFC", maxWidth: 1100 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Plan today</h1>
      <p style={{ margin: "8px 0 24px", color: "#94A3B8" }}>Choose only the work you can realistically complete around your meetings.</p>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)", gap: 20 }}>
        <div style={panelStyle}>
          <h2 style={headingStyle}>Today’s priorities</h2>
          <p style={hintStyle}>{items.length === 0 ? "Start by choosing up to three important tasks." : `${items.length} task${items.length === 1 ? "" : "s"} selected.`}</p>
          {items.map(({ id, task }, index) => <TaskRow key={id} task={task} prefix={`${index + 1}`} action="Remove" disabled={isPending} onClick={() => remove(task.id)} />)}
          {items.length === 0 && <p style={{ color: "#94A3B8" }}>Nothing is committed to today yet.</p>}
        </div>

        <div style={panelStyle}>
          <h2 style={headingStyle}>Today’s meetings</h2>
          {meetings.length === 0 ? <p style={hintStyle}>No meetings scheduled today.</p> : meetings.map((meeting) => (
            <div key={meeting.id} style={{ padding: "10px 0", borderBottom: "1px solid #334155" }}>
              <strong style={{ color: "#93C5FD" }}>{new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Harare" }).format(meeting.meetingDate)}</strong>
              <span style={{ marginLeft: 10 }}>{meeting.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panelStyle, marginTop: 20 }}>
        <h2 style={headingStyle}>Open work</h2>
        <p style={hintStyle}>Pick what deserves your attention today. You can time-block selected tasks from the project task screen.</p>
        {availableTasks.length === 0 ? <p style={{ color: "#94A3B8" }}>No other outstanding tasks.</p> : availableTasks.map((task) => <TaskRow key={task.id} task={task} action="Add to today" disabled={isPending} onClick={() => add(task)} />)}
      </div>
      {message && <p role="status" style={{ color: "#93C5FD" }}>{message}</p>}
      <style jsx>{`@media (max-width: 760px) { section > div:first-of-type { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

function TaskRow({ task, action, onClick, disabled, prefix }: { task: Task; action: string; onClick: () => void; disabled: boolean; prefix?: string }) {
  const overdue = task.dueDate && new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #334155" }}>
    <div><strong>{prefix ? `${prefix}. ` : ""}{task.title}</strong><div style={{ marginTop: 3, color: "#94A3B8", fontSize: 13 }}>{task.project.name}{task.dueDate ? ` · ${overdue ? "Overdue" : `Due ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(task.dueDate))}`}` : " · No due date"}</div></div>
    <button type="button" disabled={disabled} onClick={onClick} style={{ padding: "8px 10px", border: "1px solid #475569", borderRadius: 7, background: "transparent", color: "#F8FAFC", cursor: "pointer", whiteSpace: "nowrap" }}>{action}</button>
  </div>;
}

const panelStyle = { padding: 20, border: "1px solid #334155", borderRadius: 12, background: "#1E293B" };
const headingStyle = { margin: 0, fontSize: 19 };
const hintStyle = { margin: "8px 0 14px", color: "#94A3B8" };
