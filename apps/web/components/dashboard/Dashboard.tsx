import Card from "./Card";
import RecentProjects from "./RecentProjects";
import TodaysPriorities from "./TodaysPriorities";
import QuickActions from "./QuickActions";
import { projects } from "../../data/projects";
import AIMorningBrief from "./AIMorningBrief";
import UpcomingMeetings from "./UpcomingMeetings";
export default function Dashboard() {
  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const totalDocuments = 128;
  const outstandingTasks = 14;
  const meetingsToday = 2;

  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  const today = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
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
          {greeting}, Dirk
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#cbd5e1",
          }}
        >
          {today}
        </p>

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

  <div style={{ flex: 1 }}>
    <AIMorningBrief />
  </div>
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
    <UpcomingMeetings />
  </div>

  <div style={{ flex: 1 }}>
    <QuickActions />
  </div>
</div>
    </>
  );
}