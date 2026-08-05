"use client";

import { ChangeEvent, FormEvent, useMemo, useState, useTransition } from "react";
import { getAllDocuments, uploadDocument } from "@/lib/actions/document.actions";

type Project = { id: string; name: string };
type Document = {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  projectId: string;
  driveFileId: string | null;
  webViewLink: string | null;
  createdAt: Date;
  project: Project;
};

type Props = {
  documents: Document[];
  projects: Project[];
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsWorkspace({ documents: initialDocuments, projects }: Props) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [query, setQuery] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesProject = !projectId || document.projectId === projectId;
      const matchesSearch = !normalizedQuery || [document.name, document.fileName, document.project.name]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesProject && matchesSearch;
    });
  }, [documents, projectId, query]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
    setError("");
  }

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selectedFile || !projectId) {
      setError("Choose a project and file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("file", selectedFile);
    formData.append("name", customName);

    startTransition(async () => {
      try {
        await uploadDocument(formData);
        setDocuments(await getAllDocuments());
        setSelectedFile(null);
        setCustomName("");
        setError("");
        form.reset();
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      }
    });
  }

  return (
    <section style={{ color: "#F8FAFC" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Documents</h1>
        <p style={{ margin: "8px 0 0", color: "#94A3B8" }}>Files are stored in Google Drive and linked to their project.</p>
        <a href="/api/google-drive/connect" style={{ display: "inline-block", marginTop: 12, color: "#93C5FD" }}>Connect Google Drive</a>
      </div>

      <form onSubmit={handleUpload} style={{ display: "grid", gap: 12, marginBottom: 28, padding: 20, border: "1px solid #334155", borderRadius: 12, background: "#1E293B" }}>
        <strong>Upload a document</strong>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1fr) minmax(180px, 1fr)", gap: 12 }}>
          <select aria-label="Project" value={projectId} onChange={(event) => setProjectId(event.target.value)} style={fieldStyle}>
            <option value="">Choose a project</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
          <input aria-label="Document name" value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Document name (optional)" style={fieldStyle} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <input aria-label="Choose file" type="file" onChange={handleFileChange} style={{ color: "#CBD5E1" }} />
          <button type="submit" disabled={isPending} style={primaryButtonStyle}>{isPending ? "Uploading…" : "Upload to Google Drive"}</button>
        </div>
        {error && <p role="alert" style={{ margin: 0, color: "#FCA5A5" }}>{error}</p>}
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(180px, 240px)", gap: 12, marginBottom: 16 }}>
        <input aria-label="Search documents" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documents, files, or projects…" style={fieldStyle} />
        <select aria-label="Filter documents by project" value={projectId} onChange={(event) => setProjectId(event.target.value)} style={fieldStyle}>
          <option value="">All projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #334155", borderRadius: 12 }}>
        {filteredDocuments.length === 0 ? (
          <p style={{ margin: 0, padding: 24, color: "#94A3B8" }}>No documents match your search.</p>
        ) : filteredDocuments.map((document) => {
          const driveLink = document.webViewLink ?? (document.driveFileId ? `https://drive.google.com/open?id=${document.driveFileId}` : null);

          return (
            <div key={document.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 16, borderBottom: "1px solid #334155" }}>
              <div style={{ minWidth: 0 }}>
                <strong>{document.name}</strong>
                <div style={{ marginTop: 4, overflow: "hidden", color: "#94A3B8", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{document.project.name} · {document.fileName} · {formatSize(document.fileSize)}</div>
              </div>
              {driveLink ? <a href={driveLink} target="_blank" rel="noreferrer" style={{ color: "#93C5FD", whiteSpace: "nowrap" }}>Open in Drive</a> : <span style={{ color: "#94A3B8" }}>Unavailable</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: 12,
  border: "1px solid #475569",
  borderRadius: 8,
  background: "#0F172A",
  color: "#F8FAFC",
};

const primaryButtonStyle = {
  padding: "12px 16px",
  border: 0,
  borderRadius: 8,
  background: "#2563EB",
  color: "#FFFFFF",
  cursor: "pointer",
};
