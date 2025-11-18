// src/components/dashboards/admin/layout/AdminShell.tsx
"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-8 py-6 flex gap-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <AdminSidebar />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <AdminHeader />
          <main
            className="
              mb-10 rounded-2xl
              border border-[var(--color-custume-blue)]/60
              bg-[var(--color-dark-blue)]
              text-[var(--color-custume-light)]
              shadow-[0_18px_45px_rgba(0,0,0,.35)]
              p-4 sm:p-6
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
