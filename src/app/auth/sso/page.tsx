// src/app/auth/sso/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authService.service";
import { useAuth } from "@/context/AuthContext";

// ✅ evita SSG/ISR en esta página (solo client runtime)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

export default function SsoBridgePage() {
  // ❌ NO: const { setAuth } = useAuth() as any;
  // ✅ SÍ: primero obtén el objeto, luego opcional encadena
  const auth = typeof useAuth === "function" ? (useAuth() as any) : null;
  const setAuth = auth?.setAuth as undefined | ((u: any, t: any) => void);

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      await saveTokenFromQueryAndHydrateAuth((user, token) => {
        if (typeof setAuth === "function") setAuth(user, token);
      });
    })();
  }, [setAuth]); // con didRun no reejecuta en loop

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm opacity-70">Procesando inicio de sesión…</p>
    </main>
  );
}
