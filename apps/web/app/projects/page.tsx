export const dynamic = "force-dynamic";

import AppShell from "../../components/layout/AppShell";
import ProjectGrid from "../../components/projects/ProjectGrid";
import { getProjects } from "@/lib/actions/project.actions";
import Link from "next/link";
type Props = { searchParams: Promise<{ status?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const projects = await getProjects();
  const { status } = await searchParams;
  const visibleProjects = status === "active"
    ? projects.filter((project) => project.status.toLowerCase() === "active")
    : projects;

  const mappedProjects = visibleProjects.map((project: any) => ({
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
            {status === "active" ? "Active projects" : "Executive Project Portfolio"}
          </p>
        </div>

        <Link
          href="/projects/new"
          style={{
            padding: "12px 20px",
            background: "#2563EB",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          + New Project
        </Link>
      </div>

      <ProjectGrid projects={mappedProjects} />
    </AppShell>
  );
}
