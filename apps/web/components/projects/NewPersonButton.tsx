type NewPersonButtonProps = {
  onClick: () => void;
};

export default function NewPersonButton({
  onClick,
}: NewPersonButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      + New Person
    </button>
  );
}