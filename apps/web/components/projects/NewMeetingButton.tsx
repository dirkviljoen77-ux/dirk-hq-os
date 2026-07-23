type NewMeetingButtonProps = {
  onClick: () => void;
};

export default function NewMeetingButton({
  onClick,
}: NewMeetingButtonProps) {
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
      + New Meeting
    </button>
  );
}