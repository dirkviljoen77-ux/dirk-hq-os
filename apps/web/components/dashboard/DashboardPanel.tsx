import { ReactNode } from "react";

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
        backgroundColor: "#1E293B",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        height: "100%",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: "20px",
          color: "#FFFFFF",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          color: "#E2E8F0",
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </div>
  );
}