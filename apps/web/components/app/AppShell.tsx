"use client";

import { ReactNode } from "react";
import Sidebar from "../layout/Sidebar";
import { theme } from "../../app/theme";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Sidebar />

      <section
        style={{
          flex: 1,
          padding: theme.spacing.xl,
        }}
      >
        {children}
      </section>
    </main>
  );
}