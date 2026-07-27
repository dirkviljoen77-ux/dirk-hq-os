"use client";

import { useState } from "react";

type Meeting = {
  id: number;
  title: string;
  date: string;
  attendees: string;
};

type Props = {
  projectName: string;
};

export default function MeetingsPanel({ projectName }: Props) {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: `${projectName} Weekly Review`,
      date: "2026-07-15",
      attendees: "Dirk, Project Team",
    },
  ]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");

  function addMeeting() {
    if (!title || !date) return;

    setMeetings([
      ...meetings,
      {
        id: Date.now(),
        title,
        date,
        attendees,
      },
    ]);

    setTitle("");
    setDate("");
    setAttendees("");
  }

  function deleteMeeting(id: number) {
    setMeetings(meetings.filter((m) => m.id !== id));
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Meetings</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 2fr auto",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Attendees"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={addMeeting}
          style={buttonStyle}
        >
          Add
        </button>
      </div>

      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          style={{
            padding: 16,
            borderBottom: "1px solid #334155",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {meeting.title}
          </div>

          <div style={{ color: "#CBD5E1" }}>
            📅 {meeting.date}
          </div>

          <div style={{ color: "#CBD5E1" }}>
            👥 {meeting.attendees}
          </div>

          <button
            onClick={() => deleteMeeting(meeting.id)}
            style={{
              marginTop: 10,
              background: "transparent",
              border: "none",
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #475569",
  background: "#0F172A",
  color: "white",
};

const buttonStyle = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#2563EB",
  color: "white",
  cursor: "pointer",
};