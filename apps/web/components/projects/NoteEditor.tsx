"use client";

import { useRef } from "react";

type NoteEditorProps = {
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
};

export default function NoteEditor({
  onSave,
  onCancel,
}: NoteEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        New Executive Note
      </h3>

      <input
        ref={titleRef}
        placeholder="Title"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <textarea
        ref={contentRef}
        placeholder="Write your note..."
        rows={6}
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
          marginBottom: "16px",
          resize: "vertical",
        }}
      />

      <button
        onClick={() =>
          onSave(
            titleRef.current?.value ?? "",
            contentRef.current?.value ?? ""
          )
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