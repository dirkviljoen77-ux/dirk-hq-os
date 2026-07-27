"use client";

import { useEffect, useState } from "react";
import { getProjectActivity } from "@/lib/actions/activity.actions";

type Props = {
  projectId: string;
};

type Activity = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: Date;
};

export default function ActivityTimeline({
  projectId,
}: Props) {
  const [activities, setActivities] = useState<
    Activity[]
  >([]);

  useEffect(() => {
    async function load() {
      const data = await getProjectActivity(
        projectId
      );

      setActivities(data);
    }

    load();
  }, [projectId]);

  return (
    <div
      style={{
        marginTop: 40,
      }}
    >
      <h3>Recent Activity</h3>

      {activities.length === 0 && (
        <p>No activity recorded.</p>
      )}

      {activities.map((activity) => (
        <div
          key={activity.id}
          style={{
            padding: 14,
            borderBottom:
              "1px solid #334155",
          }}
        >
          <strong>{activity.title}</strong>

          <div
            style={{
              color: "#94A3B8",
              marginTop: 4,
            }}
          >
            {activity.description}
          </div>

          <div
            style={{
              color: "#64748B",
              marginTop: 6,
              fontSize: 12,
            }}
          >
            {new Date(
              activity.createdAt
            ).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}