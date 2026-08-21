"use client";

import Link from "next/link";

export default function PrintControls({ quotationId }: { quotationId: string }) {
  return (
    <div className="print-controls">
      <Link href={`/istream/quotations/${quotationId}`}>← Back to quotation</Link>
      <button onClick={() => window.print()}>Print / Save PDF</button>
      <style jsx>{`.print-controls{display:flex;justify-content:center;gap:12px;margin:0 auto 18px}.print-controls a,.print-controls button{border:0;border-radius:8px;padding:11px 18px;font:600 14px Arial;text-decoration:none;cursor:pointer}.print-controls a{background:#334155;color:white}.print-controls button{background:#2563eb;color:white}@media print{.print-controls{display:none}}`}</style>
    </div>
  );
}
