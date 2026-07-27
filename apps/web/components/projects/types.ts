export type Project = {
  id: number;
  name: string;
  status: string;
  progress: number;
  owner: string;
  due: string;

  executiveBrief?: string;
};