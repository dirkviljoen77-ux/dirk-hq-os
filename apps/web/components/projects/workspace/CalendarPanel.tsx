"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";

import { getCalendar } from "@/lib/actions/calendar.actions";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date | string;
  color: string;
};

export default function CalendarPanel() {
  const router = useRouter();

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getCalendar();
      setEvents(data);
    }

    load();
  }, []);

  function handleDateClick(info: any) {
  const selectedDate = info.dateStr;

  router.push(`/meetings/new?date=${selectedDate}`);
}

  function handleEventClick(info: EventClickArg) {
  router.push(`/meetings/${info.event.id}`);
}

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
        selectMirror={true}
        dayMaxEvents={3}
        height="auto"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
    </div>
  );
}