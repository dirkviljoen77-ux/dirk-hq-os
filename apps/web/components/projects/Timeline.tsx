import DashboardPanel from "../dashboard/DashboardPanel";

export type TimelineEvent = {
  id: number;
  projectId: number;
  title: string;
  category: string;
  date: string;
};

type Props = {
  projectId: number;
  events: TimelineEvent[];
};

export default function Timeline({
  projectId,
  events,
}: Props) {
  const projectEvents = events
    .filter((event) => event.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return (
    <DashboardPanel title="Project Timeline">
      {projectEvents.length === 0 ? (
        <p
          style={{
            color: "#94A3B8",
            margin: 0,
          }}
        >
          No activity recorded yet.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {projectEvents.map((event) => (
            <div
              key={event.id}
              style={{
                borderLeft: "3px solid #3B82F6",
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                {event.title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#94A3B8",
                  marginTop: 4,
                }}
              >
                {event.category}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  marginTop: 4,
                }}
              >
                {new Date(event.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}