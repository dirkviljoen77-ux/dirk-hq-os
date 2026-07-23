type SidebarProps = {
  current: string;
};

const items = [
  "Dashboard",
  "Projects",
  "Calendar",
  "Tasks",
  "Meetings",
  "People",
  "Documents",
  "AI Assistant",
  "Settings",
];

export default function Sidebar({
  current,
}: SidebarProps) {
  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#111827",
        color: "#fff",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "40px",
        }}
      >
        DIRK HQ
      </div>

      {items.map((item) => (
        <div
          key={item}
          style={{
            padding: "12px 16px",
            marginBottom: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            background:
              current === item
                ? "#2563eb"
                : "transparent",
            fontWeight:
              current === item ? 600 : 400,
          }}
        >
          {item}
        </div>
      ))}
    </aside>
  );
}