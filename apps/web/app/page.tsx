import Sidebar from "../components/layout/Sidebar";
import Card from "../components/dashboard/Card";
import RecentProjects from "../components/dashboard/RecentProjects";
import TodaysPriorities from "../components/dashboard/TodaysPriorities";
import QuickActions from "../components/dashboard/QuickActions";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      <Sidebar />

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            height: "70px",
            backgroundColor: "#172554",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Good Afternoon, Dirk</h2>

            <p
              style={{
                margin: "5px 0 0 0",
                color: "#cbd5e1",
              }}
            >
              Welcome back. Here's what's happening today.
            </p>
          </div>

          <div>🔔</div>
        </header>

        <main
          style={{
            flex: 1,
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <Card title="Active Projects" value="6" />
            <Card title="Outstanding Tasks" value="14" />
            <Card title="Meetings Today" value="2" />
            <Card title="Documents" value="128" />
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
        </main>
      </section>
    </main>
  );
}