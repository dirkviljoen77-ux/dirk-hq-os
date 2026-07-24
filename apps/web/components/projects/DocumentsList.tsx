"use client";

import { useState } from "react";
import DashboardPanel from "../dashboard/DashboardPanel";

type ProjectDocument = {
  id: number;
  projectId: number;
  name: string;
  type: string;
  uploaded: string;
};

type Props = {
  projectId: number;
};

const initialDocuments: ProjectDocument[] = [
  {
    id: 1,
    projectId: 2,
    name: "BHPC Masterplan.pdf",
    type: "PDF",
    uploaded: "2026-07-24",
  },
  {
    id: 2,
    projectId: 2,
    name: "Financial Model.xlsx",
    type: "Excel",
    uploaded: "2026-07-23",
  },
];

export default function DocumentsList({ projectId }: Props) {
  const [documents, setDocuments] = useState(initialDocuments);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const projectDocuments = documents.filter(
    (d) => d.projectId === projectId
  );

  function addDocument() {
    if (!name.trim()) return;

    if (editingId !== null) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingId
            ? {
                ...doc,
                name,
                type: type || "General",
              }
            : doc
        )
      );

      setEditingId(null);
    } else {
      const newDocument: ProjectDocument = {
        id: Date.now(),
        projectId,
        name,
        type: type || "General",
        uploaded: new Date().toISOString().split("T")[0],
      };

      setDocuments((prev) => [...prev, newDocument]);
    }

    setName("");
    setType("");
  }

  function editDocument(doc: ProjectDocument) {
    setEditingId(doc.id);
    setName(doc.name);
    setType(doc.type);
  }

  function deleteDocument(id: number) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setName("");
      setType("");
    }
  }

  return (
    <DashboardPanel title="Documents">
      <div style={{ marginBottom: 20 }}>
        <input
          value={name}
          placeholder="Document name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          value={type}
          placeholder="Type"
          onChange={(e) => setType(e.target.value)}
          style={{ marginLeft: 8 }}
        />

        <button
          onClick={addDocument}
          style={{ marginLeft: 8 }}
        >
          {editingId !== null ? "Save" : "Add"}
        </button>
      </div>

      {projectDocuments.map((doc) => (
        <div
          key={doc.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #334155",
          }}
        >
          <strong>{doc.name}</strong>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <span style={{ color: "#CBD5E1" }}>
              {doc.type} • {doc.uploaded}
            </span>

            <div>
              <button
                onClick={() => editDocument(doc)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  marginRight: 8,
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteDocument(doc.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {projectDocuments.length === 0 && (
        <p>No documents.</p>
      )}
    </DashboardPanel>
  );
}