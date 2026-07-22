import DashboardPanel from "./DashboardPanel";

export default function QuickActions() {
  const actions = [
    "New Project",
    "New Note",
    "AI Workspace",
    "Open Documents",
  ];

  return (
    <DashboardPanel title="Quick Actions">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
        }}
      >
        {actions.map((action) => (
          <button
            key={action}
            style={{
              padding: "16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#334155",
              color: "white",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {action}
          </button>
        ))}
      </div>
    </DashboardPanel>
  );
}