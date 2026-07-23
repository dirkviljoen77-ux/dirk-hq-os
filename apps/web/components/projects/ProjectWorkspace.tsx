"use client";

import { useState } from "react";

import { Note } from "../../types/note";
import { Project } from "../../types/project";
import { Task } from "../../types/task";

import { tasks } from "../../data/tasks";

import DashboardPanel from "../dashboard/DashboardPanel";
import NewNoteButton from "./NewNoteButton";
import NewTaskButton from "./NewTaskButton";
import NoteEditor from "./NoteEditor";
import NotesList from "./NotesList";
import ProjectHeader from "./ProjectHeader";
import ProjectStatCard from "./ProjectStatCard";
import TaskEditor from "./TaskEditor";
import TaskList from "./TaskList";

type ProjectWorkspaceProps = {
  project: Project;
  notes: Note[];
};

export default function ProjectWorkspace({
  project,
  notes,
}: ProjectWorkspaceProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [showTaskEditor, setShowTaskEditor] = useState(false);

  const [projectNotes, setProjectNotes] = useState(notes);

  const [projectTasks, setProjectTasks] = useState(
    tasks.filter((task) => task.projectId === project.id)
  );

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

  const handleTaskSave = (title: string) => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      projectId: project.id,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setProjectTasks((prev) => [newTask, ...prev]);
    setShowTaskEditor(false);
  };

  const handleTaskToggle = (id: number) => {
    setProjectTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
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

        <NewNoteButton onClick={() => setShowEditor(true)} />
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
        <ProjectStatCard
          title="Tasks"
          value={projectTasks.length.toString()}
        />
        <ProjectStatCard title="Documents" value="34" />
        <ProjectStatCard title="Meetings" value="5" />
        <ProjectStatCard
          title="Notes"
          value={projectNotes.length.toString()}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <DashboardPanel title="Executive Notes">
          <NotesList notes={projectNotes} />
        </DashboardPanel>

        <DashboardPanel title="Tasks">
          <div style={{ marginBottom: "16px" }}>
            <NewTaskButton
              onClick={() => setShowTaskEditor(true)}
            />
          </div>

          {showTaskEditor && (
            <TaskEditor
              onSave={handleTaskSave}
              onCancel={() => setShowTaskEditor(false)}
            />
          )}

          <TaskList
            tasks={projectTasks}
            onToggle={handleTaskToggle}
          />
        </DashboardPanel>
      </div>
    </>
  );
}