import ProjectCard from "../../components/projects/ProjectCard";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <main
      style={{
        padding: "40px",
      }}
    >
      <h1>Projects</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </main>
  );
}