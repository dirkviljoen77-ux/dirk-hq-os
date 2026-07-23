"use client";

import { useRef } from "react";

type MeetingEditorProps = {
  onSave: (title: string, date: string) => void;
  onCancel: () => void;
};

export default function MeetingEditor({
  onSave,
  onCancel,
}: MeetingEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>New Meeting</h3>

      <input
        ref={titleRef}
        placeholder="Meeting title"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <input
        ref={dateRef}
        type="datetime-local"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "16px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={() =>
          onSave(
            titleRef.current?.value ?? "",
            dateRef.current?.value ?? ""
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