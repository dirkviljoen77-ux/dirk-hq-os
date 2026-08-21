import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getFinancialControl } from "@/lib/actions/financial-control.actions";

export default async function IstreamBusinessOverview() {
  const year = new Date().getFullYear(); const currentMonth = new Date().getMonth();
  const [quotations, jobs, financial] = await Promise.all([
    prisma.quotation.findMany({ where: { deletedAt: null }, include: { lines: true } }),
    prisma.project.findMany({ where: { deletedAt: null, quotations: { some: {} } }, include: { finance: true, quotations: { include: { client: true }, take: 1 } }, orderBy: { startDate: "asc" } }),
    getFinancialControl(year),
  ]);
  const qTotal = (q: any) => q.lines.reduce((sum: number, line: any) => sum + line.quantity * line.days * line.unitPrice, 0) * (1 + q.vatRate / 100);
  const openQuotes = quotations.filter((q) => ["DRAFT", "SENT"].includes(q.status));
  const activeJobs = jobs.filter((j) => !["Paid / Closed", "Cancelled"].includes(j.status));
  const quotedPipeline = openQuotes.reduce((sum, q) => sum + qTotal(q), 0);
  const jobRevenue = activeJobs.reduce((sum, j) => sum + (j.finance?.approvedBudget || 0), 0);
  const clientOutstanding = activeJobs.reduce((sum, j) => sum + Math.max(0, (j.finance?.invoiceAmount || j.finance?.approvedBudget || 0) - (j.finance?.amountReceived || 0)), 0);
  const ytd = financial.months.filter((row) => row.month <= currentMonth);
  const total = (key: string) => ytd.reduce((sum: number, row: any) => sum + row[key], 0);
  const salesBudget = total("salesBudget"), actualSales = total("invoiced"), directBudget = total("expenseBudget"), actualDirect = total("actualExpenses"), overheadBudget = total("overheadBudget"), actualOverheads = total("actualOverheads");
  const budgetProfit = salesBudget - directBudget - overheadBudget, actualProfit = actualSales - actualDirect - actualOverheads;
  const percent = (actual: number, budget: number) => budget ? `${(actual / budget * 100).toFixed(1)}%` : actual ? "No budget" : "0.0%";
  const margin = actualSales ? `${(actualProfit / actualSales * 100).toFixed(1)}%` : "0.0%";
  const upcoming = activeJobs.filter((job) => job.startDate && job.startDate >= new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 5);
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  return <section style={{ marginTop: 30, background: "#111C30", border: "1px solid #334155", borderRadius: 14, padding: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}><div><h2 style={{ margin: 0 }}>Istream Business · {year} YTD</h2><p style={{ color: "#94A3B8", margin: "6px 0 0" }}>Running budget, actual cost and profitability position through {new Date(year,currentMonth,1).toLocaleString("en-GB",{month:"long"})}</p></div><Link href="/istream/dashboard" style={{ color: "#60A5FA", fontWeight: 700 }}>Full financial dashboard →</Link></div>
    <div className="istream-kpis">{[
      {label:"Sales budget",value:money(salesBudget),detail:"YTD target"},{label:"Actual sales",value:money(actualSales),detail:`${percent(actualSales,salesBudget)} of budget`},
      {label:"Direct-cost budget",value:money(directBudget),detail:"Job-cost allowance"},{label:"Actual job costs",value:money(actualDirect),detail:`${percent(actualDirect,directBudget)} of budget`},
      {label:"Overhead budget",value:money(overheadBudget),detail:"Rent, payroll and operations"},{label:"Actual overheads",value:money(actualOverheads),detail:`${percent(actualOverheads,overheadBudget)} of budget`},
      {label:"Budgeted P/L",value:money(budgetProfit),detail:"Sales less all budgeted costs"},{label:"Actual P/L",value:money(actualProfit),detail:`Variance ${money(actualProfit-budgetProfit)} · Margin ${margin}`},
    ].map((item) => <div className="istream-kpi" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></div>)}</div>
    <div className="operations"><span><strong>{openQuotes.length}</strong> open quotations · {money(quotedPipeline)} pipeline</span><span><strong>{activeJobs.length}</strong> active jobs · {money(jobRevenue)} value</span><span><strong>{money(clientOutstanding)}</strong> client money due</span></div>
    <h3 style={{ marginBottom: 10 }}>Upcoming jobs</h3>{upcoming.length ? <div className="upcoming">{upcoming.map((job: any) => <Link href={`/projects/${job.id}`} key={job.id}><strong>{job.jobNo} · {job.name}</strong><span>{job.quotations[0]?.client.company || "Client"} · {new Date(job.startDate).toLocaleDateString("en-GB")} · {money(job.finance?.approvedBudget || 0)}</span></Link>)}</div> : <p style={{ color: "#94A3B8" }}>No upcoming jobs scheduled.</p>}
    <style>{`.istream-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.istream-kpi{background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px}.istream-kpi span{display:block;color:#94a3b8;font-size:12px}.istream-kpi strong{display:block;margin-top:6px;font-size:19px}.istream-kpi small{display:block;color:#7dd3fc;margin-top:6px}.operations{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.operations span{background:#1e293b;border-radius:8px;padding:9px 12px;color:#cbd5e1}.upcoming{display:grid;gap:8px}.upcoming a{display:flex;justify-content:space-between;gap:12px;background:#0f172a;border-radius:8px;padding:11px 13px;color:white;text-decoration:none}.upcoming span{color:#94a3b8}@media(max-width:950px){.istream-kpis{grid-template-columns:repeat(2,1fr)}.upcoming a{display:grid}}@media(max-width:560px){.istream-kpis{grid-template-columns:1fr}}`}</style>
  </section>;
}
