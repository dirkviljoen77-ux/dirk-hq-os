import AppShell from "@/components/layout/AppShell";
import DailyPlanWorkspace from "@/components/daily-plan/DailyPlanWorkspace";
import { getDailyPlan } from "@/lib/actions/daily-plan.actions";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const plan = await getDailyPlan();
  return <AppShell title="Plan today"><DailyPlanWorkspace plannedItems={plan.plannedItems} candidates={plan.candidates} meetings={plan.meetings} /></AppShell>;
}
