import { Project } from "./types";

export const projects: Project[] = [
  {
    id: 1,
    name: "Dirk HQ OS",
    status: "🟢 On Track",
    progress: 28,
    owner: "Dirk Viljoen",
    due: "31 Dec 2026",
    executiveBrief:
      "Navigation, dashboard, project portfolio and routing are complete. The recommended next milestone is to build the Executive Workspace modules.",
  },
  {
    id: 2,
    name: "Zimbabwe Rugby",
    status: "🟡 Planning",
    progress: 12,
    owner: "Dirk Viljoen",
    due: "15 Oct 2026",
    executiveBrief:
      "Governance planning has commenced. High-performance planning and funding workstreams are active.",
  },
  {
    id: 3,
    name: "Podcast Studio",
    status: "🟢 Complete",
    progress: 100,
    owner: "Dirk Viljoen",
    due: "Completed",
    executiveBrief:
      "Studio design, furniture layout and equipment specification have been completed.",
  },
  {
    id: 4,
    name: "BHPC Financial Model",
    status: "🟢 Active",
    progress: 82,
    owner: "Dirk Viljoen",
    due: "In Progress",
    executiveBrief:
      "Financial model is approaching completion with standardised worksheets and executive reporting.",
  },
  {
    id: 5,
    name: "Broadcast Platform",
    status: "🔴 At Risk",
    progress: 35,
    owner: "Dirk Viljoen",
    due: "TBD",
    executiveBrief:
      "Broadcast architecture has been designed. Procurement and implementation planning remain outstanding.",
  },
];