"use client";
import { logout as apiLogout } from "@/services/authService.service";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LoginFormValues } from "@/validators/LoginSchema";
import type { RegisterFormValues } from "@/validators/RegisterSchema";
import {
  LoginUser,
  RegisterUser,
  saveTokenFromQueryAndHydrateAuth,
  getMe,
} from "@/services/authService.service";
import type { AuthUser, UserRole } from "@/services/authService.service";

/** Ayudante de tipado: asegura que la string sea un rol válido */
function asRole(v: string): UserRole | undefined {
  if (v === "admin" || v === "renter" || v === "user") return v;
  return undefined;
}

/** Normaliza valores del backend a minúsculas esperadas por la app-router */
function normalizeRole(v?: string | null): UserRole | undefined {
  if (!v) return undefined;
  const up = v.toUpperCase();
  if (up === "ADMIN") return "admin";
  if (up === "RENTER") return "renter";
  if (up === "USER") return "user";
  // por si ya viene en minúsculas
  const low = v.toLowerCase();
  return asRole(low);
}

/** Combina rol del user y del token: nunca degradar “renter” a “user”. */
function mergeRole({
  userRole,
  tokenIsAdmin,
}: {
  userRole?: string | null;
  tokenIsAdmin?: boolean;
}): UserRole | undefined {
  const ur = normalizeRole(userRole);
  if (tokenIsAdmin) return "admin"; // el token puede elevar a admin
  if (ur) return ur; // si user ya trae rol, respetar (incluye renter)
  return "user"; // fallback
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHydrated: boolean;
  isChecking: boolean;
  login: (values: LoginFormValues) => Promise<boolean>;
  register: (values: RegisterFormValues) => Promise<boolean>;
  logout: () => void;
  setAuth: (user: AuthUser | null, token: string | null) => void;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const USER_KEY = "auth:user";
const TOKEN_KEY = "auth:token";

// 👇 añadimos role al payload
type JwtPayload = {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  isAdmin?: boolean;
};

function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** 👇 Unificamos la lógica: cómo detectamos si un token “huele” a admin */
function tokenLooksAdmin(payload?: JwtPayload | null): boolean {
  if (!payload) return false;
  if (payload.isAdmin) return true;
  if (typeof payload.role === "string" && payload.role.toUpperCase() === "ADMIN") return true;
  return false;
}

function readStorage(): AuthState {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const userRaw = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    return { user: userRaw ? (JSON.parse(userRaw) as AuthUser) : null, token: token ?? null };
  } catch {
    return { user: null, token: null };
  }
}

