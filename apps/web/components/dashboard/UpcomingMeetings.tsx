import DashboardPanel from "./DashboardPanel";

export default function UpcomingMeetings() {
  return (
    <DashboardPanel title="Upcoming Meetings">
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <tr>
            <td>09:00</td>
            <td>BHPC Review</td>
          </tr>

          <tr>
            <td>11:30</td>
            <td>Podcast Studio</td>
          </tr>

          <tr>
            <td>15:00</td>
            <td>Project Planning</td>
          </tr>
        </tbody>
      </table>
    </DashboardPanel>
  );
}