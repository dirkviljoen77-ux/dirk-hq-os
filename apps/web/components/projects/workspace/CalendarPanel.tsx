"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";

import { getCalendar } from "@/lib/actions/calendar.actions";
import { scheduleTask } from "@/lib/actions/task.actions";
import NotificationSetup from "@/components/notifications/NotificationSetup";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date | string;
  color: string;
};

type Props = { focusDate?: string };

export default function CalendarPanel({ focusDate }: Props) {
  const router = useRouter();

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  async function loadCalendar() {
    const data = await getCalendar();
    setEvents(data);
  }

  useEffect(() => {
    loadCalendar();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateView = () => setIsMobile(media.matches);
    updateView();
    media.addEventListener("change", updateView);
    return () => media.removeEventListener("change", updateView);
  }, []);

  function handleDateClick(info: any) {
  const selectedDate = info.dateStr;

  router.push(`/meetings/new?date=${selectedDate}`);
}

  function handleEventClick(info: EventClickArg) {
    const kind = info.event.extendedProps.kind;
    if (kind === "meeting") router.push(`/meetings/${info.event.id}`);
    if (kind === "task" || kind === "milestone") router.push(`/projects/${info.event.extendedProps.projectId}`);
  }

  function handleEventDrop(info: EventDropArg) {
    if (info.event.extendedProps.kind !== "task" || !info.event.start) {
      info.revert();
      return;
    }

    const durationMinutes = info.event.end
      ? Math.max(15, Math.round((info.event.end.getTime() - info.event.start.getTime()) / 60_000))
      : 60;

    scheduleTask(info.event.id, info.event.start, durationMinutes)
      .then(loadCalendar)
      .catch(() => info.revert());
  }

  return (
    <div
      style={{
        background: "#1E293B",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <NotificationSetup />
      <FullCalendar
        key={`${isMobile ? "mobile" : "desktop"}-${focusDate ?? "default"}`}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
        ]}
        initialView={isMobile ? (focusDate ? "listDay" : "listWeek") : (focusDate ? "timeGridDay" : "dayGridMonth")}
        initialDate={focusDate}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isMobile ? "listWeek,listDay" : "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "Agenda",
        }}
        weekends={true}
        editable={true}
        eventAllow={(_dropInfo, draggedEvent) => draggedEvent?.extendedProps.kind === "task"}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        height="auto"
        eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      <style jsx global>{`
        @media (max-width: 767px) {
          .fc .fc-toolbar { align-items: flex-start; flex-wrap: wrap; gap: 12px; }
          .fc .fc-toolbar-title { font-size: 20px; }
          .fc .fc-list-day-cushion { background: #0F172A; color: #F8FAFC; padding: 14px 12px; }
          .fc .fc-list-event td { padding: 13px 10px; }
          .fc .fc-list-event-title a { color: #F8FAFC; font-size: 16px; white-space: normal; }
          .fc .fc-list-event-time { color: #93C5FD; font-weight: 600; white-space: nowrap; }
        }
      `}</style>
    </div>
  );
}
