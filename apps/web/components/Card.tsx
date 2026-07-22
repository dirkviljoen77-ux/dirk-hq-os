type CardProps = {
  title: string;
  value: string;
};

export default function Card({ title, value }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "10px",
        padding: "20px",
        minWidth: "180px",
      }}
    >
      <h3>{title}</h3>

      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        {value}
      </p>
    </div>
  );
}