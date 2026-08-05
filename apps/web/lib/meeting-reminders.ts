import { Client, Receiver } from "@upstash/qstash";
import webpush from "web-push";

const REMINDER_MINUTES = 60;

function reminderUrl() {
  const appUrl = process.env.APP_URL ?? "https://dirk-hq-os.vercel.app";
  return `${appUrl.replace(/\/$/, "")}/api/reminders/meeting`;
}

export async function scheduleMeetingReminder(meeting: { id: string; meetingDate: Date }) {
  const reminderTime = new Date(meeting.meetingDate.getTime() - REMINDER_MINUTES * 60_000);
  if (reminderTime <= new Date() || !process.env.QSTASH_TOKEN) return null;

  const client = new Client({
    baseUrl: process.env.QSTASH_URL,
    token: process.env.QSTASH_TOKEN,
    enableTelemetry: false,
  });

  return client.publishJSON({
    url: reminderUrl(),
    body: { meetingId: meeting.id },
    notBefore: Math.floor(reminderTime.getTime() / 1000),
    deduplicationId: `meeting-reminder-${meeting.id}`,
    retries: 3,
  });
}

export async function verifyQStashRequest(request: Request, body: string) {
  const signature = request.headers.get("upstash-signature");
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;
  if (!signature || !currentSigningKey || !nextSigningKey) return false;

  const receiver = new Receiver({ currentSigningKey, nextSigningKey });
  return receiver.verify({
    signature,
    body,
    url: reminderUrl(),
    upstashRegion: request.headers.get("upstash-region") ?? undefined,
  });
}

export function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url: string }
) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) throw new Error("Browser notifications are not configured.");

  webpush.setVapidDetails("mailto:notifications@dirk-hq-os.vercel.app", publicKey, privateKey);
  return webpush.sendNotification(
    { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
    JSON.stringify(payload)
  );
}
