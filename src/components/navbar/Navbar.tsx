// src/components/navbar/Navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/services/authService.service";

const VehicleIcon = "/icons/vehicles.svg";
const OfferIcon = "/icons/offer.svg";
const ContactIcon = "/icons/contact.svg";
const ProfileIcon = "/icons/profile.svg";

const HIDDEN_ROUTES = new Set<string>(["/", "/login", "/register"]);

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isChecking, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false); // para usar portal

  // Marca como montado (solo cliente)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cierra el menú al cambiar de ruta
  useEffect(() => setOpen(false), [pathname]);

  // Esc para cerrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sombra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea scroll del body cuando el menú está abierto
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const body = document.body;

    if (open) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [open]);

  const baseLinks = useMemo(
    () => [
      { name: "Vehículos", href: "/vehicles", icon: VehicleIcon },
      { name: "Ofertas", href: "/offer", icon: OfferIcon },
      { name: "Contacto", href: "/contact", icon: ContactIcon },
    ],
    []
  );

  const dashboardHref = useMemo(() => {
    const role = (user?.role ?? "user") as UserRole;
    if (role === "admin") return "/dashboard/admin";
    if (role === "renter") return "/dashboard/renter";
    return "/dashboard/user";
  }, [user?.role]);

  const authLinks = useMemo(() => {
    if (!isAuthenticated) return [];
    return [{ name: "Dashboard", href: dashboardHref, icon: ProfileIcon }];
  }, [isAuthenticated, dashboardHref]);

  const navLinks = useMemo(
    () => [...baseLinks, ...authLinks],
    [baseLinks, authLinks]
  );

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  if (HIDDEN_ROUTES.has(pathname) || isChecking) return null;

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40", // z normal, el overlay va en portal aparte
          "bg-[linear-gradient(to_right,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)]",
          "backdrop-blur border-b border-white/15 text-[var(--color-custume-light)]",
          "transition-shadow",
          scrolled ? "shadow-md" : "shadow-sm",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-8">
          <div className="h-16 lg:h-20 flex items-center justify-between gap-3">
            {/* Logo */}
            <Link
              href="/home"
              className="inline-flex items-center h-full shrink-0"
              aria-label="Volantia Home"
            >
              <span className="relative h-[52px] w-[140px] lg:h-[70px] lg:w-[180px]">
                <Image
                  src="/lightLogo.png"
                  alt="Volantia"
                  fill
                  priority
                  sizes="(min-width: 1024px) 180px, 140px"
                  className="object-contain object-center"
                />
              </span>
            </Link>

            {/* Navegación desktop */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-end min-w-0">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition font-medium whitespace-nowrap",
                    isActive(l.href)
                      ? "bg-white text-[var(--color-dark-blue)] shadow border border-white/50"
                      : "text-[var(--color-light-blue)] hover:bg-white/80 hover:text-[var(--color-dark-blue)]",
                  ].join(" ")}
                >
                  <Image src={l.icon} alt="" width={22} height={22} />
                  {l.name}
                </Link>
              ))}

              <span className="mx-2 h-6 w-px bg-white/40" />

              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-blue)] border border-white/70 hover:shadow transition font-semibold whitespace-nowrap"
                >
                  <Image src={ProfileIcon} alt="" width={22} height={22} />
                  Iniciar sesión
                </Link>
              )}
            </nav>

            {/* Botón hamburguesa */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-lg border border-white/30 bg-white/10 text-[var(--color-light-blue)] hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Abrir menú"
              aria-controls="mobile-menu"
              aria-expanded={open}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL FULLSCREEN EN PORTAL (por encima de todo) */}
      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[99999] lg:hidden">
            {/* fondo oscurecido */}
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />

            {/* contenido del menú */}
            <div
              id="mobile-menu"
              className="relative z-10 flex h-full min-h-screen flex-col bg-[linear-gradient(to_bottom,var(--color-dark-blue)_0%,var(--color-custume-blue)_50%,var(--color-dark-blue)_100%)] text-[var(--color-custume-light)]"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              {/* header del menú */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-white/15">
                <Link
                  href="/home"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2"
                  aria-label="Volantia Home"
                >
                  <span className="relative h-[36px] w-[120px]">
                    <Image
                      src="/lightLogo.png"
                      alt="Volantia"
                      fill
                      sizes="120px"
                      className="object-contain object-left"
                    />
                  </span>
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Cerrar menú"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* zona scrollable: usuario + links + login */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {isAuthenticated && (
                  <div className="border border-white/15 rounded-2xl px-4 py-3 bg-white/5">
                    <p className="text-xs text-[var(--color-light-blue)]/80 mb-1">
                      Sesión iniciada como
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {user?.name || user?.email || "Usuario"}
                    </p>
                  </div>
                )}

                <nav>
                  <ul className="space-y-2">
                    {navLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className={[
                            "group flex items-center gap-3 px-4 py-3 rounded-2xl transition",
                            "text-base font-medium",
                            isActive(l.href)
                              ? "bg-white text-[var(--color-dark-blue)] shadow-md"
                              : "text-[var(--color-light-blue)] bg-white/5 hover:bg-white/15",
                          ].join(" ")}
                        >
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 shrink-0">
                            <Image
                              src={l.icon}
                              alt=""
                              width={22}
                              height={22}
                              className="opacity-90 group-hover:opacity-100"
                            />
                          </span>
                          <span className="truncate">{l.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {!isAuthenticated && (
                  <div className="pt-2 pb-1">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-white text-[var(--color-dark-blue)] font-semibold text-sm shadow hover:bg-[var(--color-light-blue)] hover:shadow-lg transition"
                    >
                      <Image src={ProfileIcon} alt="" width={22} height={22} />
                      Iniciar sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
