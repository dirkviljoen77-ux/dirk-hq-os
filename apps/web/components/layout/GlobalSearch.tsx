"use client";

import { useState } from "react";
import { searchEverything } from "@/lib/actions/search.actions";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  async function handleSearch(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setResults(null);
      return;
    }

    const data = await searchEverything(value);
    setResults(data);
  }

  return (
    <div
      style={{
        marginBottom: 24,
      }}
    >
      <input
        placeholder="Search everything..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #334155",
          background: "#0F172A",
          color: "white",
          fontSize: 16,
        }}
      />

      {results && (
        <div
          style={{
            marginTop: 20,
            background: "#1E293B",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h3>Projects ({results.projects.length})</h3>

          {results.projects.map((p: any) => (
            <div key={p.id}>{p.name}</div>
          ))}

          <h3 style={{ marginTop: 20 }}>
            Tasks ({results.tasks.length})
          </h3>

          {results.tasks.map((t: any) => (
            <div key={t.id}>{t.title}</div>
          ))}

          <h3 style={{ marginTop: 20 }}>
            Meetings ({results.meetings.length})
          </h3>

          {results.meetings.map((m: any) => (
            <div key={m.id}>{m.title}</div>
          ))}

          <h3 style={{ marginTop: 20 }}>
            People ({results.people.length})
          </h3>

          {results.people.map((p: any) => (
            <div key={p.id}>
              {p.firstName} {p.lastName}
            </div>
          ))}

          <h3 style={{ marginTop: 20 }}>
            Documents ({results.documents.length})
          </h3>

          {results.documents.map((d: any) => (
            <div key={d.id}>{d.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}