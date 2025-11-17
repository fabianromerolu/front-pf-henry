// src/components/dashboards/admin/layout/AdminHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
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
    <header className="flex items-center justify-between gap-3">
      <div className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-[var(--color-custume-light)]/75">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="truncate">{title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-1 text-xl sm:text-2xl font-semibold text-white">
          {title}
        </h1>
        <p className="text-xs text-[var(--color-custume-light)]/80">
          Control global de usuarios, vehículos, reservas y pagos.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-[var(--color-custume-light)]/70">
            Sesión admin
          </p>
          <p className="text-sm font-medium">
            {user?.name || user?.email || "Administrador"}
          </p>
        </div>
        <Avatar className="h-9 w-9 border border-white/20 shadow">
          <AvatarImage
            src={profilePicture}
            alt={user?.name || user?.email || "Admin"}
          />
          <AvatarFallback className="bg-[var(--color-light-blue)] text-[var(--color-dark-blue)] text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
