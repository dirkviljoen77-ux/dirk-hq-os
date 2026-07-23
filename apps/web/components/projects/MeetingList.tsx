import { Meeting } from "../../types/meeting";

type MeetingListProps = {
  meetings: Meeting[];
};

export default function MeetingList({
  meetings,
}: MeetingListProps) {
  if (meetings.length === 0) {
    return <p>No meetings scheduled.</p>;
  }

  return (
    <div>
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            {meeting.title}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#666",
            }}
          >
            {meeting.date}
          </div>
        </div>
      ))}
    </div>
  );
}