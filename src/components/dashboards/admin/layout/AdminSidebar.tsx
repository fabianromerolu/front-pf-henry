// src/components/dashboards/admin/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CarFront,
  CalendarRange,
  Wallet,
  LogOut,
} from "lucide-react";
import { logout } from "@/services/authService.service";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Resumen", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Usuarios", href: "/dashboard/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  // Solo el root hace match exacto.
  // Para las demás rutas, permitimos subrutas (/users/123, etc.)
  const isActive = (href: string) => {
    if (href === "/dashboard/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className="
        rounded-2xl
        border border-[var(--color-custume-blue)]/55
        bg-[var(--color-dark-blue)]
        text-[var(--color-custume-light)]
        shadow-[0_18px_45px_rgba(0,0,0,.45)]
        p-3
        flex flex-col gap-3
      "
    >
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  active
                    ? "bg-white text-[var(--color-dark-blue)] shadow-sm"
                    : "text-[var(--color-custume-light)]/85 hover:bg-[var(--color-custume-blue)]/55 hover:text-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                    active
                      ? "bg-[var(--color-dark-blue)]/5 text-[var(--color-dark-blue)]"
                      : "bg-[var(--color-custume-blue)]/65 text-white",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Cerrar sesión */}
      <div className="pt-3 border-t border-[var(--color-custume-blue)]/40">
        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            text-[var(--color-custume-light)]/85
            transition-colors
            hover:bg-[var(--color-custume-red)]/20 hover:text-white
          "
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-custume-red)]/80 text-white">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="truncate font-medium">Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
