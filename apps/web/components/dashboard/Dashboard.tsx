import Card from "./Card";
import TodayPlan from "./TodayPlan";
import WeekCalendar from "./WeekCalendar";
import { dashboardRepository } from "@/lib/repositories/dashboard.repository";
import IstreamBusinessOverview from "./IstreamBusinessOverview";

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

      </header>

      <div
        className="dashboard-summary-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
        }}
      >
        <Card title="Projects" value={dashboard.projectCount.toString()} href="/projects" />
        <Card title="Outstanding Tasks" value={dashboard.outstandingTasks.toString()} href="/tasks?status=outstanding" />
        <Card title="All Meetings" value={dashboard.meetingCount.toString()} href="/calendar" />
        <Card title="Documents" value={dashboard.documents.toString()} href="/documents" />
        <Card title="Inbox Notes" value={dashboard.inboxCount.toString()} href="/inbox" />
      </div>

      <IstreamBusinessOverview />

      <div
        className="dashboard-main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 0.8fr) minmax(0, 1.2fr)",
          gap: "20px",
          marginTop: "30px",
          alignItems: "start",
        }}
      >
        <TodayPlan tasks={dashboard.priorities} meetings={dashboard.meetingsTodayList} notes={dashboard.focusNotes.map(({ journalEntry }) => journalEntry)} />
        <WeekCalendar />
      </div>
      <style>{`
        @media (max-width: 860px) {
          .dashboard-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
