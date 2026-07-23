type CardProps = {
  title: string;
  value: string;
};

export default function Card({ title, value }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "#1E293B",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "24px",
        minWidth: "180px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "15px",
          color: "#CBD5E1",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "16px 0 0 0",
          fontSize: "36px",
          fontWeight: 700,
          color: "#FFFFFF",
        }}
      >
        {value}
      </p>
    </div>
  );
}