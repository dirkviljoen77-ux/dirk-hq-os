"use client";

import { useEffect, useState } from "react";
import { Project } from "../types";
import { getExecutiveBrief } from "@/lib/actions/executiveBrief.actions";

type Props = {
  project: Project;
};

type ExecutiveBrief = {
  projectName: string;
  projectHealth: string;
  progress: number;

  openTasks: number;
  completedTasks: number;

  upcomingMeetings: number;
  upcomingMilestones: number;

  people: number;
  documents: number;

  recentActivity: number;
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
    <p>Health: {brief.projectHealth}</p>
    <p>Progress: {brief.progress}%</p>

    <p>Open Tasks: {brief.openTasks}</p>
    <p>Completed Tasks: {brief.completedTasks}</p>

    <p>Upcoming Meetings: {brief.upcomingMeetings}</p>
    <p>Upcoming Milestones: {brief.upcomingMilestones}</p>

    <p>People: {brief.people}</p>
    <p>Documents: {brief.documents}</p>

    <p>Recent Activity: {brief.recentActivity}</p>
  </>
)}
    </div>
  );
}