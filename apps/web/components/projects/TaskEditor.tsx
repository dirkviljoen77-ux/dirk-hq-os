"use client";

import { useRef } from "react";

type TaskEditorProps = {
  onSave: (title: string) => void;
  onCancel: () => void;
};

export default function TaskEditor({
  onSave,
  onCancel,
}: TaskEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>New Task</h3>

      <input
        ref={titleRef}
        placeholder="Task title"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "16px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={() =>
          onSave(titleRef.current?.value ?? "")
        }
      >
        Save
      </button>

      <button
        onClick={onCancel}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </div>
  );
}