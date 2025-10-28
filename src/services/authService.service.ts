// src/services/authService.service.ts
import { toast } from "react-toastify";
import { API_BASE } from "./api.service";

export type UserRole = "admin" | "renter" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

export interface LoginResponse {
  token?: string;
  user?: AuthUser;
  message?: string;
  [k: string]: unknown;
}

export type RegisterResponse = LoginResponse;

/* ================= helpers ================= */
interface JWTPayload {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  isAdmin?: boolean;
  [k: string]: unknown;
}

type APIUser = {
  id?: string;
  sub?: string; // por si /auth/me/jwt devuelve sub en vez de id
  name?: string | null;
  username?: string | null;
  email: string;
  role?: string | null; // "ADMIN" | "RENTER" | "USER"
  isAdmin?: boolean;
};

function messageFrom(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const v = (data as Record<string, unknown>)["message"];
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

function errorMessage(err: unknown, fallback = "Error"): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const m = (err as Record<string, unknown>)["message"];
    if (typeof m === "string") return m;
  }
  return fallback;
}

function decodeJwtPayload(token: string): JWTPayload | null {
  try {
    const base = token.split(".")[1];
    if (!base) return null;
    const b64 = base.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as JWTPayload;
  } catch {
    return null;
  }
}

function mapRole(input?: string | null, isAdmin?: boolean): UserRole {
  const r = (input ?? (isAdmin ? "ADMIN" : "USER")).toString().toUpperCase();
  if (r === "ADMIN") return "admin";
  if (r === "RENTER") return "renter";
  return "user";
}

function roleFromToken(t: string | null): UserRole | null {
  if (!t) return null;
  const p = decodeJwtPayload(t);
  if (!p) return null;
  return mapRole(p.role, p.isAdmin);
}

function normalizeApiUser(u?: APIUser | null): AuthUser | null {
  if (!u) return null;
  const id = (u.id ?? u.sub)?.toString();
  if (!id) return null;
  const name = (u.name ?? u.username ?? u.email ?? "").toString();
  const email = (u.email ?? "").toString();
  const role = mapRole(u.role, u.isAdmin);
  return { id, name, email, role };
}

// helper: guarda cookies legibles por el front (adicional a las httpOnly del back)
function setAuthCookies(token: string | null, role: UserRole | undefined) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 7; // 7 días
  if (token) {
    document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }
  if (role) {
    document.cookie = `role=${role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }
  console.log("[SVC] setAuthCookies -> token?", !!token, "roleCookie:", role);
}

// lee token en varias claves posibles
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("auth:token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    null
  );
}

function pickToken(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const rec = data as Record<string, unknown>;
  const t = rec["accessToken"] ?? rec["token"];
  return typeof t === "string" ? t : undefined;
}

async function safeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function destByRole(role?: UserRole | null): string {
  return role === "admin"
    ? "/dashboard/admin"
    : role === "renter"
    ? "/dashboard/renter"
    : "/dashboard";
}

/* ============== resolutores de usuario ============== */
// 1) /auth/me/jwt (con Bearer); 2) /auth/me (cookie OIDC); 3) /users/:id (si sub en JWT)
export async function resolveUserFromToken(accessToken: string): Promise<AuthUser | null> {
  try {
    // 1) JWT-normalizado (local o Auth0) via AnyJwtGuard
    const meJwtRes = await fetch(`${API_BASE}/auth/me/jwt`, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meJwt = await safeJson<{ user?: APIUser | null }>(meJwtRes);
    if (meJwtRes.ok && meJwt?.user) {
      const user = normalizeApiUser(meJwt.user);
      if (user) return user;
    }

    // 2) Sesión OIDC (cookie httpOnly puesta por el back tras SSO)
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    const me = await safeJson<{ user?: APIUser | null }>(meRes);
    if (meRes.ok && me?.user) {
      const user = normalizeApiUser(me.user);
      if (user) return user;
    }

    // 3) Fallback: /users/:id si el JWT trae sub=UUID
    const payload = decodeJwtPayload(accessToken);
    const id = payload?.sub;
    if (!id) return null;

    const res = await fetch(`${API_BASE}/users/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as APIUser;
    return normalizeApiUser({ ...raw, id: raw.id ?? id });
  } catch {
    return null;
  }
}

/* ============== Auth local ============== */
export async function RegisterUser(userData: {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  profilePicture?: string;
  biography?: string;
  isAdmin?: boolean;
}): Promise<RegisterResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await safeJson<LoginResponse>(res);
    if (!res.ok) {
      toast.error(messageFrom(data) ?? res.statusText ?? "Registration failed");
      return null;
    }
    const accessToken = pickToken(data);
    const user = accessToken ? await resolveUserFromToken(accessToken) : data?.user ?? null;

    if (accessToken) localStorage.setItem("auth:token", accessToken);
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    setAuthCookies(accessToken ?? null, user?.role);

    toast.success("User registered successfully!");
    return { token: accessToken, user: user ?? undefined };
  } catch (err: unknown) {
    toast.error(errorMessage(err, "Registration error"));
    return null;
  }
}

