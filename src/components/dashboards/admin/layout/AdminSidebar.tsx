// src/components/dashboards/admin/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CarFront, CalendarRange, Wallet } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Resumen", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Usuarios", href: "/dashboard/admin/users", icon: Users },
  { label: "Vehículos", href: "/dashboard/admin/pins", icon: CarFront },
  { label: "Reservas", href: "/dashboard/admin/bookings", icon: CalendarRange },
  { label: "Pagos", href: "/dashboard/admin/payments", icon: Wallet },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="h-full rounded-2xl border border-white/10 bg-black/15 backdrop-blur-md p-3 shadow-[0_18px_45px_rgba(0,0,0,.45)]">
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--color-light-blue)]/80 mb-3">
        Admin
      </p>

      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                  active
                    ? "bg-white text-[var(--color-dark-blue)] shadow border border-white/70"
                    : "text-[var(--color-custume-light)]/85 hover:bg-white/10 hover:border-white/40 border border-transparent",
                ].join(" ")}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
