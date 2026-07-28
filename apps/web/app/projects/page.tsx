import AppShell from "../../components/layout/AppShell";
import ProjectGrid from "../../components/projects/ProjectGrid";
import PortfolioSummary from "../../components/projects/PortfolioSummary";
import { getProjects } from "@/lib/actions/project.actions";

export default async function ProjectsPage() {
  const projects = await getProjects();

  const mappedProjects = projects.map((project: any) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    progress: 0,
    owner: "Dirk Viljoen",
    due: "-",
  }));

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
        <ProjectGrid projects={mappedProjects} />

        <PortfolioSummary />
      </div>
    </AppShell>
  );
}