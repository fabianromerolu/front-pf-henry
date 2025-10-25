// src/components/auth/Register.tsx
"use client";
import { useFormik } from "formik";
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
import { loginWithAuth0 } from "@/services/authService.service";

/* ===== utils fuerza contraseña ===== */
function scorePassword(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^\w\s]/.test(pw)) s++;
  return Math.min(s, 5);
}
function strengthLabel(score: number): string {
  return ["Muy débil", "Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][score] ?? "";
}

/* Ampliamos localmente los valores para phone/role sin romper tu schema */
type ExtendedValues = RegisterFormValues & { phone?: string; role?: "USER" | "RENTER" };

export default function FormRegister() {
  const router = useRouter();
  const { isHydrated, register: registerAction } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const formik = useFormik<ExtendedValues>({
    initialValues: { ...RegisterInitialValues, phone: "", role: "USER" },
    validationSchema: RegisterValidationSchema as any,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const ok = await registerAction(values);
        const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth:token");
        if (ok && hasToken) router.push("/dashboard");
        else if (ok) router.push("/login?registered=1");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const pwScore = useMemo(() => scorePassword(formik.values.password), [formik.values.password]);
  const pwPercent = (pwScore / 5) * 100;
  const pwLabel = strengthLabel(pwScore);

  if (!mounted || !isHydrated) return null;

  /* ======== Variables para el fondo (ajusta aquí) ======== */
  const bgVars: CSSProperties = {
    ["--bg-opacity" as any]: "0.75",   // opacidad de la imagen (0–1)
    ["--bg-blur" as any]: "3px",       // blur de la imagen (ej: 0px, 3px, 8px)
    ["--bg-tint" as any]: "0.60",      // opacidad del tinte/gradiente
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
  const step3Fields: (keyof ExtendedValues)[] = ["password", "confirmPassword"];

  const nextFrom = async (fields: (keyof ExtendedValues)[], toStep: 2 | 3) => {
    const errors = await formik.validateForm();
    formik.setTouched(fields.reduce((acc, k) => ({ ...acc, [k]: true }), {} as any), true);
    const hasErrors = fields.some((k) => (errors as any)[k]);
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
          <li>Usuario: minúsculas/números/_ (sin "__", ni empezar/terminar en _).</li>
          <li>Usa un email válido; ahí llegan confirmaciones.</li>
          <li>Nombre: solo letras y espacios (p. ej., “Ana María”).</li>
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
        <li>Mín. 8 caracteres; mayúscula, minúscula, número y símbolo.</li>
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
        {/* Imagen */}
        <div
          className="absolute inset-0 bg-[url('/register.jpg')] bg-cover bg-center will-change-transform"
          style={{
            opacity: "var(--bg-opacity)",
            filter: "blur(var(--bg-blur))",
            transform: "scale(1.06)", // evita bordes al aplicar blur
          }}
        />
        {/* Tinte/gradiente de marca encima de la imagen */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
          "
          style={{ opacity: "var(--bg-tint)" }}
        />
      </div>

      {/* Grid principal: form + aside. Form pegado al aside para que quede centrado visualmente */}
      <section className="w-full max-w-6xl mx-auto grid md:grid-cols-[minmax(0,1fr)_320px] items-start gap-3 md:gap-4">
        {/* ===== Columna FORM (más cerca del aside) ===== */}
        <div className="max-w-md w-full mx-auto md:mx-0 md:justify-self-end">
          <div
            className="
              rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.35)]
              border border-white/10
              p-6 sm:p-8
              bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]
            "
          >
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
                        <input id="name" name="name" type="text" autoComplete="name"
                          value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          placeholder="John Doe" className={inputBase} />
                        {formik.touched.name && formik.errors.name && (
                          <p className={errorText}>{formik.errors.name as any}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="username" className={labelBase}>Usuario</label>
                        <input id="username" name="username" type="text" autoComplete="username"
                          value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          placeholder="johndoe" className={inputBase} />
                        {formik.touched.username && formik.errors.username && (
                          <p className={errorText}>{formik.errors.username as any}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className={labelBase}>Email</label>
                      <input id="email" name="email" type="email" autoComplete="email"
                        value={formik.values.email}
                        onChange={(e) => formik.setFieldValue("email", e.target.value.trimStart())}
                        onBlur={formik.handleBlur} placeholder="john@volantia.com" className={inputBase} />
                      {formik.touched.email && formik.errors.email && (
                        <p className={errorText}>{formik.errors.email as any}</p>
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className={labelBase}>Teléfono (opcional)</label>
                        <input id="phone" name="phone" type="tel" autoComplete="tel"
                          value={formik.values.phone ?? ""} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          placeholder="+573001112233" className={inputBase} />
                        {formik.touched.phone && (formik.errors as any)?.phone && (
                          <p className={errorText}>{(formik.errors as any).phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="role" className={labelBase}>Tipo de cuenta</label>
                        <select id="role" name="role" value={formik.values.role ?? "USER"}
                          onChange={formik.handleChange} onBlur={formik.handleBlur}
                          className={`${inputBase} pr-10 appearance-none`}>
                          <option value="USER">Usuario</option>
                          <option value="RENTER">Arrendador (RENTER)</option>
                        </select>
                        {formik.touched.role && (formik.errors as any)?.role && (
                          <p className={errorText}>{(formik.errors as any).role}</p>
                        )}
                      </div>
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
                        <input id="password" name="password" type={showPw ? "text" : "password"} autoComplete="new-password"
                          value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          placeholder="••••••••" className={inputBase} />
                        <button type="button" onClick={() => setShowPw((v) => !v)} className={iconBtn}
                          aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"} title={showPw ? "Ocultar" : "Mostrar"}>
                          {showPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className={errorText}>{formik.errors.password as any}</p>
                      )}

                      <div className="mt-2">
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-2 rounded-full bg-[var(--color-light-blue)] transition-all" style={{ width: `${pwPercent}%` }} />
                        </div>
                        <div className="mt-1 text-xs text-white/80 flex items-center justify-between">
                          <span>Fuerza: {pwLabel}</span>
                          <span className="opacity-70">Mín. 8, mayúscula, minúscula, número y símbolo</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className={labelBase}>Confirmar contraseña</label>
                      <div className="relative">
                        <input id="confirmPassword" name="confirmPassword" type={showPw2 ? "text" : "password"} autoComplete="new-password"
                          value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                          placeholder="••••••••" className={inputBase} />
                        <button type="button" onClick={() => setShowPw2((v) => !v)} className={iconBtn}
                          aria-label={showPw2 ? "Ocultar confirmación" : "Mostrar confirmación"} title={showPw2 ? "Ocultar" : "Mostrar"}>
                          {showPw2 ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className={errorText}>{formik.errors.confirmPassword as any}</p>
                      )}
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

        {/* ===== Columna ASIDE (sólida para legibilidad) ===== */}
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
