// src/components/dashboards/admin/bookings/AdminBookingsList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  adminBookingsApi,
} from "@/services/adminService.service";
import type { Booking } from "@/services/userRenter.service";

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

import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCcw,
  Wallet,
} from "lucide-react";

type BookingsFilters = {
  page: number;
  limit: number;
  status?: "active" | "suspended" | "complete";
  userId?: string;
  ownerId?: string;
  from?: string; // yyyy-MM-dd
  to?: string;   // yyyy-MM-dd
};
type BookingForTable = Booking & {
  status?: string;
  createdAt?: string;

  startDate?: string;
  from?: string;
  checkIn?: string;
  checkInDate?: string;
  endDate?: string;
  to?: string;
  checkOut?: string;
  checkOutDate?: string;

  renter?: {
    id?: string;
    name?: string;
    email?: string;
  };
  owner?: {
    id?: string;
    name?: string;
    email?: string;
  };
  user?: {
    email?: string;
  };
  pin?: {
    id?: string;
    title?: string;
    description?: string;
  };

  totalAmount?: string | number | null;
  totalPrice?: string | number | null;
  priceTotal?: string | number | null;
  amount?: string | number | null;
  amountTotal?: string | number | null;
};
type BookingsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function AdminBookingsList() {
  const [filters, setFilters] = useState<BookingsFilters>({
    page: 1,
    limit: 10,
    status: undefined,
    userId: "",
    ownerId: "",
    from: "",
    to: "",
  });

  const [data, setData] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<BookingsMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
      const res = await adminBookingsApi.listBookings({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        userId: filters.userId || undefined,
        ownerId: filters.ownerId || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
      });

      if (cancelled) return;

      setData(res.data || []);
      setMeta({
        page: res.meta.page,
        limit: res.meta.limit,
        total: res.meta.total,
        totalPages: res.meta.pages,  // 👈 mapeamos pages -> totalPages
        hasNext: res.meta.hasNext,
        hasPrev: res.meta.hasPrev,
      });

      } catch (err) {
        console.error("[AdminBookingsList] error:", err);
        if (!cancelled) setError("No se pudieron cargar las reservas.");
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
    if (!total) return "0 resultados";
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    return `${from}–${to} de ${total}`;
  }, [meta]);

  const onChangePage = (next: number) => {
    if (!meta) return;
    if (next < 1) return;
    if (!meta.hasNext && next > meta.page) return;
    if (!meta.hasPrev && next < meta.page) return;
    setFilters((f) => ({ ...f, page: next }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: undefined,
      userId: "",
      ownerId: "",
      from: "",
      to: "",
    });
  };

  return (
    <Card className="rounded-2xl border border-white/10 bg-black/30 text-[var(--color-custume-light)]">
      <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
              <CalendarRange className="h-4 w-4 text-[var(--color-light-blue)]" />
            </span>
            Reservas
          </CardTitle>
          <p className="text-xs text-[var(--color-custume-light)]/75">
            Listado global de reservas. Origen:{" "}
            <code className="text-[10px] bg-white/10 rounded px-1.5 py-0.5">
              GET /admin/bookings
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--color-custume-light)]/75">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtrado por estado, rango de fechas y usuario/owner</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Filtros */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2 flex-1">
            {/* Estado */}
            <Select
              value={filters.status ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  status: (v || undefined) as BookingsFilters["status"],
                }))
              }
            >
              <SelectTrigger className="h-9 w-[150px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="complete">Completada</SelectItem>
                <SelectItem value="suspended">Suspendida</SelectItem>
              </SelectContent>
            </Select>

            {/* Fecha desde */}
            <Input
              type="date"
              className="h-9 w-[150px] bg-white/5 border-white/15 text-xs"
              value={filters.from ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  from: e.target.value,
                }))
              }
            />

            {/* Fecha hasta */}
            <Input
              type="date"
              className="h-9 w-[150px] bg-white/5 border-white/15 text-xs"
              value={filters.to ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  to: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* userId */}
            <Input
              placeholder="userId (renter)"
              className="h-9 w-[170px] bg-white/5 border-white/15 text-xs"
              value={filters.userId ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  userId: e.target.value,
                }))
              }
            />

            {/* ownerId */}
            <Input
              placeholder="ownerId"
              className="h-9 w-[170px] bg-white/5 border-white/15 text-xs"
              value={filters.ownerId ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  ownerId: e.target.value,
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

        {/* Tabla */}
        {loading && !data.length ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg bg-white/10" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-200 bg-red-500/15 border border-red-500/40 rounded-xl px-3 py-2">
            {error}
          </p>
        ) : !data.length ? (
          <p className="text-sm text-[var(--color-custume-light)]/80">
            No se encontraron reservas con los filtros actuales.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-[var(--color-custume-light)]/80">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Reserva</th>
                  <th className="px-3 py-2 text-left font-semibold">Fechas</th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Vehículo
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">Renter</th>
                  <th className="px-3 py-2 text-left font-semibold">Owner</th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Monto total
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((booking) => {
                  const b: BookingForTable = booking as BookingForTable;
                  const statusLabel = mapStatus(b.status);
                  const statusColor = statusBadgeClass(b.status);

                  const { from, to } = getBookingDates(b);
                  const renterName =
                    b.renter?.name || b.renter?.email || b.user?.email || "—";
                  const ownerName =
                    b.owner?.name || b.owner?.email || "—";
                  const vehicleLabel =
                    b.pin?.title || b.pin?.description || b.pin?.id || "—";

                  return (
                    <tr
                      key={booking.id}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {/* Reserva */}
                      <td className="px-3 py-2 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[11px] font-semibold text-white">
                            #{booking.id.slice(0, 8)}…
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge
                              className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor}`}
                            >
                              {statusLabel}
                            </Badge>
                            {b.createdAt && (
                              <span className="text-[10px] text-[var(--color-custume-light)]/65">
                                Creada{" "}
                                {formatDateSafe(b.createdAt, "dd MMM yyyy, HH:mm")}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Fechas */}
                      <td className="px-3 py-2 align-middle">
                        {from || to ? (
                          <div className="flex flex-col">
                            <span className="text-[11px]">
                              {formatDateSafe(from, "dd MMM yyyy")} –{" "}
                              {formatDateSafe(to, "dd MMM yyyy")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[var(--color-custume-light)]/70">
                            —
                          </span>
                        )}
                      </td>

                      {/* Vehículo */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px] text-[var(--color-custume-light)] line-clamp-2">
                          {vehicleLabel}
                        </span>
                        {b.pin?.id && (
                          <span className="text-[10px] text-[var(--color-custume-light)]/60">
                            #{b.pin.id}
                          </span>
                        )}
                      </td>

                      {/* Renter */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px]">{renterName}</span>
                        {b.renter?.id && (
                          <span className="block text-[10px] text-[var(--color-custume-light)]/60">
                            {b.renter.id}
                          </span>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px]">{ownerName}</span>
                        {b.owner?.id && (
                          <span className="block text-[10px] text-[var(--color-custume-light)]/60">
                            {b.owner.id}
                          </span>
                        )}
                      </td>

                      {/* Monto total */}
                      <td className="px-3 py-2 align-middle">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5 text-[var(--color-light-blue)]" />
                          <span className="text-[11px] font-semibold text-white">
                            {formatAmount(b)}
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-3 py-2 align-middle text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-[11px] bg-white/5 border-white/30"
                          disabled
                        >
                          Ver detalle
                        </Button>
                        {/* 
                          TODO: cuando definas ruta de detalle admin, cambia esto a:
                          <Button asChild ...>
                            <Link href={`/dashboard/admin/bookings/${booking.id}`}>Ver detalle</Link>
                          </Button>
                        */}
                      </td>
                    </tr>
                  );
                })}
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
              disabled={loading || !meta || !meta.hasPrev}
              onClick={() => onChangePage((meta?.page ?? 1) - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[11px] text-[var(--color-custume-light)]/80">
              Página {meta?.page ?? 1} de {meta?.totalPages ?? 1}
            </span>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-white/5 border-white/25"
              disabled={loading || !meta || !meta.hasNext}
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

/* ========== helpers ========== */

function mapStatus(status: string | undefined): string {
  if (!status) return "—";
  switch (status.toLowerCase()) {
    case "active":
      return "Activa";
    case "complete":
    case "completed":
      return "Completada";
    case "suspended":
    case "cancelled":
      return "Suspendida";
    default:
      return status;
  }
}

function statusBadgeClass(status: string | undefined): string {
  if (!status) return "bg-white/10 border-white/20 text-[var(--color-custume-light)]";
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-500/15 border-emerald-400/50 text-emerald-100";
    case "complete":
    case "completed":
      return "bg-sky-500/15 border-sky-400/50 text-sky-100";
    case "suspended":
    case "cancelled":
      return "bg-rose-500/15 border-rose-400/50 text-rose-100";
    default:
      return "bg-white/10 border-white/20 text-[var(--color-custume-light)]";
  }
}

function formatDateSafe(
  value?: string | null,
  pattern: string = "dd MMM yyyy"
): string {
  if (!value) return "—";
  try {
    return format(new Date(value), pattern, { locale: es });
  } catch {
    return "—";
  }
}

function getBookingDates(b: BookingForTable): { from?: string; to?: string } {
  // Ajusta estos campos a tu DTO real si difieren
  const from =
    b.startDate ||
    b.from ||
    b.checkIn ||
    b.checkInDate ||
    undefined;
  const to =
    b.endDate ||
    b.to ||
    b.checkOut ||
    b.checkOutDate ||
    undefined;

  return { from, to };
}

function parseNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

function formatAmount(b: BookingForTable): string {
  // intenta varios nombres típicos de campo
  const raw =
    b.totalAmount ??
    b.totalPrice ??
    b.priceTotal ??
    b.amount ??
    b.amountTotal ??
    0;

  const n = parseNumber(raw);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}