export async function LoginUser(userData: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
    credentials: "include",
  });
  console.log("[SVC] /auth/login status:", res.status, "ok?", res.ok);
  const data = await safeJson<LoginResponse>(res);
  if (!res.ok) {
    toast.error(messageFrom(data) ?? res.statusText ?? "Login failed");
    return null;
  }
  const accessToken = pickToken(data);
  console.log("[SVC] picked token?", !!accessToken);

  let user: AuthUser | null = null;
  if (accessToken) {
    const apiUser = await resolveUserFromToken(accessToken);
    const tokenRole = roleFromToken(accessToken);
    const role = tokenRole ?? apiUser?.role ?? "user";

    user = apiUser
      ? { ...apiUser, role }
      : (() => {
          const p = decodeJwtPayload(accessToken);
          if (p?.sub && p?.email) {
            return {
              id: p.sub,
              name: (p.name ?? p.email).toString(),
              email: p.email.toString(),
              role,
            } as AuthUser;
          }
          return null;
        })();

    if (accessToken) localStorage.setItem("auth:token", accessToken);
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    setAuthCookies(accessToken ?? null, user?.role);
  }
  toast.success("User logged successfully!");
  return { token: accessToken, user: user ?? undefined } as LoginResponse;
}

export async function logout() {
  try {
    localStorage.removeItem("auth:token");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth:user");
    document.cookie = `auth_token=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `role=; Path=/; Max-Age=0; SameSite=Lax`;
  } finally {
    const returnTo = "/"; // raíz
    window.location.href = `${API_BASE}/auth/logout?returnTo=${encodeURIComponent(returnTo)}`;
  }
}

/* ============= Auth0 (Universal Login) ============= */
export function loginWithAuth0(): void {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  // tras el login vamos a /auth/sso para recoger ?token o tirar de cookies
  const returnTo = "/auth/sso";
  window.location.href = `${apiBase}/login?returnTo=${encodeURIComponent(returnTo)}`;
}


/* ============= Guardar token desde ?token=... ============= */
export async function saveTokenFromQueryAndHydrateAuth(
  setAuth: (user: AuthUser | null, token: string | null) => void
): Promise<void> {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  // Caso moderno: NO llega ?token=, dependemos de cookie httpOnly del back
  if (!token) {
    const me = await getMe();
    if (me) {
      // 🔹 Marca sesión en el DOMINIO DEL FRONT para que el middleware no te bote
      // Cookie corta (15min) alineada al volantia_token del back
      document.cookie = `auth_token=1; Path=/; Max-Age=${60 * 15}; SameSite=Lax`;
      // Cookie de rol para rutas de admin/renter si tu middleware la quisiera usar
      document.cookie = `role=${me.role ?? "user"}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      setAuth(me, null);
      window.location.replace(destByRole(me.role));
      return;
    }
    // Si no hay me(), te quedas en la página; el login local seguirá funcionando.
    return;
  }

  // Compat: viene ?token= en la URL
  const user = await resolveUserFromToken(token);

  localStorage.setItem("auth:token", token);
  if (user) localStorage.setItem("auth:user", JSON.stringify(user));
  setAuthCookies(token, user?.role);
  setAuth(user ?? null, token);

  // Limpia el query param
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url.toString());

  // Redirige por rol
  window.location.replace(destByRole(user?.role));
}


/* ============= getMe() (hook useUser) ============= */
export async function getMe(): Promise<AuthUser | null> {
  try {
    const token = getStoredToken();

    // 1) Prioriza /auth/me/jwt (funciona con Bearer y/o cookie httpOnly)
    const meJwtRes = await fetch(`${API_BASE}/auth/me/jwt`, {
      method: "GET",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const meJwt = await safeJson<{ user?: APIUser | null }>(meJwtRes);
    if (meJwtRes.ok && meJwt?.user) {
      const user = normalizeApiUser(meJwt.user);
      if (user) return user;
    }

    // 2) Luego /auth/me (sesión OIDC pura)
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    const me = await safeJson<{ user?: APIUser | null }>(meRes);
    if (meRes.ok && me?.user) {
      const user = normalizeApiUser(me.user);
      if (user) return user;
    }

    // 3) Si hay token guardado, intenta el resolutor largo
    if (token) return await resolveUserFromToken(token);

    console.log("[SVC] GET /auth/me[jwt] no user; sin token local");
    return null;
  } catch {
    return null;
  }
}
