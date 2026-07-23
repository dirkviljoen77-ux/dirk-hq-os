"use client";

import { useState } from "react";

import { Meeting } from "../../types/meeting";
import { Note } from "../../types/note";
import { Project } from "../../types/project";
import { Task } from "../../types/task";

import { meetings } from "../../data/meetings";
import { tasks } from "../../data/tasks";

import DashboardPanel from "../dashboard/DashboardPanel";
import MeetingEditor from "./MeetingEditor";
import MeetingList from "./MeetingList";
import NewMeetingButton from "./NewMeetingButton";
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
  const [showMeetingEditor, setShowMeetingEditor] = useState(false);

  const [projectNotes, setProjectNotes] = useState(notes);

  const [projectTasks, setProjectTasks] = useState(
    tasks.filter((task) => task.projectId === project.id)
  );

  const [projectMeetings, setProjectMeetings] = useState(
    meetings.filter((meeting) => meeting.projectId === project.id)
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

    setProjectNotes((prev) => [newNote, ...prev]);
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

  const handleMeetingSave = (
    title: string,
    date: string
  ) => {
    if (!title.trim()) return;

    const newMeeting: Meeting = {
      id: Date.now(),
      projectId: project.id,
      title,
      date,
    };

    setProjectMeetings((prev) => [newMeeting, ...prev]);
    setShowMeetingEditor(false);
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
        <ProjectStatCard
          title="Meetings"
          value={projectMeetings.length.toString()}
        />
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

        <DashboardPanel title="Meetings">
          <div style={{ marginBottom: "16px" }}>
            <NewMeetingButton
              onClick={() => setShowMeetingEditor(true)}
            />
          </div>

          {showMeetingEditor && (
            <MeetingEditor
              onSave={handleMeetingSave}
              onCancel={() =>
                setShowMeetingEditor(false)
              }
            />
          )}

          <MeetingList meetings={projectMeetings} />
        </DashboardPanel>
      </div>
    </>
  );
}