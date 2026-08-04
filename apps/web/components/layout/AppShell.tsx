"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import GlobalSearch from "./GlobalSearch";

type AppShellProps = {
  children: ReactNode;
};

const menu = [
  { label: "Dashboard", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Calendar", href: "/calendar" },
  { label: "Documents", href: "/documents" },
 
  { label: "Settings", href: "/settings" },
];

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        height: "100vh",
        background: "#0F172A",
        color: "#F8FAFC",
      }}
    >
      {/* Sidebar */}

      <aside
        style={{
          background: "#111827",
          borderRight: "1px solid #1E293B",
          display: "flex",
          flexDirection: "column",
          padding: 24,
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 40,
            fontSize: 24,
          }}
        >
          Dirk HQ 
        
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "#FFFFFF" : "#CBD5E1",
                  background: active ? "#2563EB" : "transparent",
                  fontWeight: active ? 600 : 400,
                  transition: "0.2s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
  style={{
    height: 70,
    borderBottom: "1px solid #1E293B",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 30px",
  }}
>
          

          <strong>Dirk Viljoen</strong>
        </header>

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 30,
          }}
        >
          <GlobalSearch />

          {children}
        </main>
      </div>
    </div>
  );
}