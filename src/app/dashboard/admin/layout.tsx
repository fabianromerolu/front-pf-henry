// src/app/dashboard/admin/layout.tsx
import type { ReactNode } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import AdminShell from "@/components/dashboards/admin/layout/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth
      role="admin"
      fallback={
        <main className="min-h-dvh flex items-center justify-center bg-white text-dark-blue">
          <p className="text-sm opacity-80">
            Comprobando permisos de administrador…
          </p>
        </main>
      }
    >
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
