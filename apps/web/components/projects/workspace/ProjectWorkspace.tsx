"use client";

import { useState } from "react";

import { Project } from "../types";
import { ProjectProvider } from "../store/ProjectContext";

import ProjectHeader from "./ProjectHeader";
import WorkspaceTabs from "./WorkspaceTabs";
import ExecutiveDashboard from "./ExecutiveDashboard";
import TasksPanel from "./TasksPanel";
import MeetingsPanel from "./MeetingsPanel";
import ActivityPanel from "./ActivityPanel";
import AIPanel from "./AIPanel";
import JournalPanel from "./JournalPanel";

import DocumentsPanel from "./DocumentsPanel";
import CalendarPanel from "./CalendarPanel";
import ReportsPanel from "./ReportsPanel";

type Props = {
  project: Project;
};

export default function ProjectWorkspace({
  project,
}: Props) {
  const [activeTab, setActiveTab] = useState("Notes");

  return (
    <ProjectProvider>
      <ProjectHeader project={project} />

      <WorkspaceTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div
        style={{
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: 24,
          minHeight: 500,
          color: "white",
        }}
      >
        {activeTab === "Notes" && <JournalPanel projectId={project.id} />}

        {activeTab === "Overview" && (
          <ExecutiveDashboard
            projectId={project.id}
            projectName={project.name}
            owner={project.owner}
            progress={project.progress}
          />
        )}

        {activeTab === "Tasks" && (
          <TasksPanel
            projectId={project.id}
            projectName={project.name}
          />
        )}

        {activeTab === "Meetings" && (
          <MeetingsPanel
            projectId={project.id}
            projectName={project.name}
          />
        )}

        

        {activeTab === "Documents" && (
          <DocumentsPanel
            projectId={project.id}
          />
        )}

        

        

        {activeTab === "Calendar" && (
          <CalendarPanel />
        )}

        {activeTab === "Activity" && (
  <ActivityPanel
  projectId={project.id}
/>
)}

        

        {activeTab === "Reports" && (
          <ReportsPanel
            projectId={project.id}
          />
        )}

        {activeTab === "AI" && (
          <AIPanel
            projectId={project.id}
            projectName={project.name}
            owner={project.owner}
          />
        )}
      </div>
    </ProjectProvider>
  );
}
