type NewNoteButtonProps = {
  onClick: () => void;
};

export default function NewNoteButton({
  onClick,
}: NewNoteButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      + New Note
    </button>
  );
}