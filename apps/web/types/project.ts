export type ProjectStatus =
  | "Planning"
  | "Active"
  | "In Review"
  | "Completed";

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
}