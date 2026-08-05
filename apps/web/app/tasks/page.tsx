import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    where: { status: { not: "COMPLETE" } },
    include: { project: { select: { id: true, name: true } } },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AppShell title="Tasks">
      <h1 style={{ color: "white", marginTop: 0 }}>Outstanding Tasks</h1>
      {tasks.length === 0 ? <p style={{ color: "#94A3B8" }}>No outstanding tasks.</p> : (
        <div style={{ display: "grid", gap: 10 }}>
          {tasks.map((task) => (
            <Link key={task.id} href={`/projects/${task.project.id}`} style={{ padding: 16, border: "1px solid #334155", borderRadius: 10, background: "#1E293B", color: "#F8FAFC", textDecoration: "none" }}>
              <strong>{task.title}</strong>
              <div style={{ marginTop: 4, color: "#94A3B8" }}>{task.project.name}{task.dueDate ? ` · Due ${new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", dateStyle: "medium" }).format(task.dueDate)}` : ""}</div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
