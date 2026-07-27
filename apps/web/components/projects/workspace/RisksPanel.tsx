"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createRisk,
  deleteRisk,
  getRisks,
} from "@/lib/actions/risk.actions";

type Props = {
  projectId: string;
};

type Risk = {
  id: string;
  title: string;
  probability: number;
  impact: number;
  status: string;
};

export default function RisksPanel({
  projectId,
}: Props) {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();

  async function loadRisks() {
    const data = await getRisks(projectId);
    setRisks(data);
  }

  useEffect(() => {
    loadRisks();
  }, [projectId]);

  async function handleAdd() {
    if (!title.trim()) return;

    startTransition(async () => {
      await createRisk({
        title,
        projectId,
      });

      setTitle("");
      await loadRisks();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteRisk(id);
      await loadRisks();
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Risk Register</h2>

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
          placeholder="New project risk"
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

      {risks.map((risk) => (
        <div
          key={risk.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <strong>{risk.title}</strong>

            <div
              style={{
                color: "#94A3B8",
                marginTop: 4,
              }}
            >
              Probability: {risk.probability} | Impact: {risk.impact} | {risk.status}
            </div>
          </div>

          <button
            onClick={() => handleDelete(risk.id)}
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
