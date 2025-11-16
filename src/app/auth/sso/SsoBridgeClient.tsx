//src/app/auth/sso/SsoBridgeClient.tsx
"use client";

import { useEffect, useRef } from "react";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authService.service";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/services/authService.service";

type SetAuthFn = (user: AuthUser | null, token: string | null) => void;
type AuthCtxLike = { setAuth?: SetAuthFn } | null;

export default function SsoBridgeClient() {
  // ✅ Hook siempre al tope (sin condicionales)
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
