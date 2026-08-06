import Card from "./Card";
import RecentProjects from "./RecentProjects";
import TodaysPriorities from "./TodaysPriorities";
import QuickActions from "./QuickActions";
import AIMorningBrief from "./AIMorningBrief";
import UpcomingMeetings from "./UpcomingMeetings";
import TodayPlan from "./TodayPlan";
import { dashboardRepository } from "@/lib/repositories/dashboard.repository";

export default async function Dashboard() {
  const dashboard = await dashboardRepository.getLiveDashboard();

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
        <Card title="Projects" value={dashboard.projectCount.toString()} href="/projects" />
        <Card title="Outstanding Tasks" value={dashboard.outstandingTasks.toString()} href="/tasks?status=outstanding" />
        <Card title="Meetings Today" value={dashboard.meetingsToday.toString()} href={`/calendar?date=${new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Harare" })}`} />
        <Card title="Documents" value={dashboard.documents.toString()} href="/documents" />
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
    <RecentProjects projects={dashboard.recentProjects} />
  </div>

  <div style={{ flex: 1 }}>
    <TodayPlan tasks={dashboard.priorities} meetings={dashboard.meetingsTodayList} />
  </div>

  <div style={{ flex: 1 }}>
    <AIMorningBrief projectCount={dashboard.projectCount} outstandingTasks={dashboard.outstandingTasks} nextMeeting={dashboard.upcomingMeetings[0]} />
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
    <UpcomingMeetings meetings={dashboard.upcomingMeetings} />
  </div>

  <div style={{ flex: 1 }}>
    <QuickActions />
  </div>
</div>
    </>
  );
}
