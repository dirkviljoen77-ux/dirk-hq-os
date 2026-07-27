"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createDecision,
  deleteDecision,
  getDecisions,
} from "@/lib/actions/decision.actions";

type Props = {
  projectId: string;
};

type Decision = {
  id: string;
  title: string;
  status: string;
};

export default function DecisionsPanel({
  projectId,
}: Props) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();

  async function loadDecisions() {
    const data = await getDecisions(projectId);
    setDecisions(data);
  }

  useEffect(() => {
    loadDecisions();
  }, [projectId]);

  async function handleAdd() {
    if (!title.trim()) return;

    startTransition(async () => {
      await createDecision({
        title,
        projectId,
      });

      setTitle("");
      await loadDecisions();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteDecision(id);
      await loadDecisions();
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Decisions</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Decision title"
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

      {decisions.map((decision) => (
        <div
          key={decision.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <strong>{decision.title}</strong>

            <div
              style={{
                color: "#94A3B8",
                marginTop: 4,
              }}
            >
              {decision.status}
            </div>
          </div>

          <button
            onClick={() => handleDelete(decision.id)}
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