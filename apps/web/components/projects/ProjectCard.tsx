import { Project } from "../../types/project";
import { theme } from "../../app/theme";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        cursor: "pointer",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: theme.colors.text,
        }}
      >
        {project.name}
      </h3>

      <p
        style={{
          marginTop: theme.spacing.sm,
          marginBottom: 0,
          color: theme.colors.textSecondary,
        }}
      >
        Status: {project.status}
      </p>
    </div>
  );
}