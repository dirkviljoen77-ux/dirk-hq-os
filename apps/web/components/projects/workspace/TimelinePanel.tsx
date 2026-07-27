"use client";

import { useProject } from "../store/ProjectContext";

export default function TimelinePanel() {
  const { project } = useProject();

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Project Timeline</h2>

      {project.timeline.length === 0 && (
        <div
          style={{
            color: "#94A3B8",
            padding: 20,
          }}
        >
          No activity recorded yet.
        </div>
      )}

      {project.timeline.map((event) => (
        <div
          key={event.id}
          style={{
            borderLeft: "3px solid #2563EB",
            paddingLeft: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              color: "white",
              fontWeight: 600,
            }}
          >
            {event.description}
          </div>

          <div
            style={{
              color: "#94A3B8",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {event.timestamp}
          </div>
        </div>
      ))}
    </>
  );
}