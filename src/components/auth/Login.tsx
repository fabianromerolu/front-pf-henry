// src/components/auth/Login.tsx
"use client";
import { useFormik } from "formik";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { LoginInitialValues, LoginValidationSchema } from "@/validators/LoginSchema";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { clearLastAuthError, getLastAuthError, loginWithAuth0 } from "@/services/authService.service";
import { toast } from "react-toastify";

/* ===== util: detectar rol desde token ===== */
function roleFromToken(t: string | null): "admin" | "renter" | "user" | null {
  if (!t) return null;
  try {
    const base = t.split(".")[1];
    if (!base) return null;
    const b64 = base.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    const json = decodeURIComponent(
      Array.prototype.map
        .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(json) as { role?: string; isAdmin?: boolean };
    const r = (payload.role ?? (payload.isAdmin ? "ADMIN" : "USER"))?.toString().toUpperCase();
    if (r === "ADMIN") return "admin";
    if (r === "RENTER") return "renter";
    return "user";
  } catch (e) {
    console.log("[LOGIN] decode token failed:", e);
    return null;
  }
}

/** CSS Vars tipadas (evita any) */
type CSSVars = CSSProperties & {
  "--bg-opacity"?: string;
  "--bg-blur"?: string;
  "--bg-tint"?: string;
};

export default function FormLogin() {
  const router = useRouter();
  const { login, isHydrated, isAuthenticated, user } = useAuth();
  const [alert, setAlert] = useState<null | { title: string; detail?: string; rid?: string }>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showPw, setShowPw] = useState(false);

  /* ===== UX post-register ===== */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("registered") === "1") {
      clearLastAuthError()
      toast.success("Cuenta creada. Inicia sesión para continuar.");
      url.searchParams.delete("registered");
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  useEffect(() => {
    console.log("[LOGIN] mount/hydration]:", { isHydrated, isAuthenticated });
  }, [isHydrated, isAuthenticated]);

  const formik = useFormik({
    initialValues: LoginInitialValues,
    validationSchema: LoginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const ok = await login(values);
        if (!ok) {
          const err = getLastAuthError();
          setAlert({
            title: err?.message || "No pudimos iniciar sesión.",
            detail: err ? `${err.ctx} • ${err.status} ${err.statusText}` : undefined,
            rid: err?.requestId ?? undefined,
          });
          return;
        }
        clearLastAuthError();
        // El redirect ya lo haces en el useEffect por isAuthenticated
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      const dest =
        user?.role === "admin" ? "/dashboard/admin" :
        user?.role === "renter" ? "/dashboard/renter" :
        "/dashboard";
      router.replace(dest);
    }
  }, [isHydrated, isAuthenticated, user?.role, router]);

  if (!mounted || !isHydrated) return null;

  /* ===== Variables del fondo (tipadas) ===== */
  const bgVars: CSSVars = {
    "--bg-opacity": "0.75",
    "--bg-blur": "3px",
    "--bg-tint": "0.60",
  };

  /* ===== estilos ===== */
  const inputBase =
    "w-full h-11 px-3 rounded-lg bg-white/10 border border-white/15 text-[var(--color-custume-light)] placeholder-white/60 outline-none focus:border-[var(--color-light-blue)]/60 focus:ring-2 focus:ring-[var(--color-light-blue)]/25 transition";
  const labelBase = "block text-sm font-medium text-[var(--color-custume-light)]";
  const errorText = "mt-1 text-[13px] text-red-300";
  const iconBtn =
    "absolute inset-y-0 right-3 my-auto inline-flex items-center text-white/80 hover:text-[var(--color-light-blue)]";

  const btnPrimary =
    "w-full h-11 rounded-lg font-semibold text-[var(--color-dark-blue)] bg-white hover:bg-[var(--color-light-blue)] " +
    "border border-white/30 shadow hover:shadow-lg active:scale-[0.99] transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-light-blue)]/60 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <main
      style={bgVars}
      className="
        relative
        min-h-screen w-full flex items-center justify-center
        px-4 sm:px-8 lg:px-16 py-10
        text-[var(--color-custume-light)]
      "
    >
      {/* Fondo: imagen + blur + opacidad + tinte */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[url('/login.jpg')] bg-cover bg-center will-change-transform"
          style={{
            opacity: "var(--bg-opacity)",
            filter: "blur(var(--bg-blur))",
            transform: "scale(1.06)",
          }}
        />
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
          "
          style={{ opacity: "var(--bg-tint)" }}
        />
      </div>
        {/* ===== ALERTA ===== */}
        {alert && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2 text-red-200"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-semibold text-sm">{alert.title}</p>
                {alert.detail && <p className="text-xs opacity-90 mt-0.5">{alert.detail}</p>}
                {alert.rid && (
                  <p className="text-[11px] opacity-70 mt-0.5">
                    id: <code className="opacity-90">{alert.rid}</code>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setAlert(null)}
                className="text-red-200/80 hover:text-red-100 text-sm"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* ===== /ALERTA ===== */}
      {/* Card */}
      <section className="w-full max-w-md">
        <div
          className="
            rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.35)]
            border border-white/10
            p-6 sm:p-8
            bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
          "
        >
          {/* Header */}
          <header className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30 text-xs hover:bg-white/5"
              aria-label="Volver"
              title="Volver"
            >
              <FiArrowLeft /> Volver
            </button>

            <div className="justify-self-center text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold">Iniciar sesión</h1>
              <p className="mt-1 text-sm text-white/80">Bienvenido de nuevo a Volantia</p>
            </div>

            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent opacity-0 pointer-events-none"
            >
              <FiArrowLeft /> Volver
            </button>
          </header>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelBase}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={(e) => formik.setFieldValue("email", e.target.value.trimStart())}
                onBlur={formik.handleBlur}
                placeholder="you@email.com"
                className={inputBase}
                aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && (
                <p className={errorText}>{formik.errors.email as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={labelBase}>Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={inputBase}
                  aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className={iconBtn}
                  aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                  title={showPw ? "Ocultar" : "Mostrar"}
                >
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className={errorText}>{formik.errors.password as string}</p>
              )}

              <div className="mt-2 text-right">
                <a
                  href="/forgot-password"
                  className="text-sm underline underline-offset-4 decoration-white/30 hover:decoration-white hover:text-[var(--color-light-blue)]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className={btnPrimary}
            >
              {formik.isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>

            <div className="relative my-3">
              <div className="h-px bg-white/10" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-transparent px-2 text-[11px] text-white/60">
                o
              </span>
            </div>

            <button
              type="button"
              onClick={loginWithAuth0}
              className="w-full h-11 rounded-lg bg-white text-[var(--color-dark-blue)] font-medium border border-white/20 hover:opacity-95 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-lg" />
              Continuar con Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/80">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="underline underline-offset-4 decoration-white/30 hover:decoration-white hover:text-[var(--color-light-blue)]"
            >
              Regístrate
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
