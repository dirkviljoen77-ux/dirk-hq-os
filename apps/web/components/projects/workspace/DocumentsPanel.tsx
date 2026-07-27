"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createDocument,
  deleteDocument,
  getDocuments,
} from "@/lib/actions/document.actions";

type Props = {
  projectId: string;
};

type Document = {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export default function DocumentsPanel({
  projectId,
}: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [name, setName] = useState("");
  const [, startTransition] = useTransition();

  async function loadDocuments() {
    const data = await getDocuments(projectId);
    setDocuments(data);
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleAdd() {
    if (!name.trim()) return;

    startTransition(async () => {
      await createDocument({
        name,
        fileName: `${name}.pdf`,
        fileType: "application/pdf",
        fileSize: 0,
        projectId,
      });

      setName("");
      await loadDocuments();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deleteDocument(id);
      await loadDocuments();
    });
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Documents</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Document name"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <button
          onClick={handleAdd}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: 8,
            background: "#2563EB",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            <strong>{doc.name}</strong>

            <div
              style={{
                color: "#94A3B8",
                marginTop: 4,
              }}
            >
              {doc.fileName}
            </div>
          </div>

          <button
            onClick={() => handleDelete(doc.id)}
            style={{
              border: "none",
              background: "transparent",
              color: "#EF4444",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}