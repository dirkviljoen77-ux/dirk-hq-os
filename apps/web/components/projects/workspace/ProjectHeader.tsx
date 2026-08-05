"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Project } from "../types";
import { deleteProject } from "@/lib/actions/project.actions";

type Props = {
  project: Project;
};

export default function ProjectHeader({ project }: Props) {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete “${project.name}” and all of its tasks, meetings, people, records, and Google Drive documents? This cannot be undone.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await deleteProject(project.id);
        if ("error" in result) throw new Error(result.error);
        router.push("/projects");
        router.refresh();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Unable to delete this project.");
      }
    });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
      }}
    >
      <div>
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: 34,
          }}
        >
          {project.name}
        </h1>

      </div>

      <div
        style={{
          textAlign: "right",
          color: "#94A3B8",
          lineHeight: 1.8,
        }}
      >
        <div>
          <strong>Owner:</strong> {project.owner}
        </div>

        <div>
          <strong>Progress:</strong> {project.progress}%
        </div>

        <div>
          <strong>Due:</strong> {project.due}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            marginTop: 12,
            padding: "8px 12px",
            border: "1px solid #EF4444",
            borderRadius: 8,
            background: "transparent",
            color: "#FCA5A5",
            cursor: isDeleting ? "wait" : "pointer",
          }}
        >
          {isDeleting ? "Deleting…" : "Delete project"}
        </button>
      </div>
    </div>
  );
}
