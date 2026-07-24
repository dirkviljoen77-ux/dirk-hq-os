import AppShell from "../../components/layout/AppShell";
import ProjectGrid from "../../components/projects/ProjectGrid";
import PortfolioSummary from "../../components/projects/PortfolioSummary";
import { Project } from "../../components/projects/types";

const projects: Project[] = [
  {
    id: 1,
    name: "Dirk HQ OS",
    status: "🟢 On Track",
    progress: 28,
    owner: "Dirk Viljoen",
    due: "31 Dec 2026",
  },
  {
    id: 2,
    name: "Zimbabwe Rugby",
    status: "🟡 Planning",
    progress: 12,
    owner: "Dirk Viljoen",
    due: "15 Oct 2026",
  },
  {
    id: 3,
    name: "Podcast Studio",
    status: "🟢 Complete",
    progress: 100,
    owner: "Dirk Viljoen",
    due: "Completed",
  },
  {
    id: 4,
    name: "BHPC Financial Model",
    status: "🟢 Active",
    progress: 82,
    owner: "Dirk Viljoen",
    due: "In Progress",
  },
  {
    id: 5,
    name: "Broadcast Platform",
    status: "🔴 At Risk",
    progress: 35,
    owner: "Dirk Viljoen",
    due: "TBD",
  },
];

export default function ProjectsPage() {
  return (
    <AppShell>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1
            style={{
              color: "white",
              margin: 0,
              fontSize: 32,
            }}
          >
            Projects
          </h1>

          <p
            style={{
              color: "#94A3B8",
              marginTop: 8,
            }}
          >
            Executive Project Portfolio
          </p>
        </div>

        <button
          style={{
            padding: "12px 20px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + New Project
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
        }}
      >
        <ProjectGrid projects={projects} />

        <PortfolioSummary />
      </div>
    </AppShell>
  );
}