"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import GlobalSearch from "./GlobalSearch";

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

const menu = [
  { label: "Dashboard", href: "/" },
  { label: "Istream Business", href: "/istream/quotations" },
  { label: "Projects", href: "/projects" },
  { label: "Calendar", href: "/calendar" },
  { label: "Plan today", href: "/plan" },
  { label: "Inbox", href: "/inbox" },
  { label: "Documents", href: "/documents" },
  { label: "Settings", href: "/settings" },
];

export default function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const drawerToggleRef = useRef<HTMLInputElement>(null);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    if (drawerToggleRef.current) drawerToggleRef.current.checked = false;
  };

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        closeSidebar();
      }
    };

    mobileQuery.addEventListener("change", closeOnDesktop);
    return () => mobileQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSidebarOpen]);

  return (
    <div className="app-shell">
      <input
        aria-hidden="true"
        className="app-shell__drawer-toggle"
        id="app-shell-drawer-toggle"
        onChange={(event) => setIsSidebarOpen(event.target.checked)}
        ref={drawerToggleRef}
        tabIndex={-1}
        type="checkbox"
      />
      <label
        aria-label="Close navigation"
        className={`app-shell__overlay${isSidebarOpen ? " app-shell__overlay--visible" : ""}`}
        htmlFor="app-shell-drawer-toggle"
        tabIndex={isSidebarOpen ? 0 : -1}
      />

      <aside
        aria-label="Main navigation"
        className={`app-shell__sidebar${isSidebarOpen ? " app-shell__sidebar--open" : ""}`}
      >
        <h2 className="app-shell__brand">Dirk HQ</h2>

        <nav className="app-shell__nav" id="main-navigation">
          {menu.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className="app-shell__link"
                style={{
                  color: active ? "#FFFFFF" : "#CBD5E1",
                  background: active ? "#2563EB" : "transparent",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="app-shell__content">
        <header className="app-shell__header">
          <label
            aria-controls="main-navigation"
            aria-expanded={isSidebarOpen}
            aria-label="Open navigation"
            className="app-shell__menu-button"
            htmlFor="app-shell-drawer-toggle"
            role="button"
            tabIndex={0}
          >
            <span aria-hidden="true">☰</span>
          </label>
          <strong className="app-shell__title">{title ?? "Dirk HQ"}</strong>
        </header>

        <main className="app-shell__main">
          <GlobalSearch />
          {children}
        </main>
      </div>

      <style>{`
        .app-shell {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          min-height: 100dvh;
          background: #0F172A;
          color: #F8FAFC;
        }

        .app-shell__sidebar {
          box-sizing: border-box;
          width: 260px;
          padding: 24px;
          background: #111827;
          border-right: 1px solid #1E293B;
        }

        .app-shell__brand { margin: 0 0 40px; font-size: 24px; }
        .app-shell__nav { display: flex; flex-direction: column; gap: 8px; }
        .app-shell__link { padding: 12px 16px; border-radius: 8px; text-decoration: none; transition: background 0.2s, color 0.2s; }
        .app-shell__content { display: flex; min-width: 0; flex-direction: column; overflow: hidden; }
        .app-shell__header { display: flex; height: 70px; flex: 0 0 70px; align-items: center; border-bottom: 1px solid #1E293B; padding: 0 30px; }
        .app-shell__title { font-size: 24px; }
        .app-shell__main { flex: 1; overflow-y: auto; padding: 30px; }
        .app-shell__drawer-toggle, .app-shell__menu-button, .app-shell__overlay { display: none; }

        @media (max-width: 1023px) {
          .app-shell { display: block; }
          .app-shell__sidebar {
            position: fixed;
            z-index: 20;
            inset: 0 auto 0 0;
            height: 100dvh;
            transform: translateX(-100%);
            transition: transform 250ms ease;
            will-change: transform;
          }
          .app-shell__sidebar--open { transform: translateX(0); }
          .app-shell__drawer-toggle:checked ~ .app-shell__sidebar { transform: translateX(0); }
          .app-shell__overlay {
            display: block;
            position: fixed;
            z-index: 10;
            inset: 0;
            width: 100%;
            border: 0;
            background: rgba(0, 0, 0, 0.6);
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            transition: opacity 250ms ease;
          }
          .app-shell__overlay--visible { opacity: 1; pointer-events: auto; }
          .app-shell__drawer-toggle:checked ~ .app-shell__overlay { opacity: 1; pointer-events: auto; }
          .app-shell__content { min-height: 100dvh; }
          .app-shell__header { padding: 0 20px; gap: 16px; }
          .app-shell__menu-button { display: inline-flex; width: 44px; height: 44px; align-items: center; justify-content: center; padding: 0; border: 0; background: transparent; color: #FFFFFF; font-size: 28px; line-height: 1; cursor: pointer; touch-action: manipulation; }
          .app-shell__main { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
