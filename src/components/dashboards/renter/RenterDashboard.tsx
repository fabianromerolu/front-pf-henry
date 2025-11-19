// src/components/dashboards/renter/RenterDashboard.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { renterApi } from "@/services/userRenter.service";
import MyVehicles from "./vehicles/MyVehicles";
import MyPayments from "./MyPayments";
import MyProfile from "./MyProfile";
import ReactECharts from "echarts-for-react";
import LightButton from "@/components/Buttoms/LightButtom";
import DarkButton from "@/components/Buttoms/DarkButtom";
import { useAuth } from "@/context/AuthContext";
import { FiLogOut } from "react-icons/fi";

type TabKey = "vehicles" | "payments" | "profile";

const kpiCard = "rounded-2xl p-4 shadow-lg bg-white border border-custume-light";
const tabBtn = "px-4 py-2 rounded-full border transition-all taviraj text-sm md:text-base";
const active = "bg-custume-blue text-light-blue border-custume-blue shadow";
const inactive = "bg-light-blue text-custume-blue border-light-blue hover:bg-custume-blue hover:text-light-blue";

export default function RenterDashboard() {
  const [tab, setTab] = useState<TabKey>("vehicles");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<{
    pins: { total: number; published: number; blocked: number };
    revenueLast30d: string;
    revenuePending: string;
  } | null>(null);
  const [balance, setBalance] = useState<{ available: string; pending: string; currency: "MXN" } | null>(null);

  // === Auth: para cerrar sesión y mostrar quién está logueado ===
  const { user, logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const [ov, bal] = await Promise.all([renterApi.getOverview(), renterApi.getBalance()]);
        setOverview(ov);
        setBalance(bal);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chartOption = useMemo(() => {
    const published = overview?.pins.published ?? 0;
    const blocked = overview?.pins.blocked ?? 0;
    const other = Math.max((overview?.pins.total ?? 0) - published - blocked, 0);

    return {
      tooltip: { trigger: "item" },
      legend: { top: "bottom" },
      series: [
        {
          name: "Vehicles",
          type: "pie",
          radius: ["30%", "65%"],
          avoidLabelOverlap: false,
          label: { show: true, formatter: "{b}: {c}" },
          data: [
            { value: published, name: "Published" },
            { value: blocked, name: "Blocked" },
            { value: other, name: "Draft/Pause" },
          ],
        },
      ],
    };
  }, [overview]);

  return (
    <div className="animate-fade-slide space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="taviraj text-2xl md:text-3xl text-custume-blue">Renter Dashboard</h1>
          <p className="hind text-custume-gray">
            {user ? (
              <>
                Hola, <span className="font-semibold text-custume-blue">{user.name}</span>{" "}
                <span className="text-xs text-custume-gray">({user.role ?? "user"})</span>
              </>
            ) : (
              "Controla tus vehículos, pagos y perfil."
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <LightButton text="New Vehicle" href="/dashboard/renter/vehicles/new" size="md" />
          <DarkButton text="Refresh" onClick={() => location.reload()} size="md" />
          {/* Botón Cerrar sesión */}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
                       bg-white hover:bg-light-blue text-custume-red border-custume-light transition"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <FiLogOut />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Vehicles</div>
          <div className="text-2xl taviraj text-custume-blue">{loading ? "…" : overview?.pins.total ?? 0}</div>
        </div>
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Published</div>
          <div className="text-2xl taviraj text-custume-blue">{loading ? "…" : overview?.pins.published ?? 0}</div>
        </div>
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Revenue (30d)</div>
          <div className="text-2xl taviraj text-custume-blue">
            {loading ? "…" : `MXN ${overview?.revenueLast30d ?? "0"}`}
          </div>
        </div>
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Available</div>
          <div className="text-2xl taviraj text-custume-blue">
            {loading ? "…" : `MXN ${balance?.available ?? "0"}`}
          </div>
        </div>
      </section>

      {/* Chart + Pending */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
          <h3 className="taviraj text-lg text-custume-blue mb-2">Fleet status</h3>
          <ReactECharts option={chartOption} notMerge lazyUpdate />
        </div>
        <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
          <h3 className="taviraj text-lg text-custume-blue">Pending revenue</h3>
          <p className="mt-2 text-2xl">{loading ? "…" : `MXN ${overview?.revenuePending ?? "0"}`}</p>
          <p className="text-sm text-custume-gray">Se libera cuando pasan los días de hold.</p>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex gap-2">
        <button className={`${tabBtn} ${tab === "vehicles" ? active : inactive}`} onClick={() => setTab("vehicles")}>
          Vehicles
        </button>
        <button className={`${tabBtn} ${tab === "payments" ? active : inactive}`} onClick={() => setTab("payments")}>
          My Payments
        </button>
        <button className={`${tabBtn} ${tab === "profile" ? active : inactive}`} onClick={() => setTab("profile")}>
          My Profile
        </button>
      </nav>

      {/* Content */}
      <section className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
        {tab === "vehicles" && <MyVehicles />}
        {tab === "payments" && <MyPayments />}
        {tab === "profile" && <MyProfile />}
      </section>
    </div>
  );
}
