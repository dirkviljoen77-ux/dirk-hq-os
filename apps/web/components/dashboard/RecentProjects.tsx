import DashboardPanel from "./DashboardPanel";

type Props = { projects: { id: string; name: string }[] };

export default function RecentProjects({ projects }: Props) {
  return (
    <DashboardPanel title="Recent Projects">
      {projects.length === 0 ? <p style={{ margin: 0, color: "#94A3B8" }}>No projects yet.</p> : projects.map((project) => (
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

        </div>
      ))}
    </DashboardPanel>
  );
}
