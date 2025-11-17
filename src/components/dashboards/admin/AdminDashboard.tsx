// src/components/dashboards/admin/AdminDashboard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  adminMetricsApi,
  type AdminMetricsOverview,
  type AdminMetricsSeriesPoint,
} from "@/services/adminService.service";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarRange, CarFront, LucideIcon, TrendingUp, Users, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartPoint = {
  date: string;
  bookings: number;
  revenue: number;
};

function parseCop(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminMetricsOverview | null>(null);
  const [series, setSeries] = useState<AdminMetricsSeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const today = new Date();
        const from = subDays(today, 29); // últimos 30 días
        const [ov, se] = await Promise.all([
          adminMetricsApi.getOverview(),
          adminMetricsApi.getSeries({
            from: format(from, "yyyy-MM-dd"),
            to: format(today, "yyyy-MM-dd"),
            granularity: "day",
          }),
        ]);
        if (cancelled) return;
        setOverview(ov);
        setSeries(se.data || []);
      } catch (err) {
        console.error("[AdminDashboard] error:", err);
        if (!cancelled) setError("No se pudieron cargar las métricas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData: ChartPoint[] = useMemo(
    () =>
      (series || []).map((p) => ({
        date: format(new Date(p.date), "dd MMM", { locale: es }),
        bookings: p.bookings,
        revenue: parseCop(p.revenue),
      })),
    [series]
  );

  const kpi = overview;

  return (
    <div className="space-y-6">
      {/* ===== KPIs ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !kpi ? (
          <>
            <Skeleton className="h-28 rounded-2xl bg-white/10" />
            <Skeleton className="h-28 rounded-2xl bg-white/10" />
            <Skeleton className="h-28 rounded-2xl bg-white/10" />
            <Skeleton className="h-28 rounded-2xl bg-white/10" />
          </>
        ) : kpi ? (
          <>
            <KpiCard
              icon={Users}
              label="Usuarios totales"
              value={kpi.usersTotal}
              hint={`${kpi.usersActive} activos, ${kpi.usersSuspended} suspendidos`}
            />
            <KpiCard
              icon={CarFront}
              label="Vehículos publicados"
              value={kpi.pinsPublished}
              hint={`${kpi.pinsTotal} totales, ${kpi.pinsBlocked} bloqueados`}
            />
            <KpiCard
              icon={CalendarRange}
              label="Reservas totales"
              value={kpi.bookingsTotal}
              hint={`${kpi.bookingsActive} activas, ${kpi.bookingsComplete} completadas`}
            />
            <KpiCard
              icon={Wallet}
              label="Revenue total"
              value={parseCop(kpi.revenueTotal)}
              hint={`Últimos 30 días: ${new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0,
              }).format(parseCop(kpi.revenueLast30d))}`}
              isMoney
            />
          </>
        ) : (
          <p className="col-span-4 text-sm text-red-200">
            No se encontraron métricas.
          </p>
        )}
      </section>

      {/* ===== Chart bookings + revenue ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] gap-4">
        <Card className="bg-black/30 border-white/10 text-[var(--color-custume-light)] rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Bookings & revenue (30 días)
                </CardTitle>
                <p className="text-[11px] text-[var(--color-custume-light)]/75">
                  Reservas confirmadas y monto total (COP).
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-[var(--color-light-blue)]" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading && chartData.length === 0 ? (
              <Skeleton className="h-56 rounded-xl bg-white/10" />
            ) : chartData.length === 0 ? (
              <p className="text-sm text-[var(--color-custume-light)]/80">
                Todavía no hay datos suficientes para mostrar la serie.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.85} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                    />
                    <YAxis
                      yAxisId="left"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                      tickFormatter={(v) => `${v}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                      tickFormatter={(v) =>
                        new Intl.NumberFormat("es-CO", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(v as number)
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15,23,42,0.96)",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "white" }}
                      formatter={(value: any, name) => {
                        if (name === "Bookings") return [value, "Reservas"];
                        if (name === "Revenue") {
                          return [
                            new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(value as number),
                            "Revenue",
                          ];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend
                      formatter={(v) =>
                        v === "Bookings" ? "Reservas" : v === "Revenue" ? "Revenue (COP)" : v
                      }
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="bookings"
                      name="Bookings"
                      stroke="#38bdf8"
                      fill="url(#colorBookings)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#22c55e"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top ciudades */}
        <Card className="bg-black/30 border-white/10 text-[var(--color-custume-light)] rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Top ciudades
            </CardTitle>
            <p className="text-[11px] text-[var(--color-custume-light)]/75">
              Donde más se rentan vehículos.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {loading && !kpi ? (
              <Skeleton className="h-32 rounded-xl bg-white/10" />
            ) : !kpi || !kpi.topCities || kpi.topCities.length === 0 ? (
              <p className="text-sm text-[var(--color-custume-light)]/80">
                Aún no hay ciudades destacadas.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {kpi.topCities.map((city) => (
                  <Badge
                    key={city}
                    variant="outline"
                    className="bg-white/5 border-white/25 text-[var(--color-custume-light)] text-xs px-3 py-1 rounded-full"
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {error && (
        <p className="text-sm text-red-200 bg-red-500/15 border border-red-500/40 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

type KpiCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  isMoney?: boolean;
};


function KpiCard({ icon: Icon, label, value, hint, isMoney }: KpiCardProps) {
  const formatted =
    typeof value === "number" && isMoney
      ? new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(value)
      : value;

  return (
    <Card className="bg-black/35 border-white/10 text-[var(--color-custume-light)] rounded-2xl">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xs font-semibold text-[var(--color-custume-light)]/80">
          {label}
        </CardTitle>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
          <Icon className="h-4 w-4 text-[var(--color-light-blue)]" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-white">
          {formatted ?? "—"}
        </p>
        {hint && (
          <p className="mt-1 text-[11px] text-[var(--color-custume-light)]/75">
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
