import DashboardPanel from "./DashboardPanel";

type Props = { activeProjects: number; outstandingTasks: number; nextMeeting?: { title: string; meetingDate: Date } };

export default function AIMorningBrief({ activeProjects, outstandingTasks, nextMeeting }: Props) {
  return (
    <DashboardPanel title="Today's Brief">
      <ul
        style={{
          margin: 0,
          paddingLeft: "20px",
          lineHeight: 1.8,
        }}
      >
        <li>{activeProjects} active project{activeProjects === 1 ? "" : "s"}.</li>
        <li>{outstandingTasks} outstanding task{outstandingTasks === 1 ? "" : "s"}.</li>
        {nextMeeting ? <li>Next meeting: {nextMeeting.title} at {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Harare" }).format(nextMeeting.meetingDate)}.</li> : <li>No upcoming meetings.</li>}
      </ul>
    </DashboardPanel>
  );
}
