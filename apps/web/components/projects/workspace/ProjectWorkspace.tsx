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
import PeoplePanel from "./PeoplePanel";
import DocumentsPanel from "./DocumentsPanel";
import DecisionsPanel from "./DecisionsPanel";
import RisksPanel from "./RisksPanel";
import MilestonesPanel from "./MilestonesPanel";
import FinancePanel from "./FinancePanel";
import JournalPanel from "./JournalPanel";
import CalendarPanel from "./CalendarPanel";
import ReportsPanel from "./ReportsPanel";

type Props = {
  project: Project;
};

export default function ProjectWorkspace({
  project,
}: Props) {
  const [activeTab, setActiveTab] = useState("Overview");

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
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 12,
          padding: 24,
          minHeight: 500,
          color: "white",
        }}
      >
        {activeTab === "Overview" && (
          <ExecutiveDashboard
            projectId={project.id}
            projectName={project.name}
            owner={project.owner}
            progress={project.progress}
            status={project.status}
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

        {activeTab === "People" && (
          <PeoplePanel
            projectId={project.id}
          />
        )}

        {activeTab === "Documents" && (
          <DocumentsPanel
            projectId={project.id}
          />
        )}

        {activeTab === "Journal" && (
          <JournalPanel
            projectId={project.id}
          />
        )}

        {activeTab === "Decisions" && (
          <DecisionsPanel
            projectId={project.id}
          />
        )}

        {activeTab === "Risks" && (
          <RisksPanel
            projectId={project.id}
          />
        )}

        {activeTab === "Milestones" && (
          <MilestonesPanel
            projectId={project.id}
          />
        )}

        {activeTab === "Calendar" && (
          <CalendarPanel />
        )}

        {activeTab === "Timeline" && (
          <TimelinePanel />
        )}

        {activeTab === "Finance" && (
          <FinancePanel
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