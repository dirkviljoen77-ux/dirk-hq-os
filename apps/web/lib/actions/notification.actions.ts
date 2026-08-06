"use server";

import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/meeting-reminders";

export async function sendTestMeetingAlert() {
  try {
    const subscriptions = await prisma.pushSubscription.findMany();
    if (subscriptions.length === 0) return { error: "No browser notification subscription is saved." };

    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        sendPushNotification(subscription, {
          title: "Dirk HQ test alert",
          body: "Browser notifications are working.",
          url: "/calendar",
        })
      )
    );
    const delivered = results.filter((result) => result.status === "fulfilled").length;
    if (delivered === 0) {
      const failed = results.find((result) => result.status === "rejected");
      const reason = failed && failed.status === "rejected" ? failed.reason : null;
      return { error: reason instanceof Error ? reason.message : "Browser notification delivery failed." };
    }

    return { delivered };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to send a test alert." };
  }
}
