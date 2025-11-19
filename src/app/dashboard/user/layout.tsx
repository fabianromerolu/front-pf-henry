//src/app/dashboard/user/layout.tsx
"use client";

import React from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth
      role="user"
      fallback={
        <main className="min-h-dvh grid place-items-center text-white/80">
          Cargando…
        </main>
      }
    >
      <main className="container mx-auto max-w-5xl p-4">
        {children}
        <ToastContainer position="top-right" />
      </main>
    </RequireAuth>
  );
}
