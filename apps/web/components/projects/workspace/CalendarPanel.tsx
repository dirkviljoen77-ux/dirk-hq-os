"use client";

import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { getCalendar } from "@/lib/actions/calendar.actions";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date | string;
  color: string;
};

export default function CalendarPanel() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCalendar();
      setEvents(data);
    }

    load();
  }, []);

  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
        }}
        weekends={true}
        editable={false}
        selectable={true}
        dayMaxEvents={3}
        height="auto"
        events={events}
        eventClick={(info) => {
          alert(info.event.title);
        }}
      />
    </div>
  );
}