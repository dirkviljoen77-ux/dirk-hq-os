import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { scheduleMeetingReminder } from "@/lib/meeting-reminders";

export async function POST(request: Request) {
  const subscription = await request.json() as PushSubscriptionJSON;
  const endpoint = subscription.endpoint;
  const p256dh = subscription.keys?.p256dh;
  const auth = subscription.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid browser notification subscription." }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh, auth },
    create: { endpoint, p256dh, auth },
  });

  const upcomingMeetings = await prisma.meeting.findMany({
    where: {
      status: "SCHEDULED",
      meetingDate: { gt: new Date(Date.now() + 60 * 60_000) },
    },
    select: { id: true, meetingDate: true },
  });

  await Promise.all(
    upcomingMeetings.map(async (meeting) => {
      const existingReminder = await prisma.meetingReminder.findUnique({ where: { meetingId: meeting.id } });
      if (existingReminder) return;

      await prisma.meetingReminder.create({
        data: {
          meetingId: meeting.id,
          scheduledFor: new Date(meeting.meetingDate.getTime() - 60 * 60_000),
        },
      });
      await scheduleMeetingReminder(meeting);
    })
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { endpoint } = await request.json() as { endpoint?: string };
  if (endpoint) await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
