import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendPushNotification, verifyQStashRequest } from "@/lib/meeting-reminders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  if (!(await verifyQStashRequest(request, body))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { meetingId } = JSON.parse(body) as { meetingId?: string };
  if (!meetingId) return NextResponse.json({ error: "Missing meeting" }, { status: 400 });

  const reminder = await prisma.meetingReminder.upsert({
    where: { meetingId },
    update: {},
    create: { meetingId, scheduledFor: new Date() },
    include: { meeting: true },
  });
  if (reminder.sentAt || reminder.meeting.status === "CANCELLED") return NextResponse.json({ ok: true });

  const subscriptions = await prisma.pushSubscription.findMany();
  await Promise.allSettled(
    subscriptions.map((subscription) =>
      sendPushNotification(subscription, {
        title: `Meeting in one hour: ${reminder.meeting.title}`,
        body: reminder.meeting.location ? `Location: ${reminder.meeting.location}` : "Open Dirk HQ for details.",
        url: "/calendar",
      })
    )
  );
  await prisma.meetingReminder.update({ where: { meetingId }, data: { sentAt: new Date() } });

  return NextResponse.json({ ok: true });
}
