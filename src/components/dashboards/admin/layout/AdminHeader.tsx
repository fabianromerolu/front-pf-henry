// src/components/dashboards/admin/layout/AdminHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function mapPathToTitle(pathname: string): string {
  if (pathname === "/dashboard/admin") return "Panel de administración";

  if (pathname.startsWith("/dashboard/admin/users")) return "Usuarios";
  if (pathname.startsWith("/dashboard/admin/bookings")) return "Reservas";
  if (pathname.startsWith("/dashboard/admin/payments")) return "Pagos";
  if (pathname.startsWith("/dashboard/admin/pins")) return "Vehículos";

  return "Panel de administración";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title = mapPathToTitle(pathname);

  const initials =
    (user?.name || user?.email || "A")
      .split(" ")
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "A";

  const profilePicture =
    typeof (user as { profilePicture?: unknown })?.profilePicture === "string"
      ? (user as { profilePicture?: string }).profilePicture
      : undefined;

  return (
    <header
      className="
        flex items-center justify-between gap-4
        rounded-2xl
        border border-[var(--color-custume-blue)]/60
        bg-[var(--color-dark-blue)]
        px-4 py-3 sm:px-5 sm:py-4
        shadow-[0_14px_32px_rgba(0,0,0,.45)]
        text-[var(--color-custume-light)]
      "
    >
      <div className="space-y-1 min-w-0">
        <Breadcrumb className="text-[11px] text-[var(--color-custume-light)]/70">
          <BreadcrumbList className="text-[11px] text-[var(--color-custume-light)]/80">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="truncate">{title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-0.5 text-xl sm:text-2xl font-semibold text-white">
          {title}
        </h1>

        <p className="text-xs text-[var(--color-custume-light)]/85">
          Control global de usuarios, vehículos, reservas y pagos.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:block text-right">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--color-custume-light)]/80">
            Sesión admin
          </p>
          <p className="text-sm font-medium text-white">
            {user?.name || user?.email || "Administrador"}
          </p>
        </div>

        <Avatar className="h-9 w-9 border border-white/70 shadow-md bg-[var(--color-custume-blue)]/80">
          <AvatarImage
            src={profilePicture}
            alt={user?.name || user?.email || "Admin"}
          />
          <AvatarFallback className="bg-white text-[var(--color-dark-blue)] text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
