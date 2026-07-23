import { Person } from "../../types/person";

type PeopleListProps = {
  people: Person[];
};

export default function PeopleList({
  people,
}: PeopleListProps) {
  if (people.length === 0) {
    return <p>No people found.</p>;
  }

  return (
    <div>
      {people.map((person) => (
        <div
          key={person.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            {person.name}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#666",
            }}
          >
            {person.role}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#666",
            }}
          >
            {person.organisation}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#888",
              marginTop: "6px",
            }}
          >
            {person.email}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#888",
            }}
          >
            {person.phone}
          </div>
        </div>
      ))}
    </div>
  );
}