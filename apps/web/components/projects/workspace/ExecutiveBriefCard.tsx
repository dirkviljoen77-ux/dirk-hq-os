"use client";

type Props = {
  projectName: string;
  openTasks: number;
  meetings: number;
  people: number;
  documents: number;
  activity: number;
};

export default function ExecutiveBriefCard({
  projectName,
  openTasks,
  meetings,
  people,
  documents,
  activity,
}: Props) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        Executive Brief
      </h2>

      <p>
        <strong>Project:</strong> {projectName}
      </p>

      <hr
        style={{
          borderColor: "#334155",
          margin: "20px 0",
        }}
      />

      <p>Open Tasks: {openTasks}</p>
      <p>Meetings: {meetings}</p>
      <p>People: {people}</p>
      <p>Documents: {documents}</p>
      <p>Recent Activity: {activity}</p>
    </div>
  );
}