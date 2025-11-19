//src/components/dashboards/user/MyBookings.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import type { Booking, PaginationMeta } from "@/services/userRenter.service";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import { standardUserApi } from "@/services/userStandar.service";

type StatusFilter = "ALL" | "active" | "complete" | "suspended";

function apiMsg(e: unknown) {
  const msg =
    (e as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;
  return msg ?? "Ocurrió un error";
}

function formatStatus(status: Booking["status"]) {
  if (status === "active") return "Activa";
  if (status === "complete") return "Completada";
  if (status === "suspended") return "Cancelada";
  return status;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyBookings() {
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [rows, setRows] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await standardUserApi.listMyBookings({
        status: status === "ALL" ? undefined : (status as Booking["status"]),
        from: from || undefined,
        to: to || undefined,
        page,
        limit,
      });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (e) {
      console.error("[MyBookings] error", e);
      setError("No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, from, to, page]);

  const canPrev = meta?.hasPrev ?? page > 1;
  const canNext = meta?.hasNext ?? false;

  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar esta reserva?")) return;
    setBusyId(id);
    try {
      await standardUserApi.cancelMyBooking(id);
      toast.success("Reserva cancelada");
      await load();
    } catch (e) {
      toast.error(apiMsg(e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="taviraj text-lg text-custume-blue">
            Mis reservas
          </h3>
          <p className="hind text-xs text-custume-gray">
            Ve tu historial de viajes, estados y totales.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="rounded-full border px-3 py-1.5 text-xs bg-light-blue text-custume-blue border-custume-light hover:bg-custume-blue hover:text-light-blue transition"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as StatusFilter);
            }}
          >
            <option value="ALL">Todas</option>
            <option value="active">Activas</option>
            <option value="complete">Completadas</option>
            <option value="suspended">Canceladas</option>
          </select>

          <input
            type="date"
            className="rounded-xl border px-2 py-1.5 text-xs"
            value={from}
            onChange={(e) => {
              setPage(1);
              setFrom(e.target.value);
            }}
          />
          <span className="text-xs text-custume-gray">a</span>
          <input
            type="date"
            className="rounded-xl border px-2 py-1.5 text-xs"
            value={to}
            onChange={(e) => {
              setPage(1);
              setTo(e.target.value);
            }}
          />

          <button
            type="button"
            className="text-xs text-custume-blue underline"
            onClick={() => {
              setStatus("ALL");
              setFrom("");
              setTo("");
              setPage(1);
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loading && !rows.length ? (
        <p className="text-sm text-custume-gray">Cargando reservas…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : !rows.length ? (
        <p className="text-sm text-custume-gray">
          Aún no tienes reservas. Cuando hagas una, aparecerá aquí.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-custume-light bg-light-blue/10">
          <table className="min-w-full text-xs">
            <thead className="bg-light-blue/40 text-custume-blue">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Inicio</th>
                <th className="px-3 py-2 text-left font-semibold">Fin</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Vehículo
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Ubicación
                </th>
                <th className="px-3 py-2 text-left font-semibold">Estado</th>
                <th className="px-3 py-2 text-left font-semibold">Total</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-custume-light/40 hover:bg-white/60 transition-colors"
                >
                  <td className="px-3 py-2 align-middle">
                    {formatDate(b.startDate)}
                  </td>
                  <td className="px-3 py-2 align-middle">
                    {formatDate(b.endDate)}
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <span className="font-medium text-custume-blue">
                      {b.pin?.make} {b.pin?.model}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-middle text-[11px] text-custume-gray">
                    {[
                      b.pin?.city,
                      b.pin?.state,
                      b.pin?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <span className="text-[11px]">
                      {formatStatus(b.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <span className="text-[11px]">
                      COP {b.totalPrice}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-middle">
                    <div className="flex flex-wrap gap-2 items-center">
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="text-xs text-custume-blue underline"
                      >
                        Ver detalle
                      </Link>
                      {b.status === "active" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(b.id)}
                          disabled={busyId === b.id}
                          className="text-xs text-custume-red underline"
                        >
                          {busyId === b.id
                            ? "Cancelando…"
                            : "Cancelar"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-[11px] text-custume-gray">
          {meta
            ? `${(meta.page - 1) * meta.limit + 1}–${Math.min(
                meta.page * meta.limit,
                meta.total
              )} de ${meta.total}`
            : ""}
        </p>
        <div className="flex items-center gap-2">
          <LightButton
            text="Prev"
            size="sm"
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={loading || !canPrev || page <= 1}
          />
          <span className="text-[11px] text-custume-gray">
            Página {page}
          </span>
          <DarkButton
            text="Next"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || !canNext}
          />
        </div>
      </div>
    </div>
  );
}
