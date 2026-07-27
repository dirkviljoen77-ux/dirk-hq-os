"use client";

import { useEffect, useState } from "react";
import { getProjectContext } from "@/lib/actions/ai.actions";

type Props = {
  projectId: string;
  projectName: string;
  owner: string;
};

export default function AIPanel({
  projectId,
  projectName,
  owner,
}: Props) {
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getProjectContext(projectId);
      setContext(data);
    }

    load();
  }, [projectId]);

  if (!context) {
    return <p>Loading AI context...</p>;
  }

  return (
    <>
      <h2>Executive AI</h2>

      <div
        style={{
          background: "#0F172A",
          padding: 20,
          borderRadius: 12,
          marginBottom: 24,
        }}
      >
        <strong>Project</strong>

        <p>{projectName}</p>

        <strong>Owner</strong>

        <p>{owner}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
        }}
      >
        <Metric title="Tasks" value={context.tasks.length} />
        <Metric title="Meetings" value={context.meetings.length} />
        <Metric title="People" value={context.people.length} />
        <Metric title="Documents" value={context.documents.length} />
        <Metric title="Activity" value={context.activities.length} />
      </div>

      <div
        style={{
          marginTop: 32,
          background: "#1E293B",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3>Executive Commands</h3>

        <p>• Summarise this project</p>
        <p>• What changed today?</p>
        <p>• What is overdue?</p>
        <p>• Draft a board update</p>
        <p>• Prepare my next meeting</p>
        <p>• Analyse project risk</p>
      </div>
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
        background: "#1E293B",
        padding: 18,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          color: "#94A3B8",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}
