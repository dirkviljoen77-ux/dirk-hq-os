import AppShell from "../../components/layout/AppShell";
import CalendarPanel from "../../components/projects/workspace/CalendarPanel";

type Props = { searchParams: Promise<{ date?: string }> };

export default async function CalendarPage({ searchParams }: Props) {
  const { date } = await searchParams;
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

        <CalendarPanel focusDate={date} />
      </div>
    </AppShell>
  );
}
