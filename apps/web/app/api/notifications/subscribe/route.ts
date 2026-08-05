import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { endpoint } = await request.json() as { endpoint?: string };
  if (endpoint) await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return NextResponse.json({ ok: true });
}
