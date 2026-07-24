export type ProjectDocument = {
  id: number;
  projectId: number;
  name: string;
  type: string;
  uploaded: string;
};

export const documents: ProjectDocument[] = [

  {
    id: 1,
    projectId: 2,
    name: "BHPC Masterplan.pdf",
    type: "PDF",
    uploaded: "2026-07-24",
  },
  {
    id: 2,
    projectId: 2,
    name: "Financial Model.xlsx",
    type: "Excel",
    uploaded: "2026-07-23",
  },
];