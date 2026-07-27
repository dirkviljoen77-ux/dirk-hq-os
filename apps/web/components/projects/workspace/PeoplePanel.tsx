"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createPerson,
  deletePerson,
  getPeople,
  updatePerson,
} from "@/lib/actions/person.actions";

type Props = {
  projectId: string;
};

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  company?: string | null;
  role?: string | null;
};

export default function PeoplePanel({
  projectId,
}: Props) {
  const [people, setPeople] = useState<Person[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
const [editFirstName, setEditFirstName] = useState("");
const [editLastName, setEditLastName] = useState("");
  const [, startTransition] = useTransition();

  async function loadPeople() {
    const data = await getPeople(projectId);
    setPeople(data);
  }

  useEffect(() => {
    loadPeople();
  }, []);

  async function handleAdd() {
    if (!firstName.trim() || !lastName.trim()) return;

    startTransition(async () => {
      await createPerson({
        firstName,
        lastName,
        projectId,
      });

      setFirstName("");
      setLastName("");

      await loadPeople();
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await deletePerson(id);
      await loadPeople();
    });
  }
function startEdit(person: Person) {
  setEditingId(person.id);
  setEditFirstName(person.firstName);
  setEditLastName(person.lastName);
}

async function handleSave() {
  if (!editingId) return;

  startTransition(async () => {
    await updatePerson(editingId, {
      firstName: editFirstName,
      lastName: editLastName,
    });

    setEditingId(null);

    await loadPeople();
  });
}
  return (
    <>
      <h2 style={{ marginTop: 0 }}>People</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #475569",
            background: "#0F172A",
            color: "white",
          }}
        />

        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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

      {people.map((person) => (
        <div
          key={person.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 12,
            borderBottom: "1px solid #334155",
          }}
        >
          <div>
            {editingId === person.id ? (
  <>
    <input
      value={editFirstName}
      onChange={(e) =>
        setEditFirstName(e.target.value)
      }
      style={{
        marginRight: 8,
      }}
    />

    <input
      value={editLastName}
      onChange={(e) =>
        setEditLastName(e.target.value)
      }
    />
  </>
) : (
  <strong>
    {person.firstName} {person.lastName}
  </strong>
)}

            {(person.role || person.company) && (
              <div
                style={{
                  color: "#94A3B8",
                  marginTop: 4,
                }}
              >
                {person.role ?? ""}
                {person.role && person.company ? " • " : ""}
                {person.company ?? ""}
              </div>
            )}
          </div>

         <div
  style={{
    display: "flex",
    gap: 8,
  }}
>
  {editingId === person.id ? (
    <button onClick={handleSave}>
      Save
    </button>
  ) : (
    <button
      onClick={() =>
        startEdit(person)
      }
    >
      Edit
    </button>
  )}

  <button
    onClick={() =>
      handleDelete(person.id)
    }
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
        </div>
      ))}
    </>
  );
}