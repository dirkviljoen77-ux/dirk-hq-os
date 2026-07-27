"use client";

import { useState } from "react";

import { Project } from "../types";
import { ProjectProvider } from "../store/ProjectContext";

import ProjectHeader from "./ProjectHeader";
import ExecutiveBrief from "./ExecutiveBrief";
import WorkspaceTabs from "./WorkspaceTabs";
import ExecutiveDashboard from "./ExecutiveDashboard";
import TasksPanel from "./TasksPanel";
import MeetingsPanel from "./MeetingsPanel";
import TimelinePanel from "./TimelinePanel";
import AIPanel from "./AIPanel";

type Props = {
  project: Project;
};

export default function ProjectWorkspace({
  project,
}: Props) {
  const [activeTab, setActiveTab] =
    useState("Overview");

  return (
    <ProjectProvider>
      <ProjectHeader project={project} />

      <ExecutiveBrief project={project} />

      <WorkspaceTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div
        style={{
          background:"#1E293B",
          border:"1px solid #334155",
          borderRadius:12,
          padding:24,
          minHeight:500,
          color:"white",
        }}
      >
        {activeTab==="Overview" && (

          <ExecutiveDashboard
            projectName={project.name}
            owner={project.owner}
            progress={project.progress}
            status={project.status}
          />

        )}

        {activeTab==="Tasks" && (
          <TasksPanel
            projectName={project.name}
          />
        )}

        {activeTab==="Meetings" && (
          <MeetingsPanel
            projectName={project.name}
          />
        )}

        {activeTab==="People" && (
          <h2>People coming next…</h2>
        )}

        {activeTab==="Documents" && (
          <h2>Documents coming next…</h2>
        )}

        {activeTab==="Timeline" && (
          <TimelinePanel/>
        )}

        {activeTab==="Finance" && (
          <h2>Finance coming next…</h2>
        )}

        {activeTab==="AI" && (
          <AIPanel
            projectName={project.name}
            owner={project.owner}
          />
        )}

      </div>

    </ProjectProvider>
  );
}