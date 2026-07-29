"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AppShell from "../../../components/layout/AppShell";
import { createProject } from "@/lib/actions/project.actions";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);

      const project = await createProject({
        name,
        description,
      });

      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Unable to create project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "white",
            marginBottom: 8,
          }}
        >
          New Project
        </h1>

        <p
          style={{
            color: "#94A3B8",
            marginBottom: 30,
          }}
        >
          Create a new project.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#1E293B",
            border: "1px solid #334155",
            borderRadius: 12,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <label
              style={{
                color: "white",
                display: "block",
                marginBottom: 8,
              }}
            >
              Project Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #475569",
                background: "#0F172A",
                color: "white",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                color: "white",
                display: "block",
                marginBottom: 8,
              }}
            >
              Description
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #475569",
                background: "#0F172A",
                color: "white",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#EF4444",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#2563EB",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              {saving
                ? "Creating..."
                : "Create Project"}
            </button>

            <Link
              href="/projects"
              style={{
                background: "#334155",
                color: "white",
                borderRadius: 8,
                padding: "12px 24px",
                textDecoration: "none",
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}