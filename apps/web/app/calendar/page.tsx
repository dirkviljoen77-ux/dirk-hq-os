import AppShell from "../../components/layout/AppShell";
import CalendarPanel from "../../components/projects/workspace/CalendarPanel";

export default function CalendarPage() {
  return (
    <AppShell>
      <div
        style={{
          padding: 24,
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: 24,
          }}
        >
          Executive Calendar
        </h1>

        <CalendarPanel />
      </div>
    </AppShell>
  );
}