"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateMeeting,
  deleteMeeting,
} from "@/lib/actions/meeting.actions";
type Meeting = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  meetingDate: Date;
  status:
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
};

type Props = {
  meeting: Meeting;
};

export default function MeetingForm({
  meeting,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(
    meeting.description ?? ""
  );
  const [location, setLocation] = useState(
    meeting.location ?? ""
  );

  const iso = new Date(meeting.meetingDate)
    .toISOString();

  const [date, setDate] = useState(
    iso.substring(0, 10)
  );

  const [time, setTime] = useState(
    iso.substring(11, 16)
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setError("");
async function remove() {
  if (!confirm("Delete this meeting?")) {
    return;
  }

  try {
    setSaving(true);

    await deleteMeeting(meeting.id);

    router.push("/calendar");
    router.refresh();
  } catch (e) {
    console.error(e);
    setError("Unable to delete meeting.");
  } finally {
    setSaving(false);
  }
}
    if (!title.trim()) {
      setError("Meeting title is required.");
      return;
    }

    try {
      setSaving(true);

      await updateMeeting(meeting.id, {
        title,
        description,
        location,
        meetingDate: new Date(
          `${date}T${time}:00`
        ),
      });

      router.push("/calendar");
      router.refresh();
    } catch (e) {
      console.error(e);
      setError("Unable to save meeting.");
    } finally {
      setSaving(false);
    }
  }
async function remove() {
  if (!window.confirm("Delete this meeting?")) {
    return;
  }

  try {
    setSaving(true);

    await deleteMeeting(meeting.id);

    router.push("/calendar");
    router.refresh();
  } catch (e) {
    console.error(e);
    setError("Unable to delete meeting.");
  } finally {
    setSaving(false);
  }
}
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h1 style={{ color: "white" }}>
        Edit Meeting
      </h1>

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        rows={5}
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <input
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      />

      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
      />

      <input
        type="time"
        value={time}
        onChange={(e) =>
          setTime(e.target.value)
        }
      />

      {error && (
        <div style={{ color: "red" }}>
          {error}
        </div>
      )}

     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
  }}
>
  <button
    onClick={remove}
    disabled={saving}
    style={{
      background: "#DC2626",
      color: "white",
      border: "none",
      borderRadius: 8,
      padding: "12px 24px",
      cursor: "pointer",
    }}
  >
    Delete
  </button>

  <button
    onClick={save}
    disabled={saving}
    style={{
      background: "#2563EB",
      color: "white",
      border: "none",
      borderRadius: 8,
      padding: "12px 24px",
      cursor: "pointer",
    }}
  >
    {saving ? "Saving..." : "Save"}
  </button>
</div> 
    </div>
  );
}