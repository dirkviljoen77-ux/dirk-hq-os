type TopBarProps = {
  title: string;
};

export default function TopBar({
  title,
}: TopBarProps) {
  return (
    <header
      style={{
        height: "72px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
       justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        boxSizing: "border-box",
        background: "#ffffff",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        

        <div
          style={{
            padding: "10px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontWeight: 500,
          }}
        >
          Dirk
        </div>
      </div>
    </header>
  );
}