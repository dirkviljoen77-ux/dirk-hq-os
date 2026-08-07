"use client";

import { useMemo, useState, useTransition } from "react";
import { addToDailyPlan, removeFromDailyPlan, removeNoteFromDailyPlan } from "@/lib/actions/daily-plan.actions";
import { getSchedulingSuggestions } from "@/lib/actions/scheduling.actions";
import { scheduleTask } from "@/lib/actions/task.actions";
import { generateDailyPlanBrief } from "@/lib/actions/daily-plan-ai.actions";

type Task = { id: string; title: string; dueDate: Date | null; scheduledAt: Date | null; durationMinutes: number; priority: number; project: { id: string; name: string } };
type PlannedItem = { id: string; task: Task };
type PlannedNote = { id: string; journalEntry: { id: string; title: string; content: string; project: { id: string; name: string } } };
type Meeting = { id: string; title: string; meetingDate: Date };
type Props = { plannedItems: PlannedItem[]; plannedNotes: PlannedNote[]; candidates: Task[]; meetings: Meeting[] };

export default function DailyPlanWorkspace({ plannedItems: initialItems, plannedNotes: initialNotes, candidates, meetings }: Props) {
  const [items, setItems] = useState(initialItems);
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<Record<string, Date[]>>({});
  const [aiBrief, setAiBrief] = useState("");
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

  function removeNote(noteId: string) {
    startTransition(async () => {
      await removeNoteFromDailyPlan(noteId);
      setNotes((current) => current.filter((item) => item.journalEntry.id !== noteId));
      setMessage("Removed note from today’s plan.");
    });
  }

  function suggest(task: Task) {
    startTransition(async () => {
      const slots = await getSchedulingSuggestions(task.id);
      setSuggestions((current) => ({ ...current, [task.id]: slots }));
      setMessage(slots.length ? "Choose a suggested time to add the task to your calendar." : "No free working-time slots were found in the next four days.");
    });
  }

  function schedule(task: Task, start: Date) {
    startTransition(async () => {
      await scheduleTask(task.id, new Date(start), task.durationMinutes || 60);
      setSuggestions((current) => ({ ...current, [task.id]: [] }));
      setMessage("Task time-blocked in your calendar.");
    });
  }

  function generateAiBrief() {
    startTransition(async () => {
      const result = await generateDailyPlanBrief();
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setAiBrief(result.brief ?? "");
      setMessage("AI daily brief ready.");
    });
  }

  return (
    <section style={{ color: "#F8FAFC", maxWidth: 1100 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Plan today</h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "8px 0 24px" }}>
        <p style={{ margin: 0, color: "#94A3B8" }}>Choose only the work you can realistically complete around your meetings.</p>
        <button type="button" disabled={isPending} onClick={generateAiBrief} style={{ padding: "10px 14px", border: 0, borderRadius: 8, background: "#7C3AED", color: "white", cursor: "pointer" }}>{isPending ? "Thinking…" : "Plan my day with AI"}</button>
      </div>

      {aiBrief && <div style={{ ...panelStyle, marginBottom: 20, borderColor: "#7C3AED" }}><h2 style={headingStyle}>AI daily brief</h2><div style={{ marginTop: 12, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{aiBrief}</div></div>}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)", gap: 20 }}>
        <div style={panelStyle}>
          <h2 style={headingStyle}>Today’s priorities</h2>
          <p style={hintStyle}>{items.length === 0 ? "Start by choosing up to three important tasks." : `${items.length} task${items.length === 1 ? "" : "s"} selected.`}</p>
          {items.map(({ id, task }, index) => <TaskRow key={id} task={task} prefix={`${index + 1}`} action="Remove" disabled={isPending} onClick={() => remove(task.id)} suggestions={suggestions[task.id]} onSuggest={() => suggest(task)} onSchedule={(start) => schedule(task, start)} />)}
          {items.length === 0 && <p style={{ color: "#94A3B8" }}>Nothing is committed to today yet.</p>}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={panelStyle}>
            <h2 style={headingStyle}>Focus notes</h2>
            {notes.length === 0 ? <p style={hintStyle}>Pin notes from a project Notebook to bring them into today’s plan.</p> : notes.map(({ id, journalEntry }) => (
              <div key={id} style={{ padding: "10px 0", borderBottom: "1px solid #334155" }}>
                <strong>{journalEntry.title}</strong>
                <div style={{ marginTop: 3, color: "#94A3B8", fontSize: 13 }}>{journalEntry.project.name}</div>
                <p style={{ margin: "6px 0", whiteSpace: "pre-wrap", color: "#CBD5E1", fontSize: 14 }}>{journalEntry.content}</p>
                <button type="button" disabled={isPending} onClick={() => removeNote(journalEntry.id)} style={{ padding: 0, border: 0, background: "transparent", color: "#FCA5A5", cursor: "pointer" }}>Remove</button>
              </div>
            ))}
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

function TaskRow({ task, action, onClick, disabled, prefix, suggestions, onSuggest, onSchedule }: { task: Task; action: string; onClick: () => void; disabled: boolean; prefix?: string; suggestions?: Date[]; onSuggest?: () => void; onSchedule?: (start: Date) => void }) {
  const overdue = task.dueDate && new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #334155" }}>
    <div><strong>{prefix ? `${prefix}. ` : ""}{task.title}</strong><div style={{ marginTop: 3, color: "#94A3B8", fontSize: 13 }}>{task.project.name}{task.dueDate ? ` · ${overdue ? "Overdue" : `Due ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(task.dueDate))}`}` : " · No due date"}</div></div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
      {onSuggest && <button type="button" disabled={disabled} onClick={onSuggest} style={{ padding: "8px 10px", border: "1px solid #2563EB", borderRadius: 7, background: "#1D4ED8", color: "#FFFFFF", cursor: "pointer", whiteSpace: "nowrap" }}>Suggest time</button>}
      <button type="button" disabled={disabled} onClick={onClick} style={{ padding: "8px 10px", border: "1px solid #475569", borderRadius: 7, background: "transparent", color: "#F8FAFC", cursor: "pointer", whiteSpace: "nowrap" }}>{action}</button>
      {suggestions?.map((start) => <button key={start.toISOString()} type="button" disabled={disabled} onClick={() => onSchedule?.(start)} style={{ padding: "8px 10px", border: "1px solid #475569", borderRadius: 7, background: "#0F172A", color: "#93C5FD", cursor: "pointer", whiteSpace: "nowrap" }}>{new Intl.DateTimeFormat("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Harare" }).format(start)}</button>)}
    </div>
  </div>;
}

const panelStyle = { padding: 20, border: "1px solid #334155", borderRadius: 12, background: "#1E293B" };
const headingStyle = { margin: 0, fontSize: 19 };
const hintStyle = { margin: "8px 0 14px", color: "#94A3B8" };
