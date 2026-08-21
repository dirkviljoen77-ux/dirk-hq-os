export const dynamic = "force-dynamic";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import BusinessNav from "@/components/istream/BusinessNav";
import QuotationRowActions from "@/components/istream/QuotationRowActions";
import { getQuotationWorkspace } from "@/lib/actions/quotation.actions";

export default async function QuotationsPage({ searchParams }: { searchParams: Promise<{ archived?: string }> }) {
  const showArchived = (await searchParams).archived === "1";
  const { quotations } = await getQuotationWorkspace(showArchived);
  const total = (quote: any) => quote.lines.reduce((sum: number, line: any) => sum + line.quantity * line.days * line.unitPrice, 0) * (1 + quote.vatRate / 100);
  return <AppShell title="Istream Business"><BusinessNav /><div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, marginBottom: 18 }}><div><h1 style={{ margin: 0 }}>Quotations</h1><p style={{ color: "#94A3B8" }}>Create, reopen, amend and issue Istream quotations.</p></div><Link href="/istream/quotations/new" style={{ background: "#2563EB", color: "white", padding: "12px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>+ New quotation</Link></div>
    <div style={{ display: "flex", gap: 10, marginBottom: 18 }}><Link href="/istream/quotations" style={{ color: "white", padding: "8px 12px", borderRadius: 7, textDecoration: "none", background: showArchived ? "#334155" : "#2563EB" }}>Active</Link><Link href="/istream/quotations?archived=1" style={{ color: "white", padding: "8px 12px", borderRadius: 7, textDecoration: "none", background: showArchived ? "#2563EB" : "#334155" }}>Archived</Link></div>
    <div style={{ overflowX: "auto", background: "#1E293B", border: "1px solid #334155", borderRadius: 12 }}><table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}><thead><tr>{["Quotation", "Client", "Date", "Revision", "Status", "Total", "Actions"].map((h) => <th key={h} style={{ textAlign: "left", color: "#CBD5E1", padding: 13, borderBottom: "1px solid #334155" }}>{h}</th>)}</tr></thead><tbody>{quotations.map((quote: any) => <tr key={quote.id}>{[quote.quotationNo, quote.client.company, new Date(quote.quotationDate).toLocaleDateString("en-GB"), `R${quote.revision}`, quote.status.replaceAll("_", " "), new Intl.NumberFormat("en-US", { style: "currency", currency: quote.currency }).format(total(quote))].map((v) => <td key={String(v)} style={{ padding: 13, borderBottom: "1px solid #334155" }}>{v}</td>)}<td style={{ padding: 13, borderBottom: "1px solid #334155" }}><QuotationRowActions id={quote.id} archived={showArchived} /></td></tr>)}{!quotations.length && <tr><td colSpan={7} style={{ color: "#94A3B8", padding: 24 }}>No {showArchived ? "archived" : "saved"} quotations.</td></tr>}</tbody></table></div>
  </AppShell>;
}
