"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Role = "admin" | "user" | undefined;

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
    );
    return !!json?.isAdmin;
  } catch {
    return false;
  }
}

export default function RequireAuth({
  children,
  role,               // "admin" | "user" | undefined
  fallback = null,    // lo que muestras mientras decide
}: {
  children: ReactNode;
  role?: Role;
  fallback?: ReactNode;
}) {
  const { isHydrated, user, token } = useAuth();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  // Rol efectivo: primero el del user del contexto, si no hay, el del token (isAdmin)
  const effectiveRole: Role = useMemo(() => {
    if (user?.role) return user.role;
    if (token) return safeDecodeIsAdmin(token) ? "admin" : "user";
    return undefined;
  }, [user?.role, token]);

  useEffect(() => {
    // Logs de diagnóstico
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

    // Si no exige admin, o el rol es admin, permitir
    setAllowed(true);
    setReady(true);
  }, [isHydrated, user, token, role, effectiveRole]);

  if (!ready) return <>{fallback}</>;
  if (!allowed) {
    return (
      <main className="min-h-dvh grid place-items-center text-white">
        Unauthorized
      </main>
    );
  }
  return <>{children}</>;
}
