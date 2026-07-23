import AppShell from "../../../components/app/AppShell";
import ProjectHeader from "../../../components/projects/ProjectHeader";
import ProjectStatCard from "../../../components/projects/ProjectStatCard";
import DashboardPanel from "../../../components/dashboard/DashboardPanel";
import { projects } from "../../../data/projects";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  const project = projects.find(
    (p) => p.id === Number(id)
  );

  if (!project) {
    return (
      <AppShell>
        <h1>Project not found</h1>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ProjectHeader project={project} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <ProjectStatCard title="Tasks" value="12" />
        <ProjectStatCard title="Documents" value="34" />
        <ProjectStatCard title="Meetings" value="5" />
        <ProjectStatCard title="Notes" value="18" />
      </div>

      <DashboardPanel title="Recent Activity">
        <p>No recent activity yet.</p>
      </DashboardPanel>
    </AppShell>
  );
}