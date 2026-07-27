import AppShell from "../../../components/layout/AppShell";
import ProjectWorkspace from "../../../components/projects/workspace/ProjectWorkspace";
import { getProject } from "@/lib/actions/project.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: Props) {
  const { id } = await params;

  // Read the project from PostgreSQL
  const dbProject = await getProject(id);

  if (!dbProject) {
    return (
      <AppShell>
        <h1
          style={{
            color: "white",
          }}
        >
          Project not found
        </h1>
      </AppShell>
    );
  }

  // Temporary UI mapping
  const project = {
    id: dbProject.id,
    name: dbProject.name,
    status: dbProject.status,
    progress: 0,
    owner: "Dirk Viljoen",
    due: "-",
  };

  return (
    <AppShell>
      <ProjectWorkspace project={project} />
    </AppShell>
  );
}