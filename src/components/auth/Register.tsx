// src/components/auth/Register.tsx
"use client";
import { useFormik, type FormikTouched } from "formik";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, type CSSProperties } from "react";
import {
  RegisterFormValues,
  RegisterInitialValues,
  RegisterValidationSchema,
} from "@/validators/RegisterSchema";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { clearLastAuthError, getLastAuthError, loginWithAuth0 } from "@/services/authService.service";
import { meApi } from "@/services/userRenter.service";

// ===== utils fuerza contraseña =====
// 🔧 Alineado con PASS_RX del schema: minúscula, mayúscula, dígito, símbolo (!@#$%^&*)
function scorePassword(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[!@#$%^&*]/.test(pw)) s++; // 🔧 símbolo del set permitido
  return Math.min(s, 5);
}
function strengthLabel(score: number): string {
  return ["Muy débil", "Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][score] ?? "";
}

/* Ampliamos localmente los valores para phone/role sin romper tu schema */
type ExtendedValues = RegisterFormValues & { phone?: string; role?: "USER" | "RENTER" };

/** CSS Vars tipadas (evita any) */
type CSSVars = CSSProperties & {
  "--bg-opacity"?: string;
  "--bg-blur"?: string;
  "--bg-tint"?: string;
};

export default function FormRegister() {
  const router = useRouter();
  const { isHydrated, register: registerAction } = useAuth();
  const [alert, setAlert] = useState<null | { title: string; detail?: string; rid?: string }>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const formik = useFormik<ExtendedValues>({
    initialValues: { ...RegisterInitialValues, phone: "", role: "USER" },
    validationSchema: RegisterValidationSchema as unknown as import("yup").AnyObjectSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const ok = await registerAction(values);

        if (!ok) {
          const err = getLastAuthError();
          setAlert({
            title: err?.message || "No se pudo crear la cuenta.",
            detail: err ? `${err.ctx} • ${err.status} ${err.statusText}` : undefined,
            rid: err?.requestId ?? undefined,
          });
          return;
        }

        clearLastAuthError();

        const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth:token");
        if (hasToken) {
          try {
            const me = await meApi.getMe();
            const role = me.role ?? "USER";
            if (role === "ADMIN") router.push("/dashboard/admin");
            else if (role === "RENTER") router.push("/dashboard/renter");
            else router.push("/dashboard/user");
          } catch {
            const fallback = values.role === "RENTER" ? "/dashboard/renter" : "/dashboard/user";
            router.push(fallback);
          }
        } else {
          router.push("/login?registered=1");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* Helpers tipados para errores/touched */
  const getErr = <K extends keyof ExtendedValues>(k: K): string | undefined => {
    const e = formik.errors[k];
    return typeof e === "string" ? e : undefined;
  };
  const isTouched = <K extends keyof ExtendedValues>(k: K): boolean => {
    const t = formik.touched[k];
    return typeof t === "boolean" ? t : false;
  };

  // 🔧 Derivados para checklist de password
  const pw = formik.values.password || "";
  const pwChecks = {
    len8: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    sym: /[!@#$%^&*]/.test(pw), // 🔧 mismo set
    noSpaces: /^\S+$/.test(pw) || pw.length === 0,
  };

  const pwScore = useMemo(() => scorePassword(pw), [pw]);
  const pwPercent = (pwScore / 5) * 100;
  const pwLabel = strengthLabel(pwScore);

  if (!mounted || !isHydrated) return null;

  /* ======== Variables para el fondo (tipadas) ======== */
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
    "h-11 rounded-lg font-semibold text-[var(--color-dark-blue)] bg-white hover:bg-[var(--color-light-blue)] " +
    "border border-white/30 shadow hover:shadow-lg active:scale-[0.99] transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-light-blue)]/60 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const btnSecondary =
    "h-11 rounded-lg font-medium border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/60 " +
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-light-blue)]/40";

  /* ===== validación por paso ===== */
  const step1Fields: (keyof ExtendedValues)[] = ["name", "username", "email"];
  const step2Fields: (keyof ExtendedValues)[] = ["phone", "role"];

  const nextFrom = async (fields: (keyof ExtendedValues)[], toStep: 2 | 3) => {
    const errors = await formik.validateForm();
    const touchedObj = fields.reduce<Partial<Record<keyof ExtendedValues, boolean>>>((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    formik.setTouched(touchedObj as FormikTouched<ExtendedValues>, true);

    const hasErrors = fields.some((k) => Boolean((errors as Partial<Record<keyof ExtendedValues, unknown>>)[k]));
    if (!hasErrors) setStep(toStep);
  };

  const onBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
    else router.back();
  };

  const StepTips = () => {
    if (step === 1) {
      return (
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Usuario: minúsculas/números/<code>_</code> (sin <code>__</code>, ni empezar/terminar en <code>_</code>).
          </li>
          <li>Usa un email válido; ahí llegan confirmaciones.</li>
          <li>Nombre: solo letras y espacios (p. ej., &laquo;Ana Mar&iacute;a&raquo;).</li>
        </ul>
      );
    }
    if (step === 2) {
      return (
        <ul className="list-disc pl-4 space-y-1">
          <li>Teléfono opcional; formato internacional (+57…), se aceptan guiones/paréntesis.</li>
          <li><b>ADMIN</b> se asigna automáticamente si el dominio del correo está autorizado.</li>
          <li>Elige <b>Usuario</b> o <b>Arrendador (RENTER)</b>.</li>
        </ul>
      );
    }
    return (
      <ul className="list-disc pl-4 space-y-1">
        {/* 🔧 texto alineado con el backend */}
        <li>Mín. 8 caracteres; mayúscula, minúscula, número y símbolo (!@#$%^&*).</li>
        <li>No uses tu nombre/usuario/prefijo de email.</li>
        <li>Frase secreta memorable &gt; password random olvidable.</li>
      </ul>
    );
  };

  return (
    <main
      style={bgVars}
      className="
        relative
        min-h-screen w-full
        px-4 sm:px-6 lg:px-8 py-10
        text-[var(--color-custume-light)]
        flex items-center
      "
    >
      {/* === Capa de fondo con imagen + blur + opacidad variables === */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[url('/register.jpg')] bg-cover bg-center will-change-transform"
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

      {/* Grid principal: form + aside */}
      <section className="w-full max-w-6xl mx-auto grid md:grid-cols-[minmax(0,1fr)_320px] items-start gap-3 md:gap-4">
        {/* ===== Columna FORM ===== */}
        <div className="max-w-md w-full mx-auto md:mx-0 md:justify-self-end">
          <div
            className="
              rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.35)]
              border border-white/10
              p-6 sm:p-8
              bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
            "
          >

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

            {/* Header: volver + título + pasos */}
            <header className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                           border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/60
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-light-blue)]/40 transition"
                aria-label="Volver"
                title="Volver"
              >
                <FiArrowLeft /> Volver
              </button>

              <div className="justify-self-center text-center">
                <h1 className="text-2xl sm:text-3xl font-semibold">Crear cuenta</h1>
                <p className="mt-1 text-sm text-white/80">Únete a Volantia</p>
              </div>

              <div className="justify-self-end flex items-center gap-2 text-xs text-white/80">
                <span>Paso</span>
                <span className="inline-flex items-center gap-1">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`h-2 w-2 rounded-full ${step >= n ? "bg-[var(--color-light-blue)]" : "bg-white/25"}`}
                    />
                  ))}
                </span>
                <span className="font-semibold">{step}/3</span>
              </div>
            </header>

            {/* ===== FORM ===== */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div key={`step-${step}`}>
                {/* PASO 1 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className={labelBase}>Nombre completo</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="John Doe"
                          className={inputBase}
                        />
                        {isTouched("name") && getErr("name") && (
                          <p className={errorText}>{getErr("name")}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="username" className={labelBase}>Usuario</label>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="johndoe"
                          className={inputBase}
                        />
                        {isTouched("username") && getErr("username") && (
                          <p className={errorText}>{getErr("username")}</p>
                        )}
                      </div>
                    </div>

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
                        placeholder="john@volantia.com"
                        className={inputBase}
                      />
                      {isTouched("email") && getErr("email") && (
                        <p className={errorText}>{getErr("email")}</p>
                      )}
                    </div>

                    <div className="pt-1">
                      <button type="button" onClick={() => nextFrom(step1Fields, 2)} className={`w-full ${btnPrimary}`}>
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 2 */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="phone" className={labelBase}>Teléfono (opcional)</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formik.values.phone ?? ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="+573001112233"
                        className={inputBase}
                      />
                      {isTouched("phone") && getErr("phone") && (
                        <p className={errorText}>{getErr("phone")}</p>
                      )}
                    </div>

                    <div>
                      <span id="role-label" className={labelBase}>Tipo de cuenta</span>

                      <fieldset aria-labelledby="role-label" className="mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {([
                            {
                              value: "USER" as const,
                              title: "Quiero rentar un auto",
                              hint: "Busca y reserva vehículos",
                            },
                            {
                              value: "RENTER" as const,
                              title: "Quiero rentar mi auto",
                              hint: "Publica y gestiona tus vehículos",
                            },
                          ]).map((opt) => {
                            const selected = (formik.values.role ?? "USER") === opt.value;

                            return (
                              <label
                                key={opt.value}
                                className={[
                                  "cursor-pointer select-none rounded-xl border p-3 transition",
                                  "flex items-start gap-3",
                                  selected
                                    ? "bg-[var(--color-light-blue)]/90 border-[var(--color-light-blue)] shadow"
                                    : "bg-white/90 border-[var(--color-custume-light)] hover:bg-white",
                                ].join(" ")}
                              >
                                <input
                                  type="radio"
                                  name="role"
                                  value={opt.value}
                                  checked={selected}
                                  onChange={() => formik.setFieldValue("role", opt.value)}
                                  onBlur={formik.handleBlur}
                                  className="sr-only"
                                />

                                <span
                                  aria-hidden
                                  className={[
                                    "mt-1 inline-block h-3 w-3 rounded-full border",
                                    selected
                                      ? "bg-[var(--color-custume-blue)] border-[var(--color-custume-blue)]"
                                      : "bg-transparent border-[var(--color-custume-gray)]",
                                  ].join(" ")}
                                />

                                <span className="flex flex-col">
                                  <span
                                    className={[
                                      "taviraj text-sm font-semibold",
                                      selected
                                        ? "text-[var(--color-custume-blue)]"
                                        : "text-[var(--color-dark-blue)]",
                                    ].join(" ")}
                                  >
                                    {opt.title}
                                  </span>
                                  <span
                                    className={[
                                      "text-xs",
                                      selected
                                        ? "text-[var(--color-custume-blue)]/80"
                                        : "text-[var(--color-custume-gray)]",
                                    ].join(" ")}
                                  >
                                    {opt.hint}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      {isTouched("role") && getErr("role") && (
                        <p className={errorText}>{getErr("role")}</p>
                      )}
                    </div>

                    <p className="text-xs text-white/80">
                      * <b>ADMIN</b> se asigna automáticamente si el dominio del correo está autorizado.
                    </p>

                    <div className="pt-1 flex gap-3">
                      <button type="button" onClick={() => setStep(1)} className={`flex-1 ${btnSecondary}`}>
                        Anterior
                      </button>
                      <button type="button" onClick={() => nextFrom(step2Fields, 3)} className={`flex-1 ${btnPrimary}`}>
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* PASO 3 */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="password" className={labelBase}>Contraseña</label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPw ? "text" : "password"}
                          autoComplete="new-password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="••••••••"
                          className={inputBase}
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
                      {isTouched("password") && getErr("password") && (
                        <p className={errorText}>{getErr("password")}</p>
                      )}

                      {/* 🔧 Barra de fuerza + checklist alineado al backend */}
                      <div className="mt-2">
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-[var(--color-light-blue)] transition-all"
                            style={{ width: `${pwPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className={labelBase}>Confirmar contraseña</label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPw2 ? "text" : "password"}
                          autoComplete="new-password"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="••••••••"
                          className={inputBase}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw2((v) => !v)}
                          className={iconBtn}
                          aria-label={showPw2 ? "Ocultar confirmación" : "Mostrar confirmación"}
                          title={showPw2 ? "Ocultar" : "Mostrar"}
                        >
                          {showPw2 ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {isTouched("confirmPassword") && getErr("confirmPassword") && (
                        <p className={errorText}>{getErr("confirmPassword")}</p>
                      )}

                      {/* 🔧 checklist breve para confirm (coincidencia + mismo set) */}
                      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-white/80">
                        <li className={(formik.values.confirmPassword === formik.values.password && formik.values.password.length > 0) ? "opacity-100" : "opacity-60"}>
                          <span className="mr-1">
                            {(formik.values.confirmPassword === formik.values.password && formik.values.password.length > 0) ? "✓" : "•"}
                          </span>
                          Coincide con la contraseña
                        </li>
                        <li className={/[!@#$%^&*]/.test(formik.values.confirmPassword || "") ? "opacity-100" : "opacity-60"}>
                          <span className="mr-1">{/[!@#$%^&*]/.test(formik.values.confirmPassword || "") ? "✓" : "•"}</span>
                          Incluye símbolo (!@#$%^&*)
                        </li>
                      </ul>
                    </div>

                    <div className="pt-1 flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className={`flex-1 ${btnSecondary}`}>
                        Anterior
                      </button>
                      <button type="submit" disabled={!formik.isValid || formik.isSubmitting} className={`flex-1 ${btnPrimary}`}>
                        {formik.isSubmitting ? "Creando..." : "Crear cuenta"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ===== Columna ASIDE ===== */}
        <aside className="space-y-4">
          <div
            className="
              rounded-2xl border border-white/10 p-4 shadow
              bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
            "
          >
            <h3 className="text-xs font-semibold mb-3 text-white/90">Acceso rápido</h3>
            <button
              type="button"
              onClick={loginWithAuth0}
              className="w-full h-10 rounded-lg bg-white text-[var(--color-dark-blue)] font-medium text-[13px]
                         border border-white/20 hover:opacity-95 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-lg" />
              Continuar con Google
            </button>
            <p className="mt-3 text-[12px] text-white/80">
              ¿Ya tienes cuenta?{" "}
              <a href="/login" className="underline underline-offset-4 decoration-white/30 hover:decoration-white hover:text-[var(--color-light-blue)]">
                Inicia sesión
              </a>
            </p>
          </div>

          <div
            className="
              rounded-2xl border border-white/10 p-4 shadow text-[12px] text-white/90
              bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
            "
          >
            <p className="mb-1 font-medium text-white">Consejos para este paso</p>
            <StepTips />
          </div>
        </aside>
      </section>
    </main>
  );
}
