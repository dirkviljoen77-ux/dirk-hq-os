import AppShell from "../../components/app/AppShell";
import ProjectCard from "../../components/projects/ProjectCard";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <AppShell>
      <header
        style={{
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Projects
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#cbd5e1",
          }}
        >
          Select a project to open its workspace.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </AppShell>
  );
}