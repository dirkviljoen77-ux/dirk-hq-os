export type TimelineEvent = {
  id: number;
  projectId: number;
  date: string;
  category:
    | "Document"
    | "Meeting"
    | "Task"
    | "Note"
    | "Person";
  title: string;
};

export const timeline: TimelineEvent[] = [
  {
    id: 1,
    projectId: 2,
    date: "2026-07-24 09:30",
    category: "Document",
    title: "BHPC Masterplan.pdf added",
  },
  {
    id: 2,
    projectId: 2,
    date: "2026-07-24 10:15",
    category: "Meeting",
    title: "Design Review meeting created",
  },
  {
    id: 3,
    projectId: 2,
    date: "2026-07-24 11:00",
    category: "Task",
    title: "Update Financial Model assigned",
  },
  {
    id: 4,
    projectId: 2,
    date: "2026-07-24 11:45",
    category: "Note",
    title: "Executive note updated",
  },
];