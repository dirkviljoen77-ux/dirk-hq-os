export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import QuotationEditor from "@/components/istream/QuotationEditor";
import { getQuotation, getQuotationWorkspace, nextQuotationNumber } from "@/lib/actions/quotation.actions";
export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quotation, workspace, nextNumber] = await Promise.all([getQuotation(id), getQuotationWorkspace(), nextQuotationNumber()]);
  if (!quotation) notFound();
  return <AppShell title="Istream Business"><h1>Edit {quotation.quotationNo}</h1><p style={{ color: "#94A3B8" }}>Revision {quotation.revision} · Last updated {quotation.updatedAt.toLocaleString("en-GB")}</p><QuotationEditor initial={quotation} clients={workspace.clients} catalogue={workspace.catalogue} projects={workspace.projects} nextNumber={nextNumber} /></AppShell>;
}
