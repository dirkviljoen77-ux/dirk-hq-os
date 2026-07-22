import DashboardPanel from "./DashboardPanel";

export default function TodaysPriorities() {
  const priorities = [
    "Finalise Podcast Studio proposal",
    "Review BHPC financial model",
    "Prepare Zimbabwe Rugby presentation",
    "Respond to broadcast equipment enquiry",
  ];

  return (
    <DashboardPanel title="Today's Priorities">
      {priorities.map((item) => (
        <div
          key={item}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #334155",
          }}
        >
          □ {item}
        </div>
      ))}
    </DashboardPanel>
  );
}