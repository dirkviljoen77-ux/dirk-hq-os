import AppShell from "../../../components/app/AppShell";
import ProjectWorkspace from "../../../components/projects/ProjectWorkspace";

import { notes } from "../../../data/notes";
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

  const projectNotes = notes.filter(
    (note) => note.projectId === project.id
  );

  return (
    <AppShell>
      <ProjectWorkspace
        project={project}
        notes={projectNotes}
      />
    </AppShell>
  );
}