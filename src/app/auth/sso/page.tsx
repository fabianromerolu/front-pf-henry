"use client";

import { useEffect, useRef } from "react";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authService.service";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/services/authService.service";

/** Evita SSG/ISR y cacheo para esta página puente */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "default-no-store";

/** Tipo mínimo que necesitamos del contexto */
type SetAuthFn = (user: AuthUser | null, token: string | null) => void;
type AuthCtxLike = { setAuth?: SetAuthFn } | null;

export default function SsoBridgePage() {
  // ✅ Llamamos SIEMPRE el hook (regla de hooks). Si el provider no está,
  // `useAuth()` puede devolver algo falsy; lo tratamos como nullable.
  const ctx = useAuth() as unknown as AuthCtxLike;
  const setAuth = ctx?.setAuth;

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      await saveTokenFromQueryAndHydrateAuth((user, token) => {
        if (typeof setAuth === "function") setAuth(user, token);
      });
    })();
  }, [setAuth]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm opacity-70">Procesando inicio de sesión…</p>
    </main>
  );
}
