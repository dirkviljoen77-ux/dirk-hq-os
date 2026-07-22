import DashboardPanel from "./DashboardPanel";
export default function RecentProjects() {
  const projects = [
    "Zimbabwe Rugby",
    "BHPC Financial Model",
    "Podcast Studio",
    "Broadcast Production Pods",
  ];

 return (
  <DashboardPanel title="Recent Projects">
    {projects.map((project) => (
      <div
        key={project}
        style={{
          padding: "12px 0",
          borderBottom: "1px solid #334155",
        }}
      >
     {project}
      </div>
    ))}
  </DashboardPanel>
);
}