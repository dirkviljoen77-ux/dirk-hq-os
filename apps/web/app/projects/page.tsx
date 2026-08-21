export const dynamic = "force-dynamic";

import AppShell from "../../components/layout/AppShell";
import ProjectGrid from "../../components/projects/ProjectGrid";
import { getProjects } from "@/lib/actions/project.actions";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const now = new Date();

  const mappedProjects = projects.map((project: any) => ({
    id: project.id,
    name: project.name,
    status: project.jobs.some((job: any) => job.status === "Active") ? "Active"
      : project.jobs.some((job: any) => job.status === "Planned") ? "Planned"
      : project.jobs.length && project.jobs.every((job: any) => job.status === "Paid / Closed") ? "Paid / Closed"
      : project.jobs.length && project.jobs.every((job: any) => job.status === "Cancelled") ? "Cancelled"
      : project.status,
    quotationCount: project.businessQuotations.length,
    jobCount: project.jobs.length,
    activeJobCount: project.jobs.filter((job: any) => !["Paid / Closed", "Cancelled"].includes(job.status)).length,
    quotationValue: project.businessQuotations.reduce((total: number, quotation: any) => {
      const subtotal = quotation.lines.reduce((sum: number, line: any) => sum + line.quantity * line.days * line.unitPrice, 0);
      return total + subtotal * (1 + quotation.vatRate / 100);
    }, 0),
    actualCosts: project.jobs.reduce((total: number, job: any) => total + (job.finance?.actualCost || 0), 0),
    grossProfit: 0,
    amountReceived: project.jobs.reduce((total: number, job: any) => total + (job.finance?.amountReceived || 0), 0),
    amountDue: project.jobs.reduce((total: number, job: any) => total + Math.max(0, (job.finance?.invoiceAmount || job.finance?.approvedBudget || 0) - (job.finance?.amountReceived || 0)), 0),
    nextJobDate: project.jobs.filter((job: any) => job.startDate && new Date(job.startDate) >= now && !["Paid / Closed", "Cancelled"].includes(job.status)).sort((a: any, b: any) => +new Date(a.startDate) - +new Date(b.startDate))[0]?.startDate?.toISOString(),
    openTaskCount: project.tasks.filter((task: any) => !["DONE", "Completed"].includes(task.status)).length,
    updatedAt: project.updatedAt.toISOString(),
  }));
  mappedProjects.forEach((project: any) => { project.grossProfit = project.quotationValue - project.actualCosts; });

  return (
    <AppShell>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1
            style={{
              color: "white",
              margin: 0,
              fontSize: 32,
            }}
          >
            Projects
          </h1>

          <p
            style={{
              color: "#94A3B8",
              marginTop: 8,
            }}
          >
            Commercial project portfolio
          </p>
        </div>

        <Link
          href="/projects/new"
          style={{
            padding: "12px 20px",
            background: "#2563EB",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          + New Project
        </Link>
      </div>

      <ProjectGrid projects={mappedProjects} />
    </AppShell>
  );
}
