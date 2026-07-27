export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export type Meeting = {
  id: number;
  title: string;
  date: string;
  attendees: string;
};

export type TimelineEvent = {
  id: number;
  type: string;
  description: string;
  timestamp: string;
};

export type ProjectState = {
  tasks: Task[];
  meetings: Meeting[];
  timeline: TimelineEvent[];
};

export const initialProjectState: ProjectState = {
  tasks: [],

  meetings: [],

  timeline: [],
};