import { theme } from "../../app/theme";

type ProjectStatCardProps = {
  title: string;
  value: string;
};

export default function ProjectStatCard({
  title,
  value,
}: ProjectStatCardProps) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
    >
      <p
        style={{
          margin: 0,
          color: theme.colors.textSecondary,
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginTop: theme.spacing.sm,
          marginBottom: 0,
          color: theme.colors.text,
        }}
      >
        {value}
      </h2>
    </div>
  );
}