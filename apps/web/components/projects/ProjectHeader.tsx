import { Project } from "../../types/project";
import { theme } from "../../app/theme";

type ProjectHeaderProps = {
  project: Project;
};

export default function ProjectHeader({
  project,
}: ProjectHeaderProps) {
  return (
    <header
      style={{
        marginBottom: theme.spacing.xl,
      }}
    >
      <p
        style={{
          margin: 0,
          color: theme.colors.textSecondary,
          fontSize: "14px",
        }}
      >
        Project
      </p>

      <h1
        style={{
          marginTop: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
        }}
      >
        {project.name}
      </h1>

    </header>
  );
}
