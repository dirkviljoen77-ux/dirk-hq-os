"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCalendar } from "@/lib/actions/calendar.actions";
import DashboardPanel from "./DashboardPanel";

type CalendarEvent = { id: string; title: string; start: Date | string; color: string };

function dateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Harare", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function startOfWeek() {
  const today = new Date();
  const offset = (today.getDay() + 6) % 7;
  today.setDate(today.getDate() - offset);
  today.setHours(0, 0, 0, 0);
  return today;
}

export default function WeekCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const weekStart = startOfWeek();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date;
  });

  useEffect(() => {
    getCalendar().then((data) => setEvents(data.events)).catch(() => setEvents([]));
  }, []);

  return (
    <DashboardPanel title="This week">
      <div className="dashboard-week-calendar" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(105px, 1fr))", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((day) => {
          const key = dateKey(day);
          const dayEvents = events.filter((event) => dateKey(new Date(event.start)) === key);
          return (
            <div key={key} style={{ minHeight: 150, padding: 10, background: "#0F172A", border: "1px solid #334155", borderRadius: 8 }}>
              <div style={{ color: "#93C5FD", fontSize: 13, fontWeight: 700 }}>
                {new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", weekday: "short", day: "numeric" }).format(day)}
              </div>
              {dayEvents.length === 0 ? <p style={{ margin: "12px 0", color: "#64748B", fontSize: 13 }}>Clear</p> : dayEvents.map((event) => (
                <div key={`${event.id}-${event.start}`} style={{ marginTop: 9, padding: "6px 7px", borderLeft: `3px solid ${event.color}`, background: "#1E293B", borderRadius: 4, color: "#E2E8F0", fontSize: 12, lineHeight: 1.35, overflowWrap: "anywhere" }}>
                  {event.title.replace(/^[^\w]+\s*/, "")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <Link href="/calendar" style={{ display: "inline-block", marginTop: 14, color: "#93C5FD", fontSize: 14 }}>Open full calendar</Link>
      <style jsx>{`
        @media (max-width: 700px) {
          .dashboard-week-calendar { grid-template-columns: 1fr !important; overflow-x: visible !important; }
        }
      `}</style>
    </DashboardPanel>
  );
}
