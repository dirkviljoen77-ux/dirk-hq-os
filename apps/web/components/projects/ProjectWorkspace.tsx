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
import DocumentsList from "./DocumentsList";
import Timeline, {
  TimelineEvent,
} from "./Timeline";

import { documents } from "../../data/documents";

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
    meetings.filter(
      (meeting) => meeting.projectId === project.id
    )
  );

  const [projectPeople, setProjectPeople] =
    useState(people);

    const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>([
      {
        id: 1,
        projectId: project.id,
        title: "Project workspace opened",
        category: "System",
        date: new Date().toISOString(),
      },
    ]);

  const addTimelineEvent = (
    title: string,
    category: string
  ) => {
    setTimelineEvents((prev) => [
      {
        id: Date.now(),
        projectId: project.id,
        title,
        category,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };
  const handleSave = (
    title: string,
    content: string
  ) => {
    const newNote: Note = {
      id: Date.now(),
      projectId: project.id,
      title: title || "Untitled Note",
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjectNotes((prev) => [newNote, ...prev]);

    addTimelineEvent(
      `Note created: ${newNote.title}`,
      "Notes"
    );

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

    addTimelineEvent(
      `Task created: ${title}`,
      "Tasks"
    );

    setShowTaskEditor(false);
  };

  const handleTaskToggle = (id: number) => {
    setProjectTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const updatedTask = {
          ...task,
          completed: !task.completed,
        };

        addTimelineEvent(
          updatedTask.completed
            ? `Task completed: ${updatedTask.title}`
            : `Task reopened: ${updatedTask.title}`,
          "Tasks"
        );

        return updatedTask;
      })
    );
  };

  const handleTaskDelete = (id: number) => {
    const task = projectTasks.find(
      (t) => t.id === id
    );

    if (task) {
      addTimelineEvent(
        `Task deleted: ${task.title}`,
        "Tasks"
      );
    }

    setProjectTasks((prev) =>
      prev.filter((task) => task.id !== id)
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

    setProjectMeetings((prev) => [
      newMeeting,
      ...prev,
    ]);

    addTimelineEvent(
      `Meeting scheduled: ${title}`,
      "Meetings"
    );

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

    setProjectPeople((prev) => [
      newPerson,
      ...prev,
    ]);

    addTimelineEvent(
      `Person added: ${name}`,
      "People"
    );

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
          value={documents
            .filter((d) => d.projectId === project.id)
            .length.toString()}
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
              onCancel={() =>
                setShowTaskEditor(false)
              }
            />
          )}

          <TaskList
            tasks={projectTasks}
            onToggle={handleTaskToggle}
            onDelete={handleTaskDelete}
          />
        </DashboardPanel>

        <DashboardPanel title="Meetings">
          <div style={{ marginBottom: "16px" }}>
            <NewMeetingButton
              onClick={() =>
                setShowMeetingEditor(true)
              }
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
              onClick={() =>
                setShowPersonEditor(true)
              }
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

        <DocumentsList projectId={project.id} />

        <Timeline
          projectId={project.id}
          events={timelineEvents}
        />
      </div>
    </>
  );
}
