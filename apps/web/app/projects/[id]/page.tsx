import AppShell from "../../../components/layout/AppShell";
import { projects } from "../../../components/projects/data";
import ProjectWorkspace from "../../../components/projects/workspace/ProjectWorkspace";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: Props) {
  const { id } = await params;

  const project = projects.find(
    (p) => p.id === Number(id)
  );

  if (!project) {
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

  return (
    <AppShell>
      <ProjectWorkspace project={project} />
    </AppShell>
  );
}