function writeStorage(next: AuthState) {
  try {
    if (next.user) localStorage.setItem(USER_KEY, JSON.stringify(next.user));
    else localStorage.removeItem(USER_KEY);
    if (next.token) localStorage.setItem(TOKEN_KEY, next.token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/** 👉 Cookies para que el middleware pueda redirigir estrictamente */
function writeCookies(user: AuthUser | null, token: string | null) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 30; // 30 días
  const baseAttrs = `Path=/; Max-Age=${maxAge}; SameSite=Lax${
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : ""
  }`;

  // auth_token (señal de sesión p/ middleware)
  if (token) document.cookie = `auth_token=${encodeURIComponent(token)}; ${baseAttrs}`;
  else document.cookie = `auth_token=; Path=/; Max-Age=0; SameSite=Lax`;

  // Derivar rol sin degradar renter a user
  const payload = token ? (decodeJwt<JwtPayload>(token) ?? {}) : {};
  const role = mergeRole({ userRole: user?.role, tokenIsAdmin: tokenLooksAdmin(payload) });

  if (role) document.cookie = `role=${role}; ${baseAttrs}`;
  else document.cookie = `role=; Path=/; Max-Age=0; SameSite=Lax`;

  console.log("[AUTHCTX] writeCookies -> token?", !!token, "roleCookie:", role);
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const next = readStorage();
    setState(next);
    // sincroniza cookies al cargar (por si se recargó la pestaña)
    writeCookies(next.user, next.token);
    setIsHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY || e.key === TOKEN_KEY) {
        const synced = readStorage();
        setState(synced);
        writeCookies(synced.user, synced.token); // sincroniza cookies entre pestañas
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAuth = useCallback((user: AuthUser | null, token: string | null) => {
    const payload = token ? (decodeJwt<JwtPayload>(token) ?? {}) : {};
    const mergedRole = mergeRole({
      userRole: user?.role,
      tokenIsAdmin: tokenLooksAdmin(payload),
    });

    const normalizedUser = user
      ? { ...user, role: mergedRole ?? normalizeRole(user?.role) ?? "user" }
      : null;

    console.log("[AUTHCTX] setAuth()", {
      incomingUser: user,
      incomingUserRole: user?.role,
      tokenPresent: !!token,
      payload,
      mergedRole,
      finalUser: normalizedUser,
    });

    setState({ user: normalizedUser, token });
    writeStorage({ user: normalizedUser, token });
    writeCookies(normalizedUser, token);
  }, []);

  // ✅ Bootstrap de sesión
  useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;
    (async () => {
      setIsChecking(true);
      try {
        await saveTokenFromQueryAndHydrateAuth(setAuth, { redirect: false });

        const hasUser = Boolean(readStorage().user);
        const hasToken = Boolean(readStorage().token);
        if (!hasUser && !hasToken) {
          const me = await getMe();
          if (!cancelled && me) {
            me.role = normalizeRole(me.role) ?? "user";
            setAuth(me, null);
          }
        }
      } catch (err) {
        console.error("Auth bootstrap error:", err);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, setAuth]);

  // Extrae token y user sin usar any
  const extractTokenAndUser = (
    res: unknown
  ): { token: string | null; user: AuthUser | null } => {
    if (!res || typeof res !== "object") return { token: null, user: null };
    const anyRes = res as Record<string, unknown>;
    const token =
      (typeof anyRes.token === "string" ? anyRes.token : undefined) ??
      (typeof anyRes.accessToken === "string" ? anyRes.accessToken : undefined) ??
      (typeof anyRes.access_token === "string" ? anyRes.access_token : undefined) ??
      (typeof anyRes.jwt === "string" ? anyRes.jwt : undefined) ??
      (typeof anyRes.id_token === "string" ? anyRes.id_token : undefined) ??
      null;

    const rawUser = anyRes.user as unknown;
    let user: AuthUser | null =
      rawUser && typeof rawUser === "object" ? (rawUser as AuthUser) : null;

    const payload = token ? (decodeJwt<JwtPayload>(token) ?? {}) : {};

    // No degradar renter a user. Si el token trae admin, se eleva a admin.
    if (user) {
      user = {
        ...user,
        role:
          mergeRole({ userRole: user.role, tokenIsAdmin: tokenLooksAdmin(payload) }) ??
          normalizeRole(user.role) ??
          "user",
      };
    }

    return { token, user };
  };

  const login = useCallback(
    async (values: LoginFormValues) => {
      const res = await LoginUser(values);
      if (!res) return false;
      const { token, user } = extractTokenAndUser(res);
      setAuth(user, token);
      return Boolean(user || token);
    },
    [setAuth]
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      const res = await RegisterUser(values);
      if (!res) return false;
      const { token, user } = extractTokenAndUser(res);
      setAuth(user, token);
      return Boolean(user || token);
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout(); // invalida sesión en el API/Auth0
    } finally {
      setAuth(null, null); // limpia LS + cookies del front
    }
  }, [setAuth]);

  const authFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const headers = new Headers(init?.headers ?? {});
      const token =
        typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(input, { ...init, headers });
    },
    []
  );

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user || state.token),
      isAdmin: state.user?.role === "admin",
      isHydrated,
      isChecking,
      login,
      register,
      logout,
      setAuth,
      authFetch,
    }),
    [state, isHydrated, isChecking, login, register, logout, setAuth, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
