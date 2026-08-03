"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createMeeting } from "@/lib/actions/meeting.actions";
import AppShell from "../../../components/layout/AppShell";

function NewMeetingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedDate =
    searchParams.get("date") ??
    new Date().toISOString().substring(0, 10);

  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(selectedDate);
  const [meetingTime, setMeetingTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");

    if (!title.trim()) {
      setError("Meeting title is required.");
      return;
    }

    try {
      setSaving(true);

      const meetingDateTime = new Date(
        `${meetingDate}T${meetingTime}:00`
      );

      await createMeeting({
        title,
        description,
        meetingDate: meetingDateTime,
        location,
      });

      router.push("/calendar");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Unable to save meeting.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "white",
          marginBottom: 10,
        }}
      >
        New Meeting
      </h1>

      <p
        style={{
          color: "#94A3B8",
          marginBottom: 30,
        }}
      >
        Schedule a meeting.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          background: "#1E293B",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div>
          <label style={{ color: "white" }}>Meeting Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              background: "#0F172A",
              color: "white",
              border: "1px solid #334155",
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <div>
            <label style={{ color: "white" }}>Date</label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              style={{
                width: "100%",
                marginTop: 8,
                padding: 12,
                background: "#0F172A",
                color: "white",
                border: "1px solid #334155",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ color: "white" }}>Time</label>
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              style={{
                width: "100%",
                marginTop: 8,
                padding: 12,
                background: "#0F172A",
                color: "white",
                border: "1px solid #334155",
                borderRadius: 8,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ color: "white" }}>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              background: "#0F172A",
              color: "white",
              border: "1px solid #334155",
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label style={{ color: "white" }}>Description</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              background: "#0F172A",
              color: "white",
              border: "1px solid #334155",
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              color: "#EF4444",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <button
            onClick={handleSave}
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
            {saving ? "Saving..." : "Save Meeting"}
          </button>

          <Link
            href="/calendar"
            style={{
              background: "#334155",
              color: "white",
              borderRadius: 8,
              padding: "12px 24px",
              textDecoration: "none",
            }}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NewMeetingPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div style={{ color: "white", padding: 24 }}>
            Loading...
          </div>
        }
      >
        <NewMeetingForm />
      </Suspense>
    </AppShell>
  );
}