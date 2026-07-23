import DashboardPanel from "./DashboardPanel";

export default function AIMorningBrief() {
  return (
    <DashboardPanel title="AI Morning Brief">
      <ul
        style={{
          margin: 0,
          paddingLeft: "20px",
          lineHeight: 1.8,
        }}
      >
        <li>Review BHPC model progress.</li>
        <li>Follow up podcast studio proposal.</li>
        <li>Review active projects.</li>
        <li>Complete Sprint 11.</li>
      </ul>
    </DashboardPanel>
  );
}