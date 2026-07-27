"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/lib/actions/dashboard.actions";
import ActivityTimeline from "./ActivityTimeline";

type DashboardSummary = {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalMeetings: number;
  totalPeople: number;
  totalDocuments: number;
};

type Props = {
  projectId: string;
  projectName: string;
  owner: string;
  progress: number;
  status: string;
};

export default function ExecutiveDashboard({
  projectId,
  projectName,
  owner,
  progress,
  status,
}: Props) {

  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getDashboardSummary();
      setSummary(data);
    }

    load();
  }, []);

  if (!summary) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Executive Dashboard
      </h2>

      <p>
        <strong>Project:</strong> {projectName}
      </p>

      <p>
        <strong>Owner:</strong> {owner}
      </p>

      <p>
        <strong>Status:</strong> {status}
      </p>

      <p>
        <strong>Progress:</strong> {progress}%
      </p>

      <hr style={{ margin: "24px 0" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px,1fr))",
          gap: 20,
        }}
      >
        <Metric
          title="Projects"
          value={summary.totalProjects}
        />

        <Metric
          title="Active Projects"
          value={summary.activeProjects}
        />

        <Metric
          title="Tasks"
          value={summary.totalTasks}
        />

        <Metric
          title="Completed Tasks"
          value={summary.completedTasks}
        />

        <Metric
          title="Meetings"
          value={summary.totalMeetings}
        />

        <Metric
          title="People"
          value={summary.totalPeople}
        />

        <Metric
          title="Documents"
          value={summary.totalDocuments}
        />
      </div>
      <ActivityTimeline projectId={projectId} />
      
    </>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#94A3B8",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "white",
        }}
      >
        {value}
      </div>
    </div>
  );
}