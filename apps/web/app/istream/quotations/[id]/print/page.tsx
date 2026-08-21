import { notFound } from "next/navigation";
import { getQuotation } from "@/lib/actions/quotation.actions";
import PrintControls from "@/components/istream/PrintControls";

export default async function PrintQuotation({ params }: { params: Promise<{ id: string }> }) {
  const quote = await getQuotation((await params).id);
  if (!quote) notFound();

  const subtotal = quote.lines.reduce((sum, line) => sum + line.quantity * line.days * line.unitPrice, 0);
  const vat = subtotal * quote.vatRate / 100;
  const money = (value: number) => `USD ${value.toFixed(2)}`;
  const rows = Array.from({ length: 20 }, (_, index) => quote.lines[index] ?? null);
  const validUntil = new Date(quote.quotationDate);
  validUntil.setDate(validUntil.getDate() + quote.validDays);

  return (
    <div className="print-screen">
      <PrintControls quotationId={quote.id} />
      <main className="quotation-page">
        <header className="document-header">
          <div className="company-block">
            <h2>DIGITAL SEQUENCE (PRIVATE) LIMITED<br />T/A</h2>
            <p>Old MOTA Office<br />Borrowdale Racecourse<br />Harare, Zimbabwe<br />Email: accounts@istream.co.zw<br />Cell: +263 772 413 346</p>
          </div>
          <div className="identity-block">
            <img src="/istream-logo.png" alt="Istream" />
            <h1>QUOTATION</h1>
          </div>
        </header>

        <section className="details-grid">
          <div className="client-card">
            <h3>Client Details</h3>
            <div className="client-copy">
              {quote.client.contactName && <>{quote.client.contactName}<br /></>}
              <strong>{quote.client.company}</strong><br />
              <span className="preserve-lines">{quote.client.address}</span>
            </div>
            <div className="client-row"><b>Client</b><span>{quote.client.company}</span></div>
            <div className="client-row"><b>Customer VAT / TIN</b><span>{quote.client.vatTin || "—"}</span></div>
          </div>
          <dl className="quotation-meta">
            <dt>Quotation Date</dt><dd>{quote.quotationDate.toLocaleDateString("en-GB")}</dd>
            <dt>Quotation No.</dt><dd>{quote.quotationNo}</dd>
            <dt>Revision</dt><dd>R{quote.revision}</dd>
            <dt>Valid Days</dt><dd>{quote.validDays}</dd>
            <dt>Valid Until</dt><dd>{validUntil.toLocaleDateString("en-GB")}</dd>
            <dt>Company VAT No.</dt><dd>—</dd>
            <dt>Company TIN</dt><dd>2002468536</dd>
            <dt>Project / Reference</dt><dd>{quote.projectRef || "—"}</dd>
          </dl>
        </section>

        <h3 className="section-bar">JOB DESCRIPTION / OVERVIEW</h3>
        <div className="job-overview">{quote.jobDescription}</div>

        <table className="line-items">
          <thead><tr><th>Item Code</th><th>Description</th><th>Qty</th><th>Days</th><th>Unit Price</th><th>Amount</th></tr></thead>
          <tbody>{rows.map((line, index) => (
            <tr key={line?.id ?? `blank-${index}`}>
              <td>{line?.itemCode ?? ""}</td><td>{line?.description ?? ""}</td>
              <td>{line ? line.quantity : ""}</td><td>{line ? line.days : ""}</td>
              <td>{line ? line.unitPrice.toFixed(2) : ""}</td><td>{line ? (line.quantity * line.days * line.unitPrice).toFixed(2) : ""}</td>
            </tr>
          ))}</tbody>
        </table>

        <section className="financial-grid">
          <div className="banking"><h3>Banking Details</h3><p>Digital Sequence (Private) Limited T/A Istream<br />Bank: CABS<br />Nostro Acc No: 1156000521<br />ZWG Acc No: 1156000505</p></div>
          <dl className="totals"><dt>Subtotal Excl VAT</dt><dd>{money(subtotal)}</dd><dt>VAT Total ({quote.vatRate.toFixed(1)}%)</dt><dd>{money(vat)}</dd><dt className="quotation-total">Quotation Total</dt><dd className="quotation-total">{money(subtotal + vat)}</dd></dl>
        </section>

        <h3 className="section-bar terms-heading">Terms and Conditions</h3>
        <div className="terms">Quotation valid for {quote.validDays} days. Prices are in USD and exclude VAT unless stated otherwise.<br />Payment terms: 50% deposit on acceptance; balance on completion, unless otherwise agreed in writing.<br />Delivery / lead time: To be agreed following written acceptance.<br />Scope changes or additional work may be quoted separately.</div>
        <footer>We Can Also Upload Your Product / Service Offerings - Podcast Studio</footer>
      </main>

      <style>{`
        :root{--navy:#173f68;--blue:#dcecf5;--input:#fff2c7;--grey:#b8b8b8;--line:#8b9299}
        *{box-sizing:border-box}body{margin:0;background:#dfe4ea;color:#172033;font-family:Arial,Helvetica,sans-serif}.print-screen{padding:24px}.quotation-page{width:210mm;min-height:297mm;margin:0 auto;background:white;padding:9mm 10mm 7mm;box-shadow:0 10px 35px rgba(15,23,42,.24);font-size:9px}.document-header{display:grid;grid-template-columns:1fr 1fr;min-height:40mm}.company-block h2{font-family:Georgia,serif;font-size:15px;line-height:1.15;margin:0 0 7px}.company-block p{line-height:1.32;margin:0}.identity-block{text-align:center}.identity-block img{display:block;width:83mm;max-height:19mm;object-fit:contain;margin:0 auto 7px}.identity-block h1{font-size:21px;letter-spacing:.4px;margin:0}.details-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:13mm;align-items:start}.client-card,.quotation-meta{border:1px solid var(--line)}.client-card h3,.section-bar,.banking h3{margin:0;background:var(--grey);padding:5px 7px;text-align:center;font-size:9px}.client-copy{min-height:29mm;padding:7px;background:var(--blue);line-height:1.35}.preserve-lines{white-space:pre-line}.client-row{display:grid;grid-template-columns:38% 62%;border-top:1px solid var(--line)}.client-row>*{padding:5px}.client-row b{background:#d4d4d4}.client-row span{background:var(--input)}dl{margin:0}.quotation-meta,.totals{display:grid;grid-template-columns:1fr 1.3fr}.quotation-meta dt,.quotation-meta dd,.totals dt,.totals dd{margin:0;padding:4px 6px;border-bottom:1px solid var(--line)}.quotation-meta dt,.totals dt{font-weight:bold;background:#d4d4d4;border-right:1px solid var(--line)}.quotation-meta dd{text-align:center;background:var(--blue)}.quotation-meta dd:nth-of-type(-n+4){background:var(--input)}.section-bar{margin-top:4mm;background:var(--grey);border:1px solid var(--line)}.job-overview{min-height:18mm;padding:7px;background:var(--input);border:1px solid var(--line);border-top:0;white-space:pre-line}.line-items{width:100%;margin-top:3mm;border-collapse:collapse;table-layout:fixed}.line-items th{padding:5px;background:var(--navy);color:white;border:1px solid white;text-align:center}.line-items th:nth-child(1){width:13%}.line-items th:nth-child(2){width:40%}.line-items th:nth-child(3),.line-items th:nth-child(4){width:7%}.line-items th:nth-child(5),.line-items th:nth-child(6){width:16.5%}.line-items td{height:5.4mm;padding:3px 5px;border:1px solid var(--line)}.line-items td:nth-child(1),.line-items td:nth-child(3),.line-items td:nth-child(4),.line-items td:nth-child(5){background:var(--input)}.line-items td:nth-child(2),.line-items td:nth-child(6){background:var(--blue)}.line-items td:nth-child(n+3){text-align:right}.financial-grid{display:grid;grid-template-columns:58% 42%;margin-top:2mm}.banking{border:1px solid var(--line)}.banking p{margin:0;padding:6px;line-height:1.35}.totals{border:1px solid var(--line);border-left:0}.totals dd{text-align:right}.totals .quotation-total{font-size:10px;font-weight:bold;background:var(--blue)}.terms-heading{margin-top:2mm}.terms{min-height:21mm;background:var(--blue);border:1px solid var(--line);border-top:0;padding:6px;line-height:1.35}footer{text-align:center;font-size:7px;font-style:italic;color:#5b6470;margin-top:3mm}@media(max-width:900px){.print-screen{padding:10px;overflow-x:auto}.quotation-page{transform-origin:top left}}@page{size:A4 portrait;margin:0}@media print{body{background:white}.print-screen{padding:0}.quotation-page{width:210mm;height:297mm;min-height:0;margin:0;padding:8mm 9mm 6mm;box-shadow:none;overflow:hidden}.line-items td{height:5.15mm}}
      `}</style>
    </div>
  );
}
