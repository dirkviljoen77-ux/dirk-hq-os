import Link from "next/link";

type SidebarProps = {
  current: string;
};

const items = [
  { label: "Dashboard", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Calendar", href: "/calendar" },
  { label: "Tasks", href: "/tasks" },
  { label: "Meetings", href: "/meetings" },
 
  { label: "Documents", href: "/documents" },
  { label: "AI Assistant", href: "/assistant" },
  { label: "Settings", href: "/settings" },
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
        <Link
          key={item.label}
          href={item.href}
          style={{
            display: "block",
            padding: "12px 16px",
            marginBottom: "8px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "#fff",
            background:
              current === item.label
                ? "#2563eb"
                : "transparent",
            fontWeight:
              current === item.label ? 600 : 400,
          }}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}