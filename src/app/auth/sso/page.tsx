"use client";
import { useEffect, useRef } from "react";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authService.service";
import { useAuth } from "@/context/AuthContext";

export default function SsoBridgePage() {
  const { setAuth } = useAuth() as any;
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
