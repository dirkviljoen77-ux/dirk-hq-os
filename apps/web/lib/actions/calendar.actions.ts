"use server";

import { calendarRepository } from "@/lib/repositories/calendar.repository";

export async function getCalendar() {
  return calendarRepository.getCalendar();
}