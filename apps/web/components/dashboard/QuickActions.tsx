import Link from "next/link";
import DashboardPanel from "./DashboardPanel";

export default function QuickActions() {
  const actions = [
    "New Project",
    "New Meeting",
    "Capture to Inbox",
    "Calendar",
    "Open Documents",
  ];
  const hrefs = ["/projects/new", "/meetings/new", "/inbox", "/calendar", "/documents"];

  return (
    <DashboardPanel title="Quick Actions">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
        }}
      >
        {actions.map((action, index) => (
          <Link
            key={action}
            href={hrefs[index]}
            style={{
              padding: "16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#334155",
              color: "white",
              fontSize: "15px",
            cursor: "pointer",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          {action}
          </Link>
        ))}
      </div>
    </DashboardPanel>
  );
}
