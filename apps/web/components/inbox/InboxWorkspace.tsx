"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  archiveInboxItem,
  captureInboxItem,
  turnInboxIntoFocusNote,
  turnInboxIntoMeeting,
  turnInboxIntoTask,
} from "@/lib/actions/inbox.actions";

type InboxItem = { id: string; content: string; createdAt: Date; source: string };
type Project = { id: string; name: string };

type Props = { items: InboxItem[]; projects: Project[] };
type InboxChoice = "focus" | "task" | "meeting";

export default function InboxWorkspace({ items: initialItems, projects }: Props) {
  const [items, setItems] = useState(initialItems);
  const [content, setContent] = useState("");
  const [projectIds, setProjectIds] = useState<Record<string, string>>({});
  const [meetingTimes, setMeetingTimes] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, InboxChoice | undefined>>({});
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const remove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setChoices((current) => ({ ...current, [id]: undefined }));
  };

  function capture(event: FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const item = await captureInboxItem(content);
        setItems((current) => [item, ...current]);
        setContent("");
        setMessage("Added to Inbox.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to save this item.");
      }
    });
  }

  function convert(id: string) {
    const choice = choices[id];
    if (!choice) return;

    startTransition(async () => {
      try {
        if (choice === "task") {
          const result = await turnInboxIntoTask(id, projectIds[id] ?? "");
          if (result.error) throw new Error(result.error);
        }
        if (choice === "focus") {
          const result = await turnInboxIntoFocusNote(id, projectIds[id] ?? "");
          if (result.error) throw new Error(result.error);
        }
        if (choice === "meeting") await turnInboxIntoMeeting(id, new Date(meetingTimes[id] ?? ""));
        remove(id);
        setMessage(choice === "focus" ? "Focus note added to the project Notebook and today’s plan." : `Inbox item turned into a ${choice}.`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to convert this item.");
      }
    });
  }

  function archive(id: string) {
    startTransition(async () => {
      await archiveInboxItem(id);
      remove(id);
      setMessage("Archived.");
    });
  }

  return (
    <section style={{ color: "#F8FAFC", maxWidth: 920 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Inbox</h1>
      <p style={{ margin: "8px 0 20px", color: "#94A3B8" }}>Capture first. Decide what it becomes later.</p>

      <form onSubmit={capture} style={{ display: "grid", gap: 12, padding: 20, border: "1px solid #334155", borderRadius: 12, background: "#1E293B", marginBottom: 24 }}>
        <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={3} placeholder="What is on your mind? A task, idea, follow-up, or meeting…" style={fieldStyle} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#94A3B8", fontSize: 14 }}>It stays here until you decide what to do with it.</span>
          <button type="submit" disabled={isPending} style={primaryButtonStyle}>{isPending ? "Saving…" : "Add to Inbox"}</button>
        </div>
      </form>

      {message && <p role="status" style={{ color: "#93C5FD" }}>{message}</p>}
      {items.length === 0 ? <p style={{ color: "#94A3B8" }}>Your Inbox is clear.</p> : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item) => (
            <article key={item.id} style={{ padding: 18, border: "1px solid #334155", borderRadius: 12, background: "#1E293B" }}>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{item.content}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
                <button type="button" disabled={isPending} onClick={() => setChoices((current) => ({ ...current, [item.id]: "focus" }))} style={secondaryButtonStyle}>Focus note</button>
                <button type="button" disabled={isPending} onClick={() => setChoices((current) => ({ ...current, [item.id]: "task" }))} style={secondaryButtonStyle}>Task</button>
                <button type="button" disabled={isPending} onClick={() => setChoices((current) => ({ ...current, [item.id]: "meeting" }))} style={secondaryButtonStyle}>Meeting</button>
                <button type="button" disabled={isPending} onClick={() => archive(item.id)} style={dismissButtonStyle}>Dismiss</button>
              </div>
              {choices[item.id] && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: "1px solid #334155" }}>
                  {choices[item.id] === "meeting" ? (
                    <input aria-label="Meeting date and time" type="datetime-local" value={meetingTimes[item.id] ?? ""} onChange={(event) => setMeetingTimes((current) => ({ ...current, [item.id]: event.target.value }))} style={fieldStyle} />
                  ) : (
                    <select aria-label="Project" value={projectIds[item.id] ?? ""} onChange={(event) => setProjectIds((current) => ({ ...current, [item.id]: event.target.value }))} style={fieldStyle}>
                      <option value="">Choose a project</option>
                      {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                    </select>
                  )}
                  <button type="button" disabled={isPending} onClick={() => convert(item.id)} style={primaryButtonStyle}>
                    {choices[item.id] === "focus" ? "Add focus note" : choices[item.id] === "task" ? "Create task" : "Create meeting"}
                  </button>
                  <button type="button" disabled={isPending} onClick={() => setChoices((current) => ({ ...current, [item.id]: undefined }))} style={dismissButtonStyle}>Cancel</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const fieldStyle = { padding: 10, borderRadius: 8, border: "1px solid #475569", background: "#0F172A", color: "#F8FAFC", boxSizing: "border-box" as const };
const primaryButtonStyle = { padding: "10px 14px", border: 0, borderRadius: 8, background: "#2563EB", color: "white", cursor: "pointer" };
const secondaryButtonStyle = { padding: "10px 12px", border: "1px solid #475569", borderRadius: 8, background: "transparent", color: "#F8FAFC", cursor: "pointer" };
const dismissButtonStyle = { padding: "8px 4px", border: 0, background: "transparent", color: "#94A3B8", cursor: "pointer" };
