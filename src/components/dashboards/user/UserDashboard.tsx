//src/components/dashboards/user/UserDashboard.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

import { standardUserApi, StandardUserOverview } from "@/services/userStandar.service";
import MyBookings from "./MyBookings";
import UserProfile from "./UserProfile";

type TabKey = "bookings" | "profile";

const kpiCard =
  "rounded-2xl p-4 shadow-lg bg-white border border-custume-light";
const tabBtn =
  "px-4 py-2 rounded-full border transition-all taviraj text-sm md:text-base";
const active =
  "bg-custume-blue text-light-blue border-custume-blue shadow";
const inactive =
  "bg-light-blue text-custume-blue border-light-blue hover:bg-custume-blue hover:text-light-blue";

export default function UserDashboard() {
  const [tab, setTab] = useState<TabKey>("bookings");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<StandardUserOverview | null>(null);

  const { user, logout } = useAuth();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const ov = await standardUserApi.getOverview();
        if (!cancelled) setOverview(ov);
      } catch (e) {
        console.error("[UserDashboard] overview error", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  const spentFormatted = useMemo(() => {
    const value = Number(overview?.spentLast30d ?? 0);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value || 0);
  }, [overview?.spentLast30d]);

  const nextBooking = overview?.nextBooking ?? null;

  return (
    <div className="animate-fade-slide space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="taviraj text-2xl md:text-3xl text-custume-blue">
            Mi panel
          </h1>
          <p className="hind text-custume-gray text-sm">
            {user ? (
              <>
                Hola,{" "}
                <span className="font-semibold text-custume-blue">
                  {user.name}
                </span>{" "}
                <span className="text-xs text-custume-gray">
                  ({user.role ?? "user"})
                </span>
              </>
            ) : (
              "Revisa tus reservas, próximos viajes y tu perfil."
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
          <div className="text-custume-gray text-sm">Reservas totales</div>
          <div className="text-2xl taviraj text-custume-blue">
            {loading ? "…" : overview?.bookingsTotal ?? 0}
          </div>
        </div>
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Reservas activas</div>
          <div className="text-2xl taviraj text-custume-blue">
            {loading ? "…" : overview?.bookingsActive ?? 0}
          </div>
        </div>
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Reservas completadas</div>
          <div className="text-2xl taviraj text-custume-blue">
            {loading ? "…" : overview?.bookingsComplete ?? 0}
          </div>
        </div>
        <div className={kpiCard}>
          <div className="text-custume-gray text-sm">Gastado (últimos 30d)</div>
          <div className="text-2xl taviraj text-custume-blue">
            {loading ? "…" : spentFormatted}
          </div>
        </div>
      </section>

      {/* Próxima reserva */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
          <h3 className="taviraj text-lg text-custume-blue">
            Próxima reserva
          </h3>
          {loading ? (
            <p className="mt-2 text-custume-gray text-sm">Cargando…</p>
          ) : !nextBooking ? (
            <p className="mt-2 text-custume-gray text-sm">
              Aún no tienes reservas futuras. ¡Explora vehículos y reserva tu
              próximo viaje!
            </p>
          ) : (
            <div className="mt-3 space-y-1 text-sm text-custume-gray">
              <p className="font-semibold text-custume-blue">
                {nextBooking.pin.make} {nextBooking.pin.model}
              </p>
              <p>
                {new Date(nextBooking.startDate).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                –{" "}
                {new Date(nextBooking.endDate).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs">
                {[
                  nextBooking.pin.city,
                  nextBooking.pin.state,
                  nextBooking.pin.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
          <h3 className="taviraj text-lg text-custume-blue">
            Resumen rápido
          </h3>
          <ul className="mt-2 text-sm text-custume-gray space-y-1">
            <li>
              <span className="font-semibold text-custume-blue">
                {overview?.bookingsActive ?? 0}
              </span>{" "}
              reservas en curso
            </li>
            <li>
              <span className="font-semibold text-custume-blue">
                {overview?.bookingsComplete ?? 0}
              </span>{" "}
              viajes completados
            </li>
            <li>
              <span className="font-semibold text-custume-blue">
                {overview?.bookingsTotal ?? 0}
              </span>{" "}
              reservas en total
            </li>
          </ul>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex gap-2">
        <button
          className={`${tabBtn} ${
            tab === "bookings" ? active : inactive
          }`}
          onClick={() => setTab("bookings")}
        >
          Mis reservas
        </button>
        <button
          className={`${tabBtn} ${
            tab === "profile" ? active : inactive
          }`}
          onClick={() => setTab("profile")}
        >
          Mi perfil
        </button>
      </nav>

      {/* Content */}
      <section className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
        {tab === "bookings" && <MyBookings />}
        {tab === "profile" && <UserProfile />}
      </section>
    </div>
  );
}
