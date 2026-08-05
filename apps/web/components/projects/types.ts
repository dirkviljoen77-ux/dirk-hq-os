export type Project = {
  id: string;
  name: string;
  progress: number;
  owner: string;
  due: string;

  executiveBrief?: string;
};
