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
  status: string;
};

export default function MilestonesPanel({
  projectId,
}: Props) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [title, setTitle] = useState("");
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
      });

      setTitle("");
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
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New milestone"
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

      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <strong>{milestone.title}</strong>

            <div
              style={{
                color: "#94A3B8",
                marginTop: 4,
              }}
            >
              {milestone.status}
            </div>
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
