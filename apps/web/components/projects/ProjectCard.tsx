import { Project } from "./types";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 12,
        padding: 20,
        border: "1px solid #334155",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <h2
        style={{
          color: "white",
          marginTop: 0,
          marginBottom: 12,
          fontSize: 20,
        }}
      >
        {project.name}
      </h2>

      <div style={{ color: "#CBD5E1", marginBottom: 10 }}>
        {project.status}
      </div>

      <div style={{ color: "#94A3B8", marginBottom: 8 }}>
        Progress: {project.progress}%
      </div>

      <div style={{ color: "#94A3B8", marginBottom: 8 }}>
        Owner: {project.owner}
      </div>

      <div style={{ color: "#94A3B8" }}>
        Due: {project.due}
      </div>
    </div>
  );
}