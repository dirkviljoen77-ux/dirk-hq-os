type NewTaskButtonProps = {
  onClick: () => void;
};

export default function NewTaskButton({
  onClick,
}: NewTaskButtonProps) {
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
      + New Task
    </button>
  );
}