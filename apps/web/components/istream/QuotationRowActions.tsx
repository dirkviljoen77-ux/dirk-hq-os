"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { archiveQuotation, duplicateQuotation, restoreArchivedQuotation } from "@/lib/actions/quotation.actions";

export default function QuotationRowActions({ id, archived }: { id: string; archived: boolean }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function run(action: "duplicate" | "archive" | "restore") {
    setBusy(true);
    if (action === "duplicate") { const result = await duplicateQuotation(id); router.push(`/istream/quotations/${result.id}`); }
    if (action === "archive") { if (window.confirm("Archive this quotation? You can restore it later.")) await archiveQuotation(id); }
    if (action === "restore") await restoreArchivedQuotation(id);
    router.refresh(); setBusy(false);
  }
  return <div style={{ display: "flex", gap: 7 }}>
    {!archived && <><button disabled={busy} onClick={() => run("duplicate")}>Duplicate</button><button disabled={busy} onClick={() => run("archive")}>Archive</button></>}
    {archived && <button disabled={busy} onClick={() => run("restore")}>Restore</button>}
    <style jsx>{`button{border:1px solid #475569;border-radius:6px;background:#0f172a;color:#cbd5e1;padding:6px 9px;cursor:pointer}`}</style>
  </div>;
}
