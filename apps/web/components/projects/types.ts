export type Project = {
  id: string;
  name: string;
  progress: number;
  owner: string;
  due: string;

  executiveBrief?: string;
};

export type ProjectCardData = {
  id: string;
  name: string;
  status: string;
  quotationCount: number;
  jobCount: number;
  activeJobCount: number;
  quotationValue: number;
  actualCosts: number;
  grossProfit: number;
  amountReceived: number;
  amountDue: number;
  nextJobDate?: string;
  openTaskCount: number;
  updatedAt: string;

};
