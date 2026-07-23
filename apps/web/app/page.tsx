import AppShell from "../components/app/AppShell";
import Card from "../components/dashboard/Card";
import RecentProjects from "../components/dashboard/RecentProjects";
import TodaysPriorities from "../components/dashboard/TodaysPriorities";
import QuickActions from "../components/dashboard/QuickActions";
import { projects } from "../data/projects";

export default function Home() {
  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const totalDocuments = 128;
  const outstandingTasks = 14;
  const meetingsToday = 2;

  return (
    <AppShell>
      <header
        style={{
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          Good Afternoon, Dirk
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#cbd5e1",
          }}
        >
          Welcome back. Here's what's happening today.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          gap: "20px",
        }}
      >
        <Card title="Active Projects" value={activeProjects.toString()} />
        <Card title="Outstanding Tasks" value={outstandingTasks.toString()} />
        <Card title="Meetings Today" value={meetingsToday.toString()} />
        <Card title="Documents" value={totalDocuments.toString()} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <RecentProjects />
        </div>

        <div style={{ flex: 1 }}>
          <TodaysPriorities />
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <QuickActions />
      </div>
    </AppShell>
  );
}