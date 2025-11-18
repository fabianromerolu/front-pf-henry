// src/components/dashboards/admin/payments/AdminTransactionsList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  adminPaymentsApi,
} from "@/services/adminService.service";
import type { WalletTransaction, PaginationMeta } from "@/services/userRenter.service";

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
  ArrowLeftRight,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCcw,
  Wallet,
} from "lucide-react";

type TransactionsFilters = {
  page: number;
  limit: number;
  ownerId?: string;
  type?: "CREDIT" | "DEBIT";
  status?: "AVAILABLE" | "PENDING" | "PAID";
};

type PaginationMetaLike = Partial<PaginationMeta> & {
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

type WalletTransactionRow = WalletTransaction & {
  owner?: {
    id?: string;
    name?: string;
    email?: string;
  };
  meta?: {
    reason?: string;
  };
  bookingId?: string;
  reference?: string;
  description?: string;
  createdAt?: string;
  date?: string;
  amountTotal?: unknown;
  total?: unknown;
};


export default function AdminTransactionsList() {
  const [filters, setFilters] = useState<TransactionsFilters>({
    page: 1,
    limit: 10,
    ownerId: "",
    type: undefined,
    status: undefined,
  });

  const [data, setData] = useState<WalletTransaction[]>([]);
  const [meta, setMeta] = useState<PaginationMetaLike | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await adminPaymentsApi.listTransactions({
          page: filters.page,
          limit: filters.limit,
          ownerId: filters.ownerId || undefined,
          type: filters.type,
          status: filters.status,
        });

        if (cancelled) return;

        setData(res.data || []);
                const raw = res.meta as PaginationMetaLike | null;

        if (!cancelled) {
          if (raw) {
            const page = raw.page ?? filters.page ?? 1;
            const limit = raw.limit ?? filters.limit ?? 10;
            const total = raw.total ?? 0;
            const totalPages =
              raw.totalPages ?? (limit ? Math.max(1, Math.ceil(total / limit)) : 1);

            setMeta({
              page,
              limit,
              total,
              totalPages,
              hasNextPage:
                raw.hasNextPage ??
                raw.hasNext ??
                page < totalPages,
              hasPrevPage:
                raw.hasPrevPage ??
                raw.hasPrev ??
                page > 1,
            });
          } else {
            setMeta(null);
          }
        }
      } catch (err) {
        console.error("[AdminTransactionsList] error:", err);
        if (!cancelled) setError("No se pudieron cargar las transacciones.");
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

    const page = meta.page ?? 1;
    const limit = meta.limit ?? filters.limit ?? 10;
    const total = meta.total ?? 0;
    if (!total) return "0 resultados";

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    return `${from}–${to} de ${total}`;
  }, [meta, filters.limit]);


  const hasNext = useMemo(() => {
    if (!meta) return false;
    if (typeof meta.hasNextPage === "boolean") return meta.hasNextPage;

    const page = meta.page ?? 1;
    const limit = meta.limit ?? filters.limit ?? 10;
    const total = meta.total ?? 0;
    const totalPages =
      meta.totalPages ?? (limit ? Math.ceil(total / limit) : 1);

    return page < totalPages;
  }, [meta, filters.limit]);



  const hasPrev = useMemo(() => {
    if (!meta) return false;
    if (typeof meta.hasPrevPage === "boolean") return meta.hasPrevPage;

    const page = meta.page ?? 1;
    return page > 1;
  }, [meta]);


  const currentPage = meta?.page ?? filters.page ?? 1;
  const totalPages =
    meta?.totalPages ??
    (() => {
      const limit = meta?.limit ?? filters.limit ?? 10;
      const total = meta?.total ?? 0;
      return limit ? Math.max(1, Math.ceil(total / limit)) : 1;
    })();


  const onChangePage = (next: number) => {
    if (next < 1) return;
    if (next > currentPage && !hasNext) return;
    if (next < currentPage && !hasPrev) return;

    setFilters((f) => ({ ...f, page: next }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      ownerId: "",
      type: undefined,
      status: undefined,
    });
  };

  return (
    <Card className="rounded-2xl border border-white/10 bg-black/30 text-[var(--color-custume-light)]">
      <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
              <ArrowLeftRight className="h-4 w-4 text-[var(--color-light-blue)]" />
            </span>
            Transacciones
          </CardTitle>
          <p className="text-xs text-[var(--color-custume-light)]/75">
            Historial global de movimientos de wallet. Origen:{" "}
            <code className="text-[10px] bg-white/10 rounded px-1.5 py-0.5">
              GET /admin/payments/transactions
            </code>
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[var(--color-custume-light)]/75">
          <Filter className="h-3.5 w-3.5" />
          <span>Filtrado por owner, tipo y estado</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Filtros */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2 flex-1">
            {/* ownerId */}
            <Input
              placeholder="ownerId"
              className="h-9 w-[180px] bg-white/5 border-white/15 text-xs"
              value={filters.ownerId ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  ownerId: e.target.value,
                }))
              }
            />

            {/* Tipo */}
            <Select
              value={filters.type ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  type: (v || undefined) as TransactionsFilters["type"],
                }))
              }
            >
              <SelectTrigger className="h-9 w-[140px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="CREDIT">Crédito</SelectItem>
                <SelectItem value="DEBIT">Débito</SelectItem>
              </SelectContent>
            </Select>

            {/* Estado */}
            <Select
              value={filters.status ?? ""}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  page: 1,
                  status: (v || undefined) as TransactionsFilters["status"],
                }))
              }
            >
              <SelectTrigger className="h-9 w-[160px] bg-white/5 border-white/15 text-xs">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="AVAILABLE">Disponible</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="PAID">Pagado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
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
            No se encontraron transacciones con los filtros actuales.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
            <table className="min-w-full text-xs">
              <thead className="bg-white/5 text-[var(--color-custume-light)]/80">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Tx</th>
                  <th className="px-3 py-2 text-left font-semibold">Tipo</th>
                  <th className="px-3 py-2 text-left font-semibold">Owner</th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Referencia
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Estado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Fecha
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((tx) => {
                  const t: WalletTransactionRow = tx as WalletTransactionRow;
                  const id = t.id || "";
                  const shortId = id ? `#${String(id).slice(0, 8)}…` : "—";

                  const typeLabel = mapTxType(t.type);
                  const typeClass = typeBadgeClass(t.type);

                  const statusLabel = mapTxStatus(t.status);
                  const statusClass = statusBadgeClass(t.status);

                  const ownerLabel =
                    t.owner?.name ||
                    t.owner?.email ||
                    t.ownerId ||
                    "—";

                  const reference =
                    t.reference ||
                    t.description ||
                    t.bookingId ||
                    t.meta?.reason ||
                    "—";

                  const createdAt = t.createdAt || t.date || null;
                  const icon =
                    (t.type === "CREDIT" && (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )) ||
                    (t.type === "DEBIT" && (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )) || <Wallet className="h-3.5 w-3.5" />;

                  return (
                    <tr
                      key={id}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {/* Tx */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px] font-semibold text-white">
                          {shortId}
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="px-3 py-2 align-middle">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${typeClass}`}
                        >
                          {icon}
                          <span>{typeLabel}</span>
                        </Badge>
                      </td>

                      {/* Owner */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px]">{ownerLabel}</span>
                        {t.owner?.id && (
                          <span className="block text-[10px] text-[var(--color-custume-light)]/60">
                            {t.owner.id}
                          </span>
                        )}
                      </td>

                      {/* Referencia */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px] line-clamp-2">
                          {reference}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-3 py-2 align-middle">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 rounded-full ${statusClass}`}
                        >
                          {statusLabel}
                        </Badge>
                      </td>

                      {/* Fecha */}
                      <td className="px-3 py-2 align-middle">
                        <span className="text-[11px]">
                          {formatDateSafe(createdAt, "dd MMM yyyy, HH:mm")}
                        </span>
                      </td>

                      {/* Monto */}
                      <td className="px-3 py-2 align-middle text-right">
                        <span className="text-[11px] font-semibold text-white">
                          {formatAmount(t.amount ?? t.amountTotal ?? t.total)}
                        </span>
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
              disabled={loading || !hasPrev}
              onClick={() => onChangePage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[11px] text-[var(--color-custume-light)]/80">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-white/5 border-white/25"
              disabled={loading || !hasNext}
              onClick={() => onChangePage(currentPage + 1)}
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

function mapTxType(type?: string): string {
  if (!type) return "—";
  switch (type.toUpperCase()) {
    case "CREDIT":
      return "Crédito";
    case "DEBIT":
      return "Débito";
    default:
      return type;
  }
}

function typeBadgeClass(type?: string): string {
  if (!type) return "bg-white/10 border-white/20 text-[var(--color-custume-light)]";
  switch (type.toUpperCase()) {
    case "CREDIT":
      return "bg-emerald-500/15 border-emerald-400/60 text-emerald-100";
    case "DEBIT":
      return "bg-rose-500/15 border-rose-400/60 text-rose-100";
    default:
      return "bg-white/10 border-white/20 text-[var(--color-custume-light)]";
  }
}

function mapTxStatus(status?: string): string {
  if (!status) return "—";
  switch (status.toUpperCase()) {
    case "AVAILABLE":
      return "Disponible";
    case "PENDING":
      return "Pendiente";
    case "PAID":
      return "Pagado";
    default:
      return status;
  }
}

function statusBadgeClass(status?: string): string {
  if (!status) return "bg-white/10 border-white/20 text-[var(--color-custume-light)]";
  switch (status.toUpperCase()) {
    case "AVAILABLE":
      return "bg-emerald-500/15 border-emerald-400/60 text-emerald-100";
    case "PENDING":
      return "bg-amber-500/15 border-amber-400/60 text-amber-100";
    case "PAID":
      return "bg-sky-500/15 border-sky-400/60 text-sky-100";
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

function parseNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const s = String(value);
  const cleaned = s.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

function formatAmount(value: unknown): string {
  const n = parseNumber(value);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}
