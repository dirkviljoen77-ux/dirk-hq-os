import Link from "next/link";
import { ProjectCardData } from "./types";

type Props = {
  project: ProjectCardData;
};

export default function ProjectCard({ project }: Props) {
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  const commercial = project.quotationCount > 0 || project.jobCount > 0;
  const statusColour = project.status === "Active" ? "#22C55E" : project.status === "Paid / Closed" ? "#60A5FA" : project.status === "Cancelled" ? "#F87171" : "#FBBF24";
  return (
    <Link
      href={`/projects/${project.id}`}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background: "#1E293B",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #334155",
          cursor: "pointer",
          transition: "all .2s ease",
          minHeight: 235,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}><h2 style={{ color: "white", margin: 0, fontSize: 20 }}>{project.name}</h2><span style={{ color: statusColour, background: `${statusColour}18`, border: `1px solid ${statusColour}55`, padding: "4px 8px", borderRadius: 999, fontSize: 12, whiteSpace: "nowrap" }}>{project.status}</span></div>
        {commercial ? <>
          <p style={{ color: "#94A3B8", margin: "15px 0 10px" }}>{project.quotationCount} quotation{project.quotationCount === 1 ? "" : "s"} · {project.jobCount} job{project.jobCount === 1 ? "" : "s"}{project.activeJobCount ? ` · ${project.activeJobCount} open` : ""}</p>
          {project.nextJobDate && <p style={{ color: "#CBD5E1", margin: "0 0 10px" }}>Next job: {new Date(project.nextJobDate).toLocaleDateString("en-GB")}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, borderTop: "1px solid #334155", paddingTop: 12 }}>
            <span style={{ color: "#94A3B8" }}>Quoted<br/><strong style={{ color: "white" }}>{money(project.quotationValue)}</strong></span>
            <span style={{ color: "#94A3B8" }}>Actual costs<br/><strong style={{ color: "white" }}>{money(project.actualCosts)}</strong></span>
            <span style={{ color: "#94A3B8" }}>Gross profit<br/><strong style={{ color: project.grossProfit >= 0 ? "#86EFAC" : "#FCA5A5" }}>{money(project.grossProfit)}</strong></span>
            <span style={{ color: "#94A3B8" }}>Payment due<br/><strong style={{ color: project.amountDue ? "#FDE68A" : "#86EFAC" }}>{money(project.amountDue)}</strong></span>
          </div>
          <p style={{ color: "#94A3B8", margin: "12px 0 0", fontSize: 13 }}>Received: {money(project.amountReceived)}</p>
        </> : <div style={{ borderTop: "1px solid #334155", marginTop: 16, paddingTop: 16 }}><p style={{ color: "#94A3B8", margin: "0 0 9px" }}>No commercial activity</p><p style={{ color: "#CBD5E1", margin: "0 0 9px" }}>{project.openTaskCount} open task{project.openTaskCount === 1 ? "" : "s"}</p><p style={{ color: "#94A3B8", margin: 0, fontSize: 13 }}>Updated {new Date(project.updatedAt).toLocaleDateString("en-GB")}</p></div>}
      </div>
    </Link>
  );
}
