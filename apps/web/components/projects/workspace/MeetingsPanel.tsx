"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createMeeting,
  deleteMeeting,
  getMeetings,
} from "@/lib/actions/meeting.actions";

type Props = {
  projectId: string;
  projectName: string;
};

type Meeting = {
  id: string;
  title: string;
  meetingDate: Date;
};

export default function MeetingsPanel({
  projectId,
  projectName,
}: Props) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [, startTransition] = useTransition();

  async function loadMeetings() {
    const data = await getMeetings(projectId);
    setMeetings(data);
  }

  useEffect(() => {
    loadMeetings();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;

    startTransition(async () => {
      await createMeeting({
        title,
        meetingDate: new Date(),
        projectId,
      });

      setTitle("");
      await loadMeetings();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMeeting(id);
      await loadMeetings();
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Meetings</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`New meeting for ${projectName}`}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <button
          onClick={handleCreate}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: 8,
            background: "#2563EB",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <strong>{meeting.title}</strong>

            <div
              style={{
                color: "#94A3B8",
                marginTop: 6,
              }}
            >
              {new Date(
                meeting.meetingDate
              ).toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => handleDelete(meeting.id)}
            style={{
              border: "none",
              background: "transparent",
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