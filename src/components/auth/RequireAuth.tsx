//src/components/auth/RequireAuth.tsx
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/services/authService.service";
import Link from "next/link";

type Role = UserRole | undefined;

function safeDecodeIsAdmin(token: string | null): boolean {
  try {
    if (!token) return false;
    const [, base] = token.split(".");
    if (!base) return false;
    const b64 = base.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    const json = JSON.parse(
      decodeURIComponent(
        Array.prototype.map
          .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    ) as { role?: string; isAdmin?: boolean };

    if (json.isAdmin) return true;
    if (typeof json.role === "string" && json.role.toUpperCase() === "ADMIN") return true;
    return false;
  } catch {
    return false;
  }
}

export default function RequireAuth({
  children,
  role,
  fallback = null,
}: {
  children: ReactNode;
  role?: UserRole;
  fallback?: ReactNode;
}) {
  const { isHydrated, user, token } = useAuth();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const effectiveRole: Role = useMemo(() => {
    if (user?.role) return user.role;
    if (token) return safeDecodeIsAdmin(token) ? "admin" : "user";
    return undefined;
  }, [user?.role, token]);

  useEffect(() => {
    console.log("[RequireAuth]", {
      isHydrated,
      hasUser: !!user,
      ctxRole: user?.role,
      hasToken: !!token,
      tokenIsAdmin: safeDecodeIsAdmin(token ?? null),
      expected: role,
    });

    if (!isHydrated) {
      setReady(false);
      return;
    }

    if (!user && !token) {
      setAllowed(false);
      setReady(true);
      return;
    }

    if (role === "admin" && effectiveRole !== "admin") {
      setAllowed(false);
      setReady(true);
      return;
    }

    setAllowed(true);
    setReady(true);
  }, [isHydrated, user, token, role, effectiveRole]);

  if (!ready) return <>{fallback}</>;
  if (!allowed) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-b text-custume-light">
        <section className="max-w-md w-full px-8 py-10 rounded-3xl bg-dark-blue/120 border border-light-blue/50 shadow-xl shadow-black/40 text-center space-y-6 animate-fade-slide">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-light-blue/20 text-light-blue">
            {/* icono candado */}
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path
                d="M17 11V8a5 5 0 0 0-10 0v3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                ry="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="15.5" r="1" fill="currentColor" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="montserrat text-2xl font-semibold tracking-tight text-light-blue">
              Acceso no autorizado
            </h1>
            <p className="hind text-sm text-custume-light/80">
              No tienes permisos suficientes para ver esta sección.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="hind inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-custume-red text-custume-light hover:bg-custume-red/90 transition"
            >
              Volver atrás
            </button>

            <Link
              href="/"
              className="hind inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border border-light-blue/70 text-light-blue hover:bg-light-blue/10 transition"
            >
              Ir al inicio
            </Link>
          </div>

          <p className="taviraj text-[11px] tracking-wide text-custume-gray">
            Error 401 · Unauthorized
          </p>
        </section>
      </main>
    );
  }
  return <>{children}</>;
}
