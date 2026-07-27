"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
} from "@/lib/actions/journal.actions";

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

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Executive Journal</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Journal title"
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
        placeholder="Write your notes..."
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
        Save Journal Entry
      </button>

      <div style={{ marginTop: 30 }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              padding: 16,
              borderBottom: "1px solid #334155",
            }}
          >
            <h3>{entry.title}</h3>

            <p>{entry.content}</p>

            <button
              onClick={() =>
                handleDelete(entry.id)
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
      </div>
    </>
  );
}