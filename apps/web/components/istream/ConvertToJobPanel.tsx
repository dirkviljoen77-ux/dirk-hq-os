"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { convertQuotationToJob } from "@/lib/actions/quotation.actions";

export default function ConvertToJobPanel({ quotation }: { quotation: any }) {
  const router = useRouter();
  const [name, setName] = useState(quotation.projectRef || `${quotation.client.company} – ${quotation.jobDescription.slice(0, 55)}`);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const field = { width: "100%", boxSizing: "border-box" as const, border: "1px solid #475569", borderRadius: 7, background: "#0F172A", color: "white", padding: 10 };
  if (quotation.projectId) return <section style={{ background: "#163526", border: "1px solid #2F855A", borderRadius: 12, padding: 20 }}><strong>This quotation is already linked to a job.</strong><div style={{ marginTop: 14 }}><button onClick={() => router.push(`/projects/${quotation.projectId}`)}>Open job</button></div><style jsx>{`button{border:0;border-radius:8px;background:#16A34A;color:white;font-weight:700;padding:11px 18px;cursor:pointer}`}</style></section>;
  async function convert() {
    if (!window.confirm("Convert this quotation into a job and mark it Accepted?")) return;
    setBusy(true); setError("");
    const result = await convertQuotationToJob({ quotationId: quotation.id, name, startDate, endDate });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    router.push(`/projects/${result.projectId}`); router.refresh();
  }
  return <section style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
    <h3 style={{ marginTop: 0 }}>Convert accepted quotation to job</h3>
    <p style={{ color: "#94A3B8" }}>Creates a job number, schedule entry and initial costing record from this quotation.</p>
    <div className="job-grid"><div><label>Job name</label><input style={field} value={name} onChange={(e) => setName(e.target.value)} /></div><div><label>Start date</label><input type="date" style={field} value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div><div><label>End date</label><input type="date" style={field} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div></div>
    {error && <p style={{ color: "#FCA5A5" }}>{error}</p>}<button disabled={busy} onClick={convert}>{busy ? "Creating job…" : "Convert to job"}</button>
    <style jsx>{`.job-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:14px;margin:16px 0}label{display:block;color:#CBD5E1;margin-bottom:7px;font-size:13px}button{border:0;border-radius:8px;background:#16A34A;color:white;font-weight:700;padding:12px 20px;cursor:pointer}@media(max-width:760px){.job-grid{grid-template-columns:1fr}}`}</style>
  </section>;
}
