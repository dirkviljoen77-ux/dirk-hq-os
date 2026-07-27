"use client";

import { useProject } from "../store/ProjectContext";

type Props = {
  status: string;
  owner: string;
  progress: number;
  due: string;
};

export default function OverviewPanel({
  status,
  owner,
  progress,
  due,
}: Props) {
  const { project } = useProject();

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (t) => t.completed
  ).length;
  const openTasks = totalTasks - completedTasks;

  const totalMeetings = project.meetings.length;
  const totalActivity = project.timeline.length;

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Executive Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <MetricCard
          title="Status"
          value={status}
        />

        <MetricCard
          title="Progress"
          value={`${progress}%`}
        />

        <MetricCard
          title="Owner"
          value={owner}
        />

        <MetricCard
          title="Due"
          value={due}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <MetricCard
          title="Open Tasks"
          value={String(openTasks)}
        />

        <MetricCard
          title="Completed"
          value={String(completedTasks)}
        />

        <MetricCard
          title="Meetings"
          value={String(totalMeetings)}
        />

        <MetricCard
          title="Activity"
          value={String(totalActivity)}
        />
      </div>

      <h3>Recent Activity</h3>

      {project.timeline.length === 0 ? (
        <p style={{ color: "#94A3B8" }}>
          No activity yet.
        </p>
      ) : (
        project.timeline
          .slice(0, 5)
          .map((event) => (
            <div
              key={event.id}
              style={{
                padding: "10px 0",
                borderBottom:
                  "1px solid #334155",
              }}
            >
              <div>{event.description}</div>

              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 13,
                }}
              >
                {event.timestamp}
              </div>
            </div>
          ))
      )}
    </>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: 18,
      }}
    >
      <div
        style={{
          color: "#94A3B8",
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: 700,
          marginTop: 8,
        }}
      >
        {value}
      </div>
    </div>
  );
}