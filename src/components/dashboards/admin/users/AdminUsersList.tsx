// src/components/dashboards/admin/users/AdminUsersList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminUsersApi,
  type AdminUser,
  type AdminUsersFilters,
} from "@/services/adminService.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Filter, Search, RefreshCcw } from "lucide-react";

type MetaLike = {
  page: number;
  limit: number;
  total: number;
  pages?: number;
  hasNext?: boolean | 0 | 1;
  hasPrev?: boolean | 0 | 1;
};

export default function AdminUsersList() {
  const [filters, setFilters] = useState<AdminUsersFilters>({
    page: 1,
    limit: 10,
    q: "",
    role: undefined,
    status: undefined,
    city: undefined,
  });

  const [data, setData] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<MetaLike | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // carga de datos
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminUsersApi.listUsers(filters);
        if (cancelled) return;
        setData(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error("[AdminUsersList] error:", err);
        if (!cancelled) setError("No se pudieron cargar los usuarios.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const totalLabel = useMemo(() => {
    if (!meta) return "";
    const { total, page, limit } = meta;
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    if (total === 0) return "0 resultados";
    return `${from}–${to} de ${total}`;
  }, [meta]);

  const onChangePage = (next: number) => {
    if (!meta) return;
    if (next < 1) return;
    if (meta.pages && next > meta.pages) return;
    setFilters((f) => ({ ...f, page: next }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      q: "",
      role: undefined,
      status: undefined,
      city: undefined,
    });
  };

  const canGoPrev = !!meta && !!meta.hasPrev;
  const canGoNext = !!meta && !!meta.hasNext;

  return (
    <Card className="rounded-2xl border border-white/10 bg-black/30 text-[var(--color-custume-light)]">
      <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-white">
            Usuarios
          </CardTitle>
          <p className="text-xs text-[var(--color-custume-light)]/75">
            Gestión de usuarios (roles, estado y actividad). Origen: <code className="text-[10px] bg-white/10 rounded px-1.5 py-0.5">GET /admin/users</code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--color-custume-light)]/75">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtros activos se aplican en tiempo real</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Filtros */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-custume-light)]/60" />
            <Input
              placeholder="Buscar por nombre, email o username…"
              className="pl-8 bg-white/5 border-white/15 text-xs h-9"
              value={filters.q ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, page: 1, q: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Rol */}
            <Select
              value={filters.role ?? "ALL"}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  role: v === "ALL" ? undefined : (v as AdminUsersFilters["role"]),
                }))
              }
            >
              <SelectTrigger className="h-9 w-[110px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="RENTER">Renter</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>


            {/* Estado */}
            <Select
              value={filters.status ?? "ALL"}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  status: v === "ALL" ? undefined : (v as AdminUsersFilters["status"]),
                }))
              }
            >
              <SelectTrigger className="h-9 w-[120px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>


            {/* Ciudad (texto libre simple) */}
            <Input
              placeholder="Ciudad"
              className="h-9 w-[120px] bg-white/5 border-white/15 text-xs"
              value={filters.city ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  city: e.target.value || undefined,
                }))
              }
            />

            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 bg-white/5 border-white/25"
              onClick={resetFilters}
              title="Reiniciar filtros"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Tabla / contenido */}
        {loading && !data.length ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 rounded-lg bg-white/10"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-200 bg-red-500/15 border border-red-500/40 rounded-xl px-3 py-2">
            {error}
          </p>
        ) : !data.length ? (
          <p className="text-sm text-[var(--color-custume-light)]/80">
            No se encontraron usuarios con los filtros actuales.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-[var(--color-custume-light)]/80">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Usuario</th>
                  <th className="px-3 py-2 text-left font-semibold">Rol</th>
                  <th className="px-3 py-2 text-left font-semibold">Estado</th>
                  <th className="px-3 py-2 text-left font-semibold">Ciudad</th>
                  <th className="px-3 py-2 text-left font-semibold">Pins</th>
                  <th className="px-3 py-2 text-left font-semibold">Creado</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-3 py-2 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--color-custume-light)]">
                          {u.name || u.username || u.email}
                        </span>
                        <span className="text-[10px] text-[var(--color-custume-light)]/70">
                          {u.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="text-[11px] text-[var(--color-custume-light)]/85">
                        {u.city || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="text-[11px] text-[var(--color-custume-light)]/85">
                        {u.pinsCount ?? 0}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className="text-[10px] text-[var(--color-custume-light)]/70">
                        {formatDate(u.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-[var(--color-custume-light)]/70">
            {totalLabel}
          </p>

          <div className="flex items-center gap-2">
            <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-white/5 border-white/25"
            disabled={loading || !canGoPrev || (meta?.page ?? 1) <= 1}
            onClick={() => onChangePage((meta?.page ?? 1) - 1)}
            >
            <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[11px] text-[var(--color-custume-light)]/80">
              Página {meta?.page ?? 1}
            </span>
            <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-white/5 border-white/25"
            disabled={
                loading ||
                !canGoNext ||
                (meta?.pages !== undefined && (meta?.page ?? 1) >= meta.pages)
            }
            onClick={() => onChangePage((meta?.page ?? 1) + 1)}
            >
            <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ===== Helpers UI ===== */

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  const label =
    role === "ADMIN" ? "Admin" : role === "RENTER" ? "Renter" : "User";
  const variantClasses =
    role === "ADMIN"
      ? "bg-emerald-400/15 text-emerald-200 border-emerald-300/40"
      : role === "RENTER"
      ? "bg-sky-400/15 text-sky-200 border-sky-300/40"
      : "bg-white/5 text-[var(--color-custume-light)] border-white/25";

  return (
    <Badge
      variant="outline"
      className={`text-[10px] px-2 py-0.5 rounded-full ${variantClasses}`}
    >
      {label}
    </Badge>
  );
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  const label = status === "active" ? "Activo" : "Suspendido";
  const variantClasses =
    status === "active"
      ? "bg-emerald-400/12 text-emerald-200 border-emerald-300/40"
      : "bg-red-400/12 text-red-200 border-red-300/40";

  return (
    <Badge
      variant="outline"
      className={`text-[10px] px-2 py-0.5 rounded-full ${variantClasses}`}
    >
      {label}
    </Badge>
  );
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
