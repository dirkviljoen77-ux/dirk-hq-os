export const dynamic = "force-dynamic";
import AppShell from "@/components/layout/AppShell";
import QuotationEditor from "@/components/istream/QuotationEditor";
import { getQuotationWorkspace, nextQuotationNumber } from "@/lib/actions/quotation.actions";
export default async function NewQuotationPage() {
  const [{ clients, catalogue }, nextNumber] = await Promise.all([getQuotationWorkspace(), nextQuotationNumber()]);
  return <AppShell title="Istream Business"><h1>New quotation</h1><p style={{ color: "#94A3B8" }}>Build and save a reusable client quotation.</p><QuotationEditor clients={clients} catalogue={catalogue} nextNumber={nextNumber} /></AppShell>;
}