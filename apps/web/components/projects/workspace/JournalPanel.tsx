"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  updateJournalEntry,
} from "@/lib/actions/journal.actions";
import { pinNoteToDailyPlan } from "@/lib/actions/daily-plan.actions";

type Props = {
  projectId: string;
};

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
};

export default function JournalPanel({
  projectId,
}: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [message, setMessage] = useState("");
  const [, startTransition] = useTransition();

  async function loadEntries() {
    const data = await getJournalEntries(projectId);
    setEntries(data);
  }

  useEffect(() => {
    loadEntries();
  }, [projectId]);

  async function handleAdd() {
    if (!title.trim() || !content.trim()) return;

    startTransition(async () => {
      await createJournalEntry({
        title,
        content,
        projectId,
      });

      setTitle("");
      setContent("");
      await loadEntries();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteJournalEntry(id);
      await loadEntries();
    });
  }

  async function handlePin(id: string) {
    startTransition(async () => {
      await pinNoteToDailyPlan(id);
      setMessage("Pinned to today’s plan.");
    });
  }

  function startEditing(entry: JournalEntry) {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setMessage("");
  }

  async function handleSaveEdit(id: string) {
    startTransition(async () => {
      try {
        await updateJournalEntry({ id, title: editTitle, content: editContent, projectId });
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
        setMessage("Note updated.");
        await loadEntries();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to update this note.");
      }
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Project notebook</h2>
      <p style={{ marginTop: 0, color: "#94A3B8" }}>Capture working notes, decisions, questions and thinking for this project. Pin anything important into today’s plan.</p>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Give this note a clear title"
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #475569",
          background: "#0F172A",
          color: "white",
        }}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write, think, plan, or capture a decision…"
        rows={6}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #475569",
          background: "#0F172A",
          color: "white",
          marginBottom: 16,
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
        Save note
      </button>

      {message && <p role="status" style={{ color: "#93C5FD" }}>{message}</p>}

      <div style={{ marginTop: 30 }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              padding: 16,
              borderBottom: "1px solid #334155",
            }}
          >
            {editingId === entry.id ? (
              <>
                <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} aria-label="Note title" style={editTitleStyle} />
                <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} aria-label="Note text" rows={7} style={editContentStyle} />
                <button onClick={() => handleSaveEdit(entry.id)} style={saveButtonStyle}>Save changes</button>
                <button onClick={() => setEditingId(null)} style={cancelButtonStyle}>Cancel</button>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0 }}>{entry.title}</h3>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{entry.content}</p>
                <button onClick={() => startEditing(entry)} style={editButtonStyle}>Edit</button>
                <button
                  onClick={() => handlePin(entry.id)}
                  style={{ border: "1px solid #2563EB", background: "transparent", color: "#93C5FD", borderRadius: 6, padding: "7px 10px", cursor: "pointer", marginRight: 14 }}
                >
                  Pin to Plan today
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  style={{ border: "none", background: "transparent", color: "#EF4444", cursor: "pointer" }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

const editTitleStyle = { width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #475569", background: "#0F172A", color: "white", boxSizing: "border-box" as const };
const editContentStyle = { ...editTitleStyle, marginBottom: 12, resize: "vertical" as const };
const saveButtonStyle = { padding: "8px 12px", border: 0, borderRadius: 6, background: "#2563EB", color: "white", cursor: "pointer", marginRight: 12 };
const cancelButtonStyle = { border: 0, background: "transparent", color: "#94A3B8", cursor: "pointer" };
const editButtonStyle = { border: "1px solid #475569", background: "transparent", color: "#E2E8F0", borderRadius: 6, padding: "7px 10px", cursor: "pointer", marginRight: 10 };
