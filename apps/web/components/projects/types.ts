export type Project = {
  id: string;
  name: string;
  status: string;
  progress: number;
  owner: string;
  due: string;

  executiveBrief?: string;
};