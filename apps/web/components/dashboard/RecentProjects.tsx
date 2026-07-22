import DashboardPanel from "./DashboardPanel";
import { projects } from "../../data/projects";

export default function RecentProjects() {
  return (
    <DashboardPanel title="Recent Projects">
      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{project.name}</span>

          <span
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            {project.status}
          </span>
        </div>
      ))}
    </DashboardPanel>
  );
}