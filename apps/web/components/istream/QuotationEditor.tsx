"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveQuotation, type QuotationInput } from "@/lib/actions/quotation.actions";

type Client = { id: string; company: string; contactName: string | null; address: string | null; vatTin: string | null; email: string | null; phone: string | null };
type Item = { id: string; code: string; description: string; unitPrice: number };
type Line = QuotationInput["lines"][number];
const blankLine = (): Line => ({ itemCode: "", description: "", quantity: 1, days: 1, unitPrice: 0 });

export default function QuotationEditor({ initial, clients, catalogue, nextNumber }: { initial?: any; clients: Client[]; catalogue: Item[]; nextNumber: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<QuotationInput>(() => ({
    id: initial?.id, quotationNo: initial?.quotationNo ?? nextNumber,
    quotationDate: initial?.quotationDate ? new Date(initial.quotationDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    validDays: initial?.validDays ?? 30, projectRef: initial?.projectRef ?? "", jobDescription: initial?.jobDescription ?? "",
    vatRate: initial?.vatRate ?? 0, status: initial?.status ?? "DRAFT",
    client: initial?.client ?? { company: "", contactName: "", address: "", vatTin: "", email: "", phone: "" },
    lines: Array.from({ length: 20 }, (_, i) => initial?.lines?.[i] ? { ...initial.lines[i] } : blankLine()),
  }));
  const subtotal = useMemo(() => form.lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.days || 0) * Number(line.unitPrice || 0), 0), [form.lines]);
  const vat = subtotal * Number(form.vatRate || 0) / 100;
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid #475569", borderRadius: 7, background: "#0F172A", color: "white", padding: 10 };
  const setLine = (index: number, patch: Partial<Line>) => setForm((current) => ({ ...current, lines: current.lines.map((line, i) => i === index ? { ...line, ...patch } : line) }));
  const chooseClient = (id: string) => { const client = clients.find((entry) => entry.id === id); if (client) setForm({ ...form, client: { ...client, contactName: client.contactName ?? "", address: client.address ?? "", vatTin: client.vatTin ?? "", email: client.email ?? "", phone: client.phone ?? "" } }); };
  const chooseItem = (index: number, id: string) => { const item = catalogue.find((entry) => entry.id === id); if (item) setLine(index, { catalogueItemId: item.id, itemCode: item.code, description: item.description, unitPrice: item.unitPrice }); };
  async function submit() { setSaving(true); setError(""); try { const saved = await saveQuotation(form); router.push(`/istream/quotations/${saved.id}`); router.refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to save quotation."); } finally { setSaving(false); } }

  return <div style={{ display: "grid", gap: 20 }}>
    <section style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
      <div className="quote-two"><div><label>Existing client</label><select style={inputStyle} value={form.client.id ?? ""} onChange={(e) => chooseClient(e.target.value)}><option value="">New client</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}</select></div><div><label>Quotation number</label><input style={inputStyle} value={form.quotationNo} onChange={(e) => setForm({ ...form, quotationNo: e.target.value })} /></div></div>
      <div className="quote-two"><div><label>Company</label><input style={inputStyle} value={form.client.company} onChange={(e) => setForm({ ...form, client: { ...form.client, company: e.target.value } })} /></div><div><label>Quotation date</label><input type="date" style={inputStyle} value={form.quotationDate} onChange={(e) => setForm({ ...form, quotationDate: e.target.value })} /></div></div>
      <div className="quote-two"><div><label>Contact person</label><input style={inputStyle} value={form.client.contactName ?? ""} onChange={(e) => setForm({ ...form, client: { ...form.client, contactName: e.target.value } })} /></div><div><label>Validity (days)</label><input type="number" style={inputStyle} value={form.validDays} onChange={(e) => setForm({ ...form, validDays: Number(e.target.value) })} /></div></div>
      <div className="quote-two"><div><label>Address</label><textarea rows={3} style={inputStyle} value={form.client.address ?? ""} onChange={(e) => setForm({ ...form, client: { ...form.client, address: e.target.value } })} /></div><div><label>VAT / TIN</label><input style={inputStyle} value={form.client.vatTin ?? ""} onChange={(e) => setForm({ ...form, client: { ...form.client, vatTin: e.target.value } })} /><label>Project / reference</label><input style={inputStyle} value={form.projectRef ?? ""} onChange={(e) => setForm({ ...form, projectRef: e.target.value })} /></div></div>
      <label>Job description / overview</label><textarea rows={4} style={inputStyle} value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
    </section>
    <section style={{ overflowX: "auto", background: "#1E293B", border: "1px solid #334155", borderRadius: 12 }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}><thead><tr>{["Item Code", "Description", "Qty", "Days", "Unit Price", "Amount"].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{form.lines.map((line, index) => <tr key={index}><td><select style={inputStyle} value={line.catalogueItemId ?? ""} onChange={(e) => chooseItem(index, e.target.value)}><option value="">Select</option>{catalogue.map((item) => <option key={item.id} value={item.id}>{item.code}</option>)}</select></td><td><input style={inputStyle} value={line.description} onChange={(e) => setLine(index, { description: e.target.value })} /></td><td><input type="number" min="0" step="0.01" style={inputStyle} value={line.quantity} onChange={(e) => setLine(index, { quantity: Number(e.target.value) })} /></td><td><input type="number" min="0" step="0.01" style={inputStyle} value={line.days} onChange={(e) => setLine(index, { days: Number(e.target.value) })} /></td><td><input type="number" min="0" step="0.01" style={inputStyle} value={line.unitPrice} onChange={(e) => setLine(index, { unitPrice: Number(e.target.value) })} /></td><td style={{ textAlign: "right", padding: 10 }}>{money(line.quantity * line.days * line.unitPrice)}</td></tr>)}</tbody></table></section>
    <section style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ width: 340, background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 20 }}><div className="total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="total"><label>VAT %</label><input type="number" min="0" step="0.1" style={{ ...inputStyle, width: 90 }} value={form.vatRate} onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })} /><strong>{money(vat)}</strong></div><div className="total grand"><span>Quotation total</span><strong>{money(subtotal + vat)}</strong></div></div></section>
    {error && <p style={{ color: "#FCA5A5" }}>{error}</p>}
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><button onClick={submit} disabled={saving}>{saving ? "Saving…" : initial ? "Save amendment" : "Save quotation"}</button>{initial && <button className="secondary" onClick={() => window.open(`/istream/quotations/${initial.id}/print`, "_blank")}>Print / Save PDF</button>}<button className="secondary" onClick={() => router.push("/istream/quotations")}>Cancel</button></div>
    <style jsx>{`label{display:block;color:#CBD5E1;margin:0 0 7px;font-size:13px}.quote-two{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:16px}th{background:#173F68;color:white;text-align:left;padding:12px}td{border-top:1px solid #334155;padding:7px}.total{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0}.grand{border-top:1px solid #475569;margin-top:8px;padding-top:16px;font-size:18px}button{border:0;border-radius:8px;background:#2563EB;color:white;font-weight:700;padding:12px 20px;cursor:pointer}.secondary{background:#334155}@media(max-width:760px){.quote-two{grid-template-columns:1fr}}`}</style>
  </div>;
}