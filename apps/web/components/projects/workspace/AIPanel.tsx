"use client";

import { useMemo } from "react";
import { useProject } from "../store/ProjectContext";

type Props = {
  projectName: string;
  owner: string;
};

export default function AIPanel({
  projectName,
  owner,
}: Props) {
  const { project } = useProject();

  const briefing = useMemo(() => {
    const totalTasks = project.tasks.length;

    const completedTasks = project.tasks.filter(
      (t) => t.completed
    ).length;

    const openTasks =
      totalTasks - completedTasks;

    const meetings = project.meetings.length;

    const activity = project.timeline.length;

    let health = "Healthy";

    if (openTasks > 10) health = "Needs Attention";

    if (
      completedTasks >
      openTasks
    )
      health = "On Track";

    const priorities = [];

    if (openTasks > 0)
      priorities.push(
        `${openTasks} open task(s)`
      );

    if (meetings === 0)
      priorities.push(
        "No meetings scheduled"
      );

    if (activity === 0)
      priorities.push(
        "No recent activity"
      );

    return {
      health,
      priorities,
      totalTasks,
      completedTasks,
      meetings,
      activity,
    };
  }, [project]);

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Executive AI Briefing
      </h2>

      <div
        style={{
          background: "#0F172A",
          border: "1px solid #334155",
          borderRadius: 10,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#60A5FA",
          }}
        >
          Executive Summary
        </h3>

        <p>
          Project <strong>{projectName}</strong> is currently{" "}
          <strong>{briefing.health}</strong>.
        </p>

        <p>
          Project owner: <strong>{owner}</strong>
        </p>

        <p>
          There are{" "}
          <strong>{briefing.totalTasks}</strong> total
          tasks,{" "}
          <strong>{briefing.completedTasks}</strong>{" "}
          completed,{" "}
          <strong>
            {briefing.meetings}
          </strong>{" "}
          meetings scheduled and{" "}
          <strong>
            {briefing.activity}
          </strong>{" "}
          recorded project activities.
        </p>
      </div>

      <div
        style={{
          background: "#0F172A",
          border: "1px solid #334155",
          borderRadius: 10,
          padding: 24,
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Recommended Priorities
        </h3>

        {briefing.priorities.length === 0 ? (
          <p>
            No immediate issues detected.
          </p>
        ) : (
          <ul>
            {briefing.priorities.map(
              (priority) => (
                <li key={priority}>
                  {priority}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </>
  );
}