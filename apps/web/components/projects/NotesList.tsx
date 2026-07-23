import { Note } from "../../types/note";
import { theme } from "../../app/theme";

type NotesListProps = {
  notes: Note[];
};

export default function NotesList({
  notes,
}: NotesListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.md,
      }}
    >
      {notes.length === 0 ? (
        <p
          style={{
            color: theme.colors.textSecondary,
          }}
        >
          No notes available.
        </p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              {note.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: theme.colors.textSecondary,
              }}
            >
              {note.content}
            </p>
          </div>
        ))
      )}
    </div>
  );
}