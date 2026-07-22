import { ReactNode } from "react";
import { theme } from "../../app/theme";

type DashboardPanelProps = {
  title: string;
  children: ReactNode;
};

export default function DashboardPanel({
  title,
  children,
}: DashboardPanelProps) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: theme.spacing.md,
          color: theme.colors.text,
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}