"use client";

import { useEffect, useState } from "react";
import { Project } from "../types";
import { getExecutiveBrief } from "@/lib/actions/executiveBrief.actions";

type Props = {
  project: Project;
};

type ExecutiveBrief = {
  tasks: unknown[];
  meetings: unknown[];
  people: unknown[];
  documents: unknown[];
  activity: unknown[];
};

export default function ExecutiveBrief({
  project,
}: Props) {
  const [brief, setBrief] =
    useState<ExecutiveBrief | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getExecutiveBrief(
        project.id
      );

      setBrief(data);
    }

    load();
  }, [project.id]);

  return (
    <div
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginTop: 0,
        }}
      >
        Executive Brief
      </h2>

      <p
        style={{
          color: "#CBD5E1",
        }}
      >
        {project.executiveBrief}
      </p>

      <hr
        style={{
          borderColor: "#334155",
          margin: "20px 0",
        }}
      />

      {!brief ? (
        <p
          style={{
            color: "#94A3B8",
          }}
        >
          Loading executive data...
        </p>
      ) : (
        <>
          <p>Open Tasks: {brief.tasks.length}</p>
          <p>Meetings: {brief.meetings.length}</p>
          <p>People: {brief.people.length}</p>
          <p>Documents: {brief.documents.length}</p>
          <p>Recent Activity: {brief.activity.length}</p>
        </>
      )}
    </div>
  );
}