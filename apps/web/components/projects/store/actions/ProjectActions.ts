import { ProjectState, Task, Meeting } from "../ProjectStore";

export function addTask(
  state: ProjectState,
  title: string
): ProjectState {
  const task: Task = {
    id: Date.now(),
    title,
    completed: false,
  };

  return {
    ...state,

    tasks: [...state.tasks, task],

    timeline: [
      {
        id: Date.now() + 1,
        type: "Task",
        description: `Task created: ${title}`,
        timestamp: new Date().toLocaleString(),
      },
      ...state.timeline,
    ],
  };
}

export function completeTask(
  state: ProjectState,
  id: number
): ProjectState {
  return {
    ...state,

    tasks: state.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
          }
        : task
    ),

    timeline: [
      {
        id: Date.now() + 2,
        type: "Task",
        description: "Task completion updated",
        timestamp: new Date().toLocaleString(),
      },
      ...state.timeline,
    ],
  };
}

export function deleteTask(
  state: ProjectState,
  id: number
): ProjectState {
  const task = state.tasks.find((t) => t.id === id);

  return {
    ...state,

    tasks: state.tasks.filter((t) => t.id !== id),

    timeline: [
      {
        id: Date.now() + 3,
        type: "Task",
        description: `Task deleted: ${task?.title ?? ""}`,
        timestamp: new Date().toLocaleString(),
      },
      ...state.timeline,
    ],
  };
}

export function addMeeting(
  state: ProjectState,
  meeting: Meeting
): ProjectState {
  return {
    ...state,

    meetings: [...state.meetings, meeting],

    timeline: [
      {
        id: Date.now() + 4,
        type: "Meeting",
        description: `Meeting scheduled: ${meeting.title}`,
        timestamp: new Date().toLocaleString(),
      },
      ...state.timeline,
    ],
  };
}