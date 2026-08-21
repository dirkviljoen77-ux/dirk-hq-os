import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function IstreamBusinessOverview() {
  const [quotations, jobs] = await Promise.all([
    prisma.quotation.findMany({ where: { deletedAt: null }, include: { lines: true } }),
    prisma.project.findMany({ where: { deletedAt: null, quotations: { some: {} } }, include: { finance: true, quotations: { include: { client: true }, take: 1 } }, orderBy: { startDate: "asc" } }),
  ]);
  const qTotal = (q: any) => q.lines.reduce((sum: number, line: any) => sum + line.quantity * line.days * line.unitPrice, 0) * (1 + q.vatRate / 100);
  const openQuotes = quotations.filter((q) => ["DRAFT", "SENT"].includes(q.status));
  const activeJobs = jobs.filter((j) => !["Paid / Closed", "Cancelled"].includes(j.status));
  const quotedPipeline = openQuotes.reduce((sum, q) => sum + qTotal(q), 0);
  const jobRevenue = activeJobs.reduce((sum, j) => sum + (j.finance?.approvedBudget || 0), 0);
  const jobCosts = activeJobs.reduce((sum, j) => sum + (j.finance?.actualCost || 0), 0);
  const clientOutstanding = activeJobs.reduce((sum, j) => sum + Math.max(0, (j.finance?.invoiceAmount || j.finance?.approvedBudget || 0) - (j.finance?.amountReceived || 0)), 0);
  const upcoming = activeJobs.filter((job) => job.startDate && job.startDate >= new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 5);
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  return <section style={{ marginTop: 30, background: "#111C30", border: "1px solid #334155", borderRadius: 14, padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}><div><h2 style={{ margin: 0 }}>Istream Business</h2><p style={{ color: "#94A3B8", margin: "6px 0 0" }}>Live quotation, job and financial position</p></div><Link href="/istream/jobs" style={{ color: "#60A5FA", fontWeight: 700 }}>Open jobs →</Link></div>
    <div className="istream-kpis">{[["Open quotations", String(openQuotes.length)], ["Quoted pipeline", money(quotedPipeline)], ["Active jobs", String(activeJobs.length)], ["Active job value", money(jobRevenue)], ["Actual job costs", money(jobCosts)], ["Client money due", money(clientOutstanding)], ["Current gross profit", money(jobRevenue - jobCosts)], ["Closed / cancelled", String(jobs.length - activeJobs.length)]].map(([label, value]) => <div className="istream-kpi" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <h3 style={{ marginBottom: 10 }}>Upcoming jobs</h3>{upcoming.length ? <div className="upcoming">{upcoming.map((job: any) => <Link href={`/projects/${job.id}`} key={job.id}><strong>{job.jobNo} · {job.name}</strong><span>{job.quotations[0]?.client.company || "Client"} · {new Date(job.startDate).toLocaleDateString("en-GB")} · {money(job.finance?.approvedBudget || 0)}</span></Link>)}</div> : <p style={{ color: "#94A3B8" }}>No upcoming jobs scheduled.</p>}
    <style>{`.istream-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.istream-kpi{background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px}.istream-kpi span{display:block;color:#94a3b8;font-size:12px}.istream-kpi strong{display:block;margin-top:6px;font-size:19px}.upcoming{display:grid;gap:8px}.upcoming a{display:flex;justify-content:space-between;gap:12px;background:#0f172a;border-radius:8px;padding:11px 13px;color:white;text-decoration:none}.upcoming span{color:#94a3b8}@media(max-width:950px){.istream-kpis{grid-template-columns:repeat(2,1fr)}.upcoming a{display:grid}}@media(max-width:560px){.istream-kpis{grid-template-columns:1fr}}`}</style>
  </section>;
}
