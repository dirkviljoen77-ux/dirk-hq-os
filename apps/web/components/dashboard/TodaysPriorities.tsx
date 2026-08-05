import DashboardPanel from "./DashboardPanel";

type Props = { priorities: { id: string; title: string; project: { name: string } }[] };

export default function TodaysPriorities({ priorities }: Props) {

  return (
    <DashboardPanel title="Today's Priorities">
      {priorities.length === 0 ? <p style={{ margin: 0, color: "#94A3B8" }}>No outstanding tasks due today.</p> : priorities.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #334155",
          }}
        >
          □ {item.title}
          <div style={{ marginTop: 2, color: "#94A3B8", fontSize: 13 }}>{item.project.name}</div>
        </div>
      ))}
    </DashboardPanel>
  );
}
