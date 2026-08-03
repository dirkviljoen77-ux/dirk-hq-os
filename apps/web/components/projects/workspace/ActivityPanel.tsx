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
  createdAt: Date | string;
};

export default function ActivityPanel({
  projectId,
}: Props) {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    async function load() {
      const data =
        await getProjectActivity(projectId);

      setActivity(data);
    }

    load();
  }, [projectId]);

  return (
    <>
      <h2 style={{ marginTop: 0 }}>
        Activity
      </h2>

      {activity.length === 0 && (
        <div
          style={{
            color: "#94A3B8",
            padding: 20,
          }}
        >
          No activity recorded yet.
        </div>
      )}

      {activity.map((item) => (
        <div
          key={item.id}
          style={{
            borderLeft: "3px solid #2563EB",
            paddingLeft: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: "white",
            }}
          >
            {item.title}
          </div>

          {item.description && (
            <div
              style={{
                color: "#CBD5E1",
                marginTop: 4,
              }}
            >
              {item.description}
            </div>
          )}

          <div
            style={{
              color: "#94A3B8",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            {new Date(
              item.createdAt
            ).toLocaleString()}
          </div>
        </div>
      ))}
    </>
  );
}