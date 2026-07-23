"use client";

import { useRef } from "react";

type PersonEditorProps = {
  onSave: (
    name: string,
    organisation: string,
    role: string,
    email: string,
    phone: string
  ) => void;
  onCancel: () => void;
};

export default function PersonEditor({
  onSave,
  onCancel,
}: PersonEditorProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const organisationRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>New Person</h3>

      <input
        ref={nameRef}
        placeholder="Name"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <input
        ref={organisationRef}
        placeholder="Organisation"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <input
        ref={roleRef}
        placeholder="Role"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <input
        ref={emailRef}
        placeholder="Email"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          boxSizing: "border-box",
        }}
      />

      <input
        ref={phoneRef}
        placeholder="Phone"
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
            nameRef.current?.value ?? "",
            organisationRef.current?.value ?? "",
            roleRef.current?.value ?? "",
            emailRef.current?.value ?? "",
            phoneRef.current?.value ?? ""
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