"use client";

import { ReactNode } from "react";

import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export default function AppShell({
  children,
  title = "DIRK HQ",
}: AppShellProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      <Sidebar current="Projects" />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar title={title} />

        <main
          style={{
            flex: 1,
            padding: "24px",
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}