"use client";

import { useState } from "react";

import { Meeting } from "../../types/meeting";
import { Note } from "../../types/note";
import { Person } from "../../types/person";
import { Project } from "../../types/project";
import { Task } from "../../types/task";

import { meetings } from "../../data/meetings";
import { people } from "../../data/people";
import { tasks } from "../../data/tasks";

import DashboardPanel from "../dashboard/DashboardPanel";
import MeetingEditor from "./MeetingEditor";
import MeetingList from "./MeetingList";
import NewMeetingButton from "./NewMeetingButton";
import NewNoteButton from "./NewNoteButton";
import NewPersonButton from "./NewPersonButton";
import NewTaskButton from "./NewTaskButton";
import NoteEditor from "./NoteEditor";
import NotesList from "./NotesList";
import PeopleList from "./PeopleList";
import PersonEditor from "./PersonEditor";
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
  const [showPersonEditor, setShowPersonEditor] = useState(false);

  const [projectNotes, setProjectNotes] = useState(notes);

  const [projectTasks, setProjectTasks] = useState(
    tasks.filter((task) => task.projectId === project.id)
  );

  const [projectMeetings, setProjectMeetings] = useState(
    meetings.filter((meeting) => meeting.projectId === project.id)
  );

  const [projectPeople, setProjectPeople] = useState(people);

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

  const handlePersonSave = (
    name: string,
    organisation: string,
    role: string,
    email: string,
    phone: string
  ) => {
    if (!name.trim()) return;

    const newPerson: Person = {
      id: Date.now(),
      name,
      organisation,
      role,
      email,
      phone,
    };

    setProjectPeople((prev) => [newPerson, ...prev]);
    setShowPersonEditor(false);
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
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ProjectStatCard
          title="Tasks"
          value={projectTasks.length.toString()}
        />

        <ProjectStatCard
          title="Meetings"
          value={projectMeetings.length.toString()}
        />

        <ProjectStatCard
          title="People"
          value={projectPeople.length.toString()}
        />

        <ProjectStatCard
          title="Notes"
          value={projectNotes.length.toString()}
        />

        <ProjectStatCard
          title="Documents"
          value="34"
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

        <DashboardPanel title="People">
          <div style={{ marginBottom: "16px" }}>
            <NewPersonButton
              onClick={() => setShowPersonEditor(true)}
            />
          </div>

          {showPersonEditor && (
            <PersonEditor
              onSave={handlePersonSave}
              onCancel={() =>
                setShowPersonEditor(false)
              }
            />
          )}

          <PeopleList people={projectPeople} />
        </DashboardPanel>
      </div>
    </>
  );
}