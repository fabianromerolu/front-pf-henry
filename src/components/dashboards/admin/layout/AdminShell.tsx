// src/components/dashboards/admin/layout/AdminShell.tsx
"use client";

import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[linear-gradient(to_bottom,var(--color-dark-blue)_0%,var(--color-custume-blue)_40%,var(--color-dark-blue)_100%)] text-[var(--color-custume-light)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-8 py-6 flex gap-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <AdminSidebar />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AdminHeader />
          <main className="mt-4 mb-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
