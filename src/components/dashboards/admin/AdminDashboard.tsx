// src/components/dashboards/admin/AdminDashboard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {subDays } from "date-fns";
import {
  adminMetricsApi,
  adminUsersApi,
  type AdminMetricsOverview,
  type AdminUser,
} from "@/services/adminService.service";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  CalendarRange,
  CarFront,
  LucideIcon,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function parseCop(value: string | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

type UserFlowPoint = {
  date: string; // YYYY-MM-DD
  active: number;
  newUsers: number;
};

type TimeRange = "90d" | "30d" | "7d" | "5d";

const userFlowChartConfig = {
  users: {
    label: "Usuarios",
  },
  active: {
    label: "Activos",
    color: "#22c55e",
  },
  newUsers: {
    label: "Nuevos",
    color: "#38bdf8",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminMetricsOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("5d"); // ✅ por defecto 5 días

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [ov, usersRes] = await Promise.all([
          adminMetricsApi.getOverview(),
          adminUsersApi.listUsers({ limit: 500 }),
        ]);

        if (cancelled) return;

        setOverview(ov);
        setUsers(usersRes.data || []);
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

  // Construimos la serie de flujo de usuarios a partir de createdAt
  const userFlowData: UserFlowPoint[] = useMemo(() => {
    if (!users.length) return [];

    const today = new Date();
    const from = subDays(today, 89); // últimos 90 días

    const dates: string[] = [];
    const dateMap = new Map<string, { newUsers: number; active: number }>();

    // Inicializamos todos los días del rango en 0
    for (let d = new Date(from); d <= today; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
      dates.push(iso);
      dateMap.set(iso, { newUsers: 0, active: 0 });
    }

    // Sumamos los usuarios creados en cada día del rango
    for (const u of users) {
      const created = new Date(u.createdAt);
      if (Number.isNaN(created.getTime())) continue;
      if (created < from || created > today) continue;

      const iso = created.toISOString().slice(0, 10);
      const bucket = dateMap.get(iso);
      if (bucket) {
        bucket.newUsers += 1;
      }
    }

    // Hacemos el acumulado para "active"
    let cumulative = 0;
    const result: UserFlowPoint[] = [];

    for (const iso of dates) {
      const bucket = dateMap.get(iso)!;
      cumulative += bucket.newUsers;
      bucket.active = cumulative;
      result.push({
        date: iso,
        active: bucket.active,
        newUsers: bucket.newUsers,
      });
    }

    return result;
  }, [users]);

  const filteredUserFlowData = useMemo(() => {
    if (!userFlowData.length) return [];

    if (timeRange === "90d") return userFlowData;

    const daysMap: Record<Exclude<TimeRange, "90d">, number> = {
      "30d": 30,
      "7d": 7,
      "5d": 5,
    };

    const days = daysMap[timeRange as Exclude<TimeRange, "90d">];
    return userFlowData.slice(-days);
  }, [userFlowData, timeRange]);

  const kpi = overview;

  return (
    <div className="space-y-6">
      {/* ===== KPIs ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !kpi ? (
          <>
            <Skeleton className="h-28 rounded-2xl bg-[var(--color-custume-blue)]/40" />
            <Skeleton className="h-28 rounded-2xl bg-[var(--color-custume-blue)]/40" />
            <Skeleton className="h-28 rounded-2xl bg-[var(--color-custume-blue)]/40" />
            <Skeleton className="h-28 rounded-2xl bg-[var(--color-custume-blue)]/40" />
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
                currency: "MXN",
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

      {/* ===== Chart flujo de usuarios ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] gap-4">
        {/* Card del gráfico */}
        <Card className="bg-[var(--color-dark-blue)]/95 border-[var(--color-custume-blue)]/55 text-[var(--color-custume-light)] rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,.45)]">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-[var(--color-light-blue)]">
                  Flujo de usuarios
                </CardTitle>
                <p className="text-[11px] text-[var(--color-custume-light)]/75">
                  Movimiento de usuarios en la plataforma (hasta últimos 90 días).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={timeRange}
                  onValueChange={(v) =>
                    setTimeRange(v as TimeRange)
                  }
                >
                  <SelectTrigger className="h-8 w-[150px] bg-white/10 border-white/35 text-xs text-white hover:bg-white/15 focus:ring-1 focus:ring-white/40">
                    <SelectValue placeholder="Rango de tiempo" />
                  </SelectTrigger>
                    <SelectContent
                      className="
                        rounded-xl
                        bg-slate-900/95
                        border-white/25
                        text-xs
                        text-[var(--color-custume-light)]
                        shadow-xl
                        backdrop-blur
                      "
                    >
                      <SelectItem
                        value="5d"
                        className="
                          px-3 py-2 cursor-pointer
                          text-[var(--color-custume-light)]
                          data-[highlighted]:bg-white/15
                          data-[state=checked]:bg-white/20
                          data-[highlighted]:text-white
                          data-[state=checked]:text-white
                        "
                      >
                        Últimos 5 días
                      </SelectItem>

                      <SelectItem
                        value="7d"
                        className="
                          px-3 py-2 cursor-pointer
                          text-[var(--color-custume-light)]
                          data-[highlighted]:bg-white/15
                          data-[state=checked]:bg-white/20
                          data-[highlighted]:text-white
                          data-[state=checked]:text-white
                        "
                      >
                        Últimos 7 días
                      </SelectItem>

                      <SelectItem
                        value="30d"
                        className="
                          px-3 py-2 cursor-pointer
                          text-[var(--color-custume-light)]
                          data-[highlighted]:bg-white/15
                          data-[state=checked]:bg-white/20
                          data-[highlighted]:text-white
                          data-[state=checked]:text-white
                        "
                      >
                        Últimos 30 días
                      </SelectItem>

                      <SelectItem
                        value="90d"
                        className="
                          px-3 py-2 cursor-pointer
                          text-[var(--color-custume-light)]
                          data-[highlighted]:bg-white/15
                          data-[state=checked]:bg-white/20
                          data-[highlighted]:text-white
                          data-[state=checked]:text-white
                        "
                      >
                        Últimos 90 días
                      </SelectItem>
                    </SelectContent>

                </Select>
                <TrendingUp className="h-5 w-5 text-[var(--color-light-blue)]" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading && !userFlowData.length ? (
              <Skeleton className="h-56 rounded-xl bg-[var(--color-custume-blue)]/40" />
            ) : filteredUserFlowData.length === 0 ? (
              <p className="text-sm text-[var(--color-custume-light)]/85">
                Todavía no hay datos suficientes para mostrar la serie de usuarios.
              </p>
            ) : (
              <ChartContainer
                config={userFlowChartConfig}
                className="aspect-auto h-64 w-full"
              >
                <AreaChart data={filteredUserFlowData}>
                  <defs>
                    <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#22c55e"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="95%"
                        stopColor="#22c55e"
                        stopOpacity={0.12}
                      />
                    </linearGradient>
                    <linearGradient id="fillNewUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#38bdf8"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="95%"
                        stopColor="#38bdf8"
                        stopOpacity={0.12}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.35)"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    tickFormatter={(value) => {
                      const d = new Date(value as string);
                      if (Number.isNaN(d.getTime())) return value as string;
                      return d.toLocaleDateString("es-CO", {
                        month: "short",
                        day: "2-digit",
                      });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        labelFormatter={(value) => {
                          const d = new Date(value as string);
                          if (Number.isNaN(d.getTime())) return value as string;
                          return d.toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Area
                    dataKey="newUsers"
                    type="natural"
                    name="Nuevos usuarios"
                    fill="url(#fillNewUsers)"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    stackId="a"
                  />
                  <Area
                    dataKey="active"
                    type="natural"
                    name="Usuarios activos"
                    fill="url(#fillActive)"
                    stroke="#22c55e"
                    strokeWidth={2}
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Top ciudades */}
        <Card className="bg-[var(--color-dark-blue)]/95 border-[var(--color-custume-blue)]/55 text-[var(--color-custume-light)] rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,.45)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[var(--color-light-blue)]">
              Top ciudades
            </CardTitle>
            <p className="text-[11px] text-[var(--color-custume-light)]/75">
              Donde más se rentan vehículos.
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {loading && !kpi ? (
              <Skeleton className="h-32 rounded-xl bg-[var(--color-custume-blue)]/40" />
            ) : !kpi || !kpi.topCities || kpi.topCities.length === 0 ? (
              <p className="text-sm text-[var(--color-custume-light)]/85">
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
          currency: "MXN",
          maximumFractionDigits: 0,
        }).format(value)
      : value;

  return (
    <Card className="bg-[var(--color-dark-blue)]/95 border-[var(--color-custume-blue)]/55 text-[var(--color-custume-light)] rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,.4)]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xs font-semibold text-[var(--color-light-blue)]">
          {label}
        </CardTitle>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-custume-blue)]/70">
          <Icon className="h-4 w-4 text-[var(--color-light-blue)]" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-white">{formatted ?? "—"}</p>
        {hint && (
          <p className="mt-1 text-[11px] text-[var(--color-custume-light)]/80">
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
