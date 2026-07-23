"use client";

import { useState } from "react";

import { Note } from "../../types/note";
import { Project } from "../../types/project";

import DashboardPanel from "../dashboard/DashboardPanel";
import NewNoteButton from "./NewNoteButton";
import NoteEditor from "./NoteEditor";
import NotesList from "./NotesList";
import ProjectHeader from "./ProjectHeader";
import ProjectStatCard from "./ProjectStatCard";

type ProjectWorkspaceProps = {
  project: Project;
  notes: Note[];
};

export default function ProjectWorkspace({
  project,
  notes,
}: ProjectWorkspaceProps) {
  const [showEditor, setShowEditor] = useState(false);

  const [projectNotes, setProjectNotes] = useState(notes);

  const handleSave = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now(),
      projectId: project.id,
      title: title || "Untitled Note",
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjectNotes([newNote, ...projectNotes]);
    setShowEditor(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "30px",
        }}
      >
        <ProjectHeader project={project} />

        <NewNoteButton
          onClick={() => setShowEditor(true)}
        />
      </div>

      {showEditor && (
        <NoteEditor
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ProjectStatCard title="Tasks" value="12" />
        <ProjectStatCard title="Documents" value="34" />
        <ProjectStatCard title="Meetings" value="5" />
        <ProjectStatCard
          title="Notes"
          value={projectNotes.length.toString()}
        />
      </div>

      <DashboardPanel title="Executive Notes">
        <NotesList notes={projectNotes} />
      </DashboardPanel>
    </>
  );
}