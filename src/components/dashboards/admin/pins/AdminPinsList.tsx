// src/components/dashboards/admin/pins/AdminPinsList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  adminPinsApi,
  type AdminPinListItem,
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

import {
  CarFront,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCcw,
  Search,
} from "lucide-react";

type PinsFilters = {
  page: number;
  limit: number;
  q?: string;
  city?: string;
  category?:
    | "ECONOMY"
    | "COMPACT"
    | "MIDSIZE"
    | "SUV"
    | "PICKUP"
    | "VAN"
    | "PREMIUM"
    | "ELECTRIC";
  status?: "DRAFT" | "PUBLISHED" | "PAUSED" | "BLOCKED";
  priceMin?: number;
  priceMax?: number;
};

type PinsMeta = {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
};

export default function AdminPinsList() {
  const [filters, setFilters] = useState<PinsFilters>({
    page: 1,
    limit: 10,
    q: "",
    city: "",
    category: undefined,
    status: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

  const [data, setData] = useState<AdminPinListItem[]>([]);
  const [meta, setMeta] = useState<PinsMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await adminPinsApi.listPublicPins({
          page: filters.page,
          limit: filters.limit,
          q: filters.q || undefined,
          city: filters.city || undefined,
          category: filters.category,
          status: filters.status,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
        });

        if (cancelled) return;

        setData(res.data || []);
        setMeta({
          page: res.page,
          limit: res.limit,
          total: res.total,
          hasNextPage: res.hasNextPage,
        });
      } catch (err) {
        console.error("[AdminPinsList] error:", err);
        if (!cancelled) setError("No se pudieron cargar los vehículos.");
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
    if (!meta.hasNextPage && next > meta.page) return;
    setFilters((f) => ({ ...f, page: next }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      q: "",
      city: "",
      category: undefined,
      status: undefined,
      priceMin: undefined,
      priceMax: undefined,
    });
  };

  return (
    <Card className="rounded-2xl border border-white/10 bg-black/30 text-[var(--color-custume-light)]">
      <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
              <CarFront className="h-4 w-4 text-[var(--color-light-blue)]" />
            </span>
            Vehículos publicados
          </CardTitle>
          <p className="text-xs text-[var(--color-custume-light)]/75">
            Inventario global de vehículos publicados en la plataforma. Origen:{" "}
            <code className="text-[10px] bg-white/10 rounded px-1.5 py-0.5">
              GET /pins/public
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--color-custume-light)]/75">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtrado por ciudad, categoría, estado y precio</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Filtros */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-custume-light)]/60" />
            <Input
              placeholder="Buscar por descripción, modelo, etc…"
              className="pl-8 bg-white/5 border-white/15 text-xs h-9"
              value={filters.q ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, page: 1, q: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Ciudad */}
            <Input
              placeholder="Ciudad"
              className="h-9 w-[140px] bg-white/5 border-white/15 text-xs"
              value={filters.city ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  city: e.target.value,
                }))
              }
            />

            {/* Categoría */}
            <Select
              value={filters.category ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  category: (v || undefined) as PinsFilters["category"],
                }))
              }
            >
              <SelectTrigger className="h-9 w-[150px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="ECONOMY">Economy</SelectItem>
                <SelectItem value="COMPACT">Compact</SelectItem>
                <SelectItem value="MIDSIZE">Midsize</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="PICKUP">Pickup</SelectItem>
                <SelectItem value="VAN">Van</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="ELECTRIC">Eléctrico</SelectItem>
              </SelectContent>
            </Select>

            {/* Estado */}
            <Select
              value={filters.status ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  status: (v || undefined) as PinsFilters["status"],
                }))
              }
            >
              <SelectTrigger className="h-9 w-[150px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                <SelectItem value="PAUSED">Pausado</SelectItem>
                <SelectItem value="BLOCKED">Bloqueado</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
              </SelectContent>
            </Select>

            {/* Precio min/max */}
            <Input
              type="number"
              placeholder="Precio min"
              className="h-9 w-[110px] bg-white/5 border-white/15 text-xs"
              value={filters.priceMin ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  priceMin: e.target.value
                    ? Number(e.target.value) || undefined
                    : undefined,
                }))
              }
            />
            <Input
              type="number"
              placeholder="Precio máx"
              className="h-9 w-[110px] bg-white/5 border-white/15 text-xs"
              value={filters.priceMax ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  priceMax: e.target.value
                    ? Number(e.target.value) || undefined
                    : undefined,
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
            No se encontraron vehículos con los filtros actuales.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-[var(--color-custume-light)]/80">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Vehículo</th>
                  <th className="px-3 py-2 text-left font-semibold">Specs</th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Precio / día
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">ID</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((pin) => (
                  <tr
                    key={pin.id}
                    className="border-t border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {/* Vehículo + thumbnail */}
                    <td className="px-3 py-2 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                          {pin.thumbnailUrl ? (
                            <Image
                              src={pin.thumbnailUrl}
                              alt={pin.description ?? "Vehículo"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--color-custume-light)]/60">
                              Sin foto
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[var(--color-custume-light)] font-medium line-clamp-1">
                            {pin.description || "Sin descripción"}
                          </span>
                          <span className="text-[10px] text-[var(--color-custume-light)]/65">
                            #{pin.id.slice(0, 8)}…
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Specs */}
                    <td className="px-3 py-2 align-middle">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border-white/25"
                        >
                          {fuelLabel(pin.fuel)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border-white/25"
                        >
                          {transmissionLabel(pin.transmission)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border-white/25"
                        >
                          {pin.seats} plazas
                        </Badge>
                      </div>
                    </td>

                    {/* Precio día */}
                    <td className="px-3 py-2 align-middle">
                      <span className="text-[11px] font-semibold text-white">
                        {formatCop(pin.pricePerDay)}
                      </span>
                    </td>

                    {/* ID corto */}
                    <td className="px-3 py-2 align-middle">
                      <span className="text-[10px] text-[var(--color-custume-light)]/70">
                        {pin.id}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-3 py-2 align-middle text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 text-[11px] bg-white/5 border-white/30"
                      >
                        <a
                          href={`/pins/${pin.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver público
                        </a>
                      </Button>
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
              disabled={loading || !meta || meta.page <= 1}
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
              disabled={loading || !meta || !meta.hasNextPage}
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

function formatCop(value: string): string {
  const n = parseNumber(value);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

function parseNumber(v: string | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const cleaned = v.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

function fuelLabel(fuel: AdminPinListItem["fuel"]) {
  switch (fuel) {
    case "GASOLINE":
      return "Gasolina";
    case "DIESEL":
      return "Diésel";
    case "HYBRID":
      return "Híbrido";
    case "ELECTRIC":
      return "Eléctrico";
    default:
      return fuel;
  }
}

function transmissionLabel(t: AdminPinListItem["transmission"]) {
  switch (t) {
    case "MANUAL":
      return "Manual";
    case "AUTOMATIC":
      return "Automática";
    default:
      return t;
  }
}
