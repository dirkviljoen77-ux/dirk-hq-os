"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createMilestone,
  deleteMilestone,
  getMilestones,
} from "@/lib/actions/milestone.actions";

type Props = {
  projectId: string;
};

type Milestone = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  status: string;
};

export default function MilestonesPanel({
  projectId,
}: Props) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [, startTransition] = useTransition();

  async function loadMilestones() {
    const data = await getMilestones(projectId);
    setMilestones(data);
  }

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  async function handleAdd() {
    if (!title.trim()) return;

    startTransition(async () => {
      await createMilestone({
        title,
        projectId,
        dueDate: dueDate
          ? new Date(`${dueDate}T09:00:00`)
          : undefined,
      });

      setTitle("");
      setDueDate("");

      await loadMilestones();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMilestone(id);
      await loadMilestones();
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Milestones</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 180px 100px",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New milestone"
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

      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 14,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 600,
              }}
            >
              {milestone.title}
            </div>

            <div
              style={{
                color: "#94A3B8",
                marginTop: 4,
              }}
            >
              {milestone.status}
            </div>

            {milestone.dueDate && (
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                Due:{" "}
                {new Date(
                  milestone.dueDate
                ).toLocaleDateString()}
              </div>
            )}
          </div>

          <button
            onClick={() =>
              handleDelete(milestone.id)
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