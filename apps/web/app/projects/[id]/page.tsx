import AppShell from "../../../components/layout/AppShell";
import ProjectWorkspace from "../../../components/projects/workspace/ProjectWorkspace";
import { getProject } from "@/lib/actions/project.actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({
  params,
}: Props) {
  const { id } = await params;

  // Read the project from PostgreSQL
  const dbProject = await getProject(id);

  if (!dbProject) {
    return (
      <AppShell>
        <h1
          style={{
            color: "white",
          }}
        >
          Project not found
        </h1>
      </AppShell>
    );
  }

  // Temporary UI mapping
  const project = {
    id: dbProject.id,
    name: dbProject.name,
    progress: 0,
    owner: "Dirk Viljoen",
    due: "-",
  };

  const quotations = dbProject.businessQuotations;
  const jobs = dbProject.jobs;
  const quotationValue = quotations.reduce((sum, quotation) => {
    const subtotal = quotation.lines.reduce(
      (lineSum, line) => lineSum + line.quantity * line.days * line.unitPrice,
      0,
    );
    return sum + subtotal * (1 + quotation.vatRate / 100);
  }, 0);
  const jobValue = jobs.reduce(
    (sum, job) => sum + (job.finance?.approvedBudget || 0),
    0,
  );

  return (
    <AppShell>
      <section className="commercial-overview">
        <div className="commercial-heading">
          <div>
            <p className="eyebrow">PROJECT COMMERCIAL OVERVIEW</p>
            <h2>{dbProject.name}</h2>
          </div>
          <div className="summary-cards">
            <span><strong>{quotations.length}</strong> Quotations<br />{money(quotationValue)}</span>
            <span><strong>{jobs.length}</strong> Jobs<br />{money(jobValue)}</span>
          </div>
        </div>

        <h3>Linked quotations</h3>
        <div className="commercial-table"><table><thead><tr><th>Quotation</th><th>Client</th><th>Date</th><th>Status</th><th>Value</th><th></th></tr></thead><tbody>
          {quotations.map((quotation) => {
            const subtotal = quotation.lines.reduce((sum, line) => sum + line.quantity * line.days * line.unitPrice, 0);
            return <tr key={quotation.id}><td>{quotation.quotationNo}</td><td>{quotation.client.company}</td><td>{quotation.quotationDate.toLocaleDateString("en-GB")}</td><td>{quotation.status}{quotation.deletedAt ? " · Archived" : ""}</td><td>{money(subtotal * (1 + quotation.vatRate / 100), quotation.currency)}</td><td><Link href={`/istream/quotations/${quotation.id}`}>Open</Link></td></tr>;
          })}
          {!quotations.length && <tr><td colSpan={6} className="empty">No quotations are attached to this project yet.</td></tr>}
        </tbody></table></div>

        <h3>Linked jobs</h3>
        <div className="commercial-table"><table><thead><tr><th>Job</th><th>Client</th><th>Start</th><th>Status</th><th>Value</th><th></th></tr></thead><tbody>
          {jobs.map((job) => <tr key={job.id}><td>{job.jobNo} · {job.name}</td><td>{job.quotations[0]?.client.company || "–"}</td><td>{job.startDate?.toLocaleDateString("en-GB") || "–"}</td><td>{job.status}</td><td>{money(job.finance?.approvedBudget || 0, job.finance?.currency || "USD")}</td><td><Link href={`/projects/${job.id}`}>Open job</Link></td></tr>)}
          {!jobs.length && <tr><td colSpan={6} className="empty">No jobs are attached to this project yet.</td></tr>}
        </tbody></table></div>
      </section>
      <ProjectWorkspace project={project} />
      <style>{`.commercial-overview{background:#0f172a;border:1px solid #334155;border-radius:14px;padding:22px;margin-bottom:22px;color:#fff}.commercial-heading{display:flex;justify-content:space-between;gap:20px;align-items:start}.commercial-heading h2{margin:4px 0 18px}.eyebrow{font-size:12px;letter-spacing:.08em;color:#60a5fa;margin:0}.summary-cards{display:flex;gap:10px}.summary-cards span{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:10px 16px;min-width:130px}.summary-cards strong{font-size:20px}.commercial-overview h3{margin:18px 0 8px}.commercial-table{overflow-x:auto}.commercial-table table{width:100%;border-collapse:collapse;min-width:720px}.commercial-table th,.commercial-table td{padding:10px;border-bottom:1px solid #334155;text-align:left}.commercial-table th{font-size:12px;color:#94a3b8}.commercial-table a{color:#60a5fa}.empty{color:#94a3b8;text-align:center!important}@media(max-width:720px){.commercial-heading{display:grid}.summary-cards{flex-wrap:wrap}}`}</style>
    </AppShell>
  );
}
