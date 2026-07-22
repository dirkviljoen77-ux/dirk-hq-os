import Sidebar from "../components/layout/Sidebar";
import Card from "../components/dashboard/Card";
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

      {/* Right Side */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",

        }}
      >
        {/* Header */}
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
          <h2>Dashboard</h2>

          <div>Welcome, Dirk</div>
        </header>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "40px",
          }}
        >
          <h1>Welcome to Dirk HQ OS</h1>

          <p>Your Personal Operating System</p>

          <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "40px",
  }}
>
  <Card title="Projects" value="12" />

  <Card title="Tasks" value="34" />

  <Card title="Broadcasts" value="7" />

  <Card title="Revenue" value="$0" />
</div>
        </main>
      </section>
    </main>
  );
}