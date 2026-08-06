"use server";

import OpenAI from "openai";
import { getDailyPlan } from "./daily-plan.actions";

export async function generateDailyPlanBrief() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { error: "AI is not configured. Add OPENAI_API_KEY to Vercel and redeploy." };

  const plan = await getDailyPlan();
  const context = {
    today: plan.planDate.toLocaleDateString("en-GB", { timeZone: "Africa/Harare", weekday: "long", day: "numeric", month: "long" }),
    meetings: plan.meetings.map((meeting) => ({
      title: meeting.title,
      time: meeting.meetingDate.toLocaleTimeString("en-GB", { timeZone: "Africa/Harare", hour: "2-digit", minute: "2-digit" }),
    })),
    selectedPriorities: plan.plannedItems.map(({ task }) => ({
      title: task.title,
      project: task.project.name,
      dueDate: task.dueDate?.toISOString() ?? null,
      scheduledAt: task.scheduledAt?.toISOString() ?? null,
      durationMinutes: task.durationMinutes,
    })),
    openWork: plan.candidates.slice(0, 15).map((task) => ({
      title: task.title,
      project: task.project.name,
      dueDate: task.dueDate?.toISOString() ?? null,
      priority: task.priority,
    })),
  };

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-5.6-sol",
      store: false,
      instructions: [
        "You are Dirk HQ's practical daily planning assistant.",
        "Use only the supplied data. Do not invent meetings, tasks, deadlines, or facts.",
        "Do not claim to have changed anything. Make recommendations only.",
        "Return a concise plain-text brief with exactly these headings: Focus, Schedule, Risks, Next step.",
        "Keep the whole response below 280 words and make the advice concrete.",
      ].join(" "),
      input: JSON.stringify(context),
      max_output_tokens: 700,
    });
    return { brief: response.output_text || "No daily brief was returned." };
  } catch {
    return { error: "AI could not generate a plan right now. Please try again." };
  }
}
