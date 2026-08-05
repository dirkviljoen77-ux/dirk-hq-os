import DashboardPanel from "./DashboardPanel";

type Props = { meetings: { id: string; title: string; meetingDate: Date }[] };

export default function UpcomingMeetings({ meetings }: Props) {
  return (
    <DashboardPanel title="Upcoming Meetings">
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>{meetings.length === 0 ? <tr><td style={{ color: "#94A3B8" }}>No upcoming meetings.</td></tr> : meetings.map((meeting) => (
          <tr key={meeting.id}>
            <td style={{ padding: "8px 16px 8px 0", color: "#93C5FD", whiteSpace: "nowrap" }}>{new Intl.DateTimeFormat("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(meeting.meetingDate)}</td>
            <td>{meeting.title}</td>
          </tr>
        ))}</tbody>
      </table>
    </DashboardPanel>
  );
}
