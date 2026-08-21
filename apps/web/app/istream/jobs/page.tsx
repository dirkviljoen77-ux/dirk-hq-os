export const dynamic = "force-dynamic";

import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import BusinessNav from "@/components/istream/BusinessNav";
import { getJobRegister } from "@/lib/actions/quotation.actions";

export default async function JobsPage() {
  const jobs = await getJobRegister();
  const money = (value: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  return <AppShell title="Istream Business"><BusinessNav /><div style={{ marginBottom: 20 }}><h1 style={{ margin: 0 }}>Jobs</h1><p style={{ color: "#94A3B8" }}>Accepted quotations converted into scheduled, costed jobs.</p></div>
    <div style={{ overflowX: "auto", background: "#1E293B", border: "1px solid #334155", borderRadius: 12 }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}><thead><tr>{["Job", "Project", "Client", "Quotation", "Start", "Status", "Quoted", "Actual cost", "Gross profit", ""].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{jobs.map((job: any) => { const quote = job.quotations[0]; const revenue = job.finance?.approvedBudget || 0; const actual = job.finance?.actualCost || 0; return <tr key={job.id}><td><strong>{job.jobNo}</strong><br/><span>{job.name}</span></td><td>{job.parentProject?.name || "Unassigned"}</td><td>{quote?.client.company}</td><td>{quote?.quotationNo}</td><td>{job.startDate ? new Date(job.startDate).toLocaleDateString("en-GB") : "–"}</td><td>{job.status}</td><td>{money(revenue, job.finance?.currency)}</td><td>{money(actual, job.finance?.currency)}</td><td style={{ color: revenue - actual >= 0 ? "#86EFAC" : "#FCA5A5" }}>{money(revenue - actual, job.finance?.currency)}</td><td><Link href={`/projects/${job.id}`}>Open</Link></td></tr>; })}{!jobs.length && <tr><td colSpan={10} style={{ color: "#94A3B8", padding: 24 }}>No jobs yet. Open an accepted quotation and choose Convert to job.</td></tr>}</tbody></table></div>
    <style>{`th{color:#cbd5e1;text-align:left;padding:13px;border-bottom:1px solid #334155}td{padding:13px;border-bottom:1px solid #334155}td span{color:#94a3b8}td a{color:#60a5fa;font-weight:700}`}</style>
  </AppShell>;
}
