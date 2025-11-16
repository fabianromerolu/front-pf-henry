// src/components/navbar/Navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/services/authService.service";

const VehicleIcon = "/icons/vehicles.svg";
const OfferIcon = "/icons/offer.svg";
const ContactIcon = "/icons/contact.svg";
const ProfileIcon = "/icons/profile.svg"; // solo para el botón "Iniciar sesión"

const HIDDEN_ROUTES = new Set<string>(["/", "/login", "/register", "/home"]);

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isChecking, user } = useAuth(); // ← sin logout
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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



  // 🔸 Sin “Perfil”. Si está logueado, solo “Dashboard”.
  const authLinks = useMemo(() => {
    if (!isAuthenticated) return [];
    return [{ name: "Dashboard", href: dashboardHref, icon: ProfileIcon }];
  }, [isAuthenticated, dashboardHref]);

  const navLinks = useMemo(() => [...baseLinks, ...authLinks], [baseLinks, authLinks]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  if (HIDDEN_ROUTES.has(pathname) || isChecking) return null;

  return (
    <header
      className={[
        "sticky top-0 z-[9999] bg-light-blue/95 backdrop-blur border-b border-white/30 transition-shadow",
        scrolled ? "shadow-md" : "shadow-sm",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Más alto, más presencia */}
        <div className="h-[72px] md:h-[80px] flex items-center justify-between">
          {/* Logo MÁS grande y responsivo (por clase, no por width/height) */}
          <Link
            href="/home"
            className="inline-flex items-center h-full"
            aria-label="Volantia Home"
          >
            <span className="relative h-[82px] md:h-[90px] w-[180px] md:w-[200px]">
              <Image
                src="/Logo.svg"
                alt="Volantia"
                fill
                priority
                sizes="(min-width: 768px) 200px, 180px"
                className="object-contain object-center"
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                  isActive(l.href)
                    ? "bg-white text-[var(--color-dark-blue)] shadow border border-white/50"
                    : "text-[var(--color-custume-blue)] hover:bg-white/70 hover:text-[var(--color-dark-blue)]",
                ].join(" ")}
              >
                <Image src={l.icon} alt="" width={24} height={24} />
                {l.name}
              </Link>
            ))}

            <span className="mx-2 h-6 w-px bg-white/40" />

            {/* 🔸 Sin “Cerrar sesión”. Si no está logueado → botón Login */}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white text-[var(--color-dark-blue)] border border-white/60 hover:shadow transition"
              >
                <Image src={ProfileIcon} alt="" width={24} height={24} />
                Iniciar sesión
              </Link>
            )}
          </nav>

          {/* Hamburguesa */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-md text-[var(--color-custume-blue)] hover:bg-white/70 focus:outline-none"
            aria-label="Abrir menú"
            aria-controls="mobile-menu"
            aria-expanded={open}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-[9998] bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        id="mobile-menu"
        className={[
          "fixed right-0 top-0 bottom-0 z-[9999] w-80 bg-white shadow-xl md:hidden",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between h-[68px] px-4 border-b">
          <Link href="/home" onClick={() => setOpen(false)} className="inline-flex items-center gap-2" aria-label="Volantia Home">
            <Image
              src="/logo.svg"
              alt="VOLANTIA"
              width={180}
              height={180}
              sizes="160px"
              priority
              className="h-auto w-[150px]" // ← más grande en mobile drawer
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="h-10 w-10 grid place-items-center rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Cerrar menú"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-2 py-3">
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "group flex items-center gap-3 px-4 py-3 rounded-lg transition",
                    isActive(l.href)
                      ? "bg-[var(--color-light-blue)] text-[var(--color-dark-blue)]"
                      : "text-[var(--color-custume-blue)] hover:bg-gray-100",
                  ].join(" ")}
                >
                  <Image src={l.icon} alt="" width={26} height={26} className="opacity-80 group-hover:opacity-100" />
                  <span className="text-base">{l.name}</span>
                </Link>
              </li>
            ))}

            {!isAuthenticated && (
              <li className="pt-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg text-green-700 hover:bg-green-50 transition"
                >
                  <Image src={ProfileIcon} alt="" width={26} height={26} />
                  <span className="text-base">Iniciar sesión</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </header>
  );
}
