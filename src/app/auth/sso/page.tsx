"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveTokenFromQueryAndHydrateAuth } from "@/services/authService.service";
import { useAuth } from "@/context/AuthContext";

export default function SsoBridgePage() {
  const router = useRouter();
  const { setAuth } = useAuth() as any;

  useEffect(() => {
    (async () => {
      // Guardará el token si viene por query y resolverá el usuario
      await saveTokenFromQueryAndHydrateAuth((user, token) => {
        // tu AuthContext debería exponer algo como setAuth(user, token)
        if (typeof setAuth === "function") setAuth(user, token);
      });
      // Si no vino token y no hay cookies cross-site, saveTokenFromQuery no hará nada;
      // en ese caso dependerás de CROSS_SITE_COOKIES=1 para que /auth/me funcione.
    })();
  }, [router, setAuth]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm opacity-70">Procesando inicio de sesión…</p>
    </main>
  );
}
