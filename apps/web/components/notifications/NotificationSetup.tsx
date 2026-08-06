"use client";

import { useEffect, useState } from "react";
import { sendTestMeetingAlert } from "@/lib/actions/notification.actions";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function toUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = window.atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export default function NotificationSetup() {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (!("serviceWorker" in navigator)) return;
      const registration = await navigator.serviceWorker.ready;
      setEnabled(Boolean(await registration.pushManager.getSubscription()));
    }
    checkSubscription().catch(() => undefined);
  }, []);

  async function enable() {
    if (!publicKey) {
      setMessage("Notifications are not configured yet.");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("This browser does not support notifications.");
      return;
    }

    setPending(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Notification permission was not granted.");
        return;
      }

      await navigator.serviceWorker.register("/notifications-sw.js");
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription()
        ?? await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toUint8Array(publicKey),
        });
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      if (!response.ok) throw new Error("Unable to save notification settings.");
      setEnabled(true);
      setMessage("Notifications enabled. Meeting reminders arrive one hour before.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to enable notifications.");
    } finally {
      setPending(false);
    }
  }

  async function sendTest() {
    setPending(true);
    try {
      const result = await sendTestMeetingAlert();
      setMessage(result.error ?? "Test alert sent. Check your browser notifications.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <button type="button" onClick={enable} disabled={pending} style={{ padding: "10px 14px", border: 0, borderRadius: 8, background: "#2563EB", color: "white", cursor: "pointer" }}>
        {pending ? "Saving…" : enabled ? "Meeting alerts enabled" : "Enable meeting alerts"}
      </button>
      {enabled && <button type="button" onClick={sendTest} disabled={pending} style={{ padding: "10px 14px", border: "1px solid #475569", borderRadius: 8, background: "transparent", color: "#F8FAFC", cursor: "pointer" }}>Send test alert</button>}
      {message && <span style={{ color: "#CBD5E1", fontSize: 14 }}>{message}</span>}
    </div>
  );
}
