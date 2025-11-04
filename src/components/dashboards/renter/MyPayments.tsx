"use client";

import React, { useEffect, useState } from "react";
import { renterApi } from "@/services/userRenter.service";
import { toast } from "react-toastify";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import type {
  WalletTransaction,
  Payout,
  Booking,
  Paginated,
} from "@/services/userRenter.service";

// Helper para leer mensaje sin usar any
function apiMsg(e: unknown) {
  const msg =
    (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return msg ?? "Ocurrió un error";
}

export default function MyPayments() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [wallet, setWallet] = useState<Paginated<WalletTransaction> | null>(null);
  const [payouts, setPayouts] = useState<Paginated<Payout> | null>(null);
  const [ownerBookings, setOwnerBookings] = useState<Paginated<Booking> | null>(null);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState("");

  async function load() {
    const [w, p, b] = await Promise.all([
      renterApi.getPayments(page, limit),
      renterApi.listPayouts(1, 10),
      renterApi.getOwnerBookings({ page: 1, limit: 10 }),
    ]);
    setWallet(w);
    setPayouts(p);
    setOwnerBookings(b);
  }

  useEffect(() => {
    load().catch(() => toast.error("No se pudieron cargar los pagos"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handlePayout() {
    const val = Number(amount);
    if (Number.isNaN(val) || val <= 0) {
      toast.error("Monto inválido");
      return;
    }
    setBusy(true);
    try {
      await renterApi.createPayout(val);
      setAmount("");
      await load();
      toast.success("Retiro solicitado");
    } catch (e: unknown) {
      toast.error(apiMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Solicitar retiro */}
      <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
        <h3 className="taviraj text-lg text-custume-blue mb-2">Solicitar retiro</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            placeholder="Monto en COP"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl border px-3 py-2"
          />
          <DarkButton text={busy ? "Procesando..." : "Solicitar"} onClick={handlePayout} disabled={busy} />
        </div>
      </div>

      {/* Wallet history */}
      <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
        <h3 className="taviraj text-lg text-custume-blue mb-2">Wallet (créditos / débitos)</h3>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-custume-gray">
                <th className="py-2">Fecha</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Monto</th>
                <th>Booking</th>
              </tr>
            </thead>
            <tbody>
              {wallet?.data?.map((w) => (
                <tr key={w.id} className="border-t">
                  <td className="py-2">{new Date(w.createdAt).toLocaleString()}</td>
                  <td>{w.type}</td>
                  <td>{w.status}</td>
                  <td>{`COP ${w.amount}`}</td>
                  <td>{w.bookingId ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-2">
          <LightButton text="Prev" onClick={() => setPage((p) => Math.max(1, p - 1))} />
          <DarkButton text="Next" onClick={() => setPage((p) => p + 1)} />
        </div>
      </div>

      {/* Payouts */}
      <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
        <h3 className="taviraj text-lg text-custume-blue mb-2">Retiros</h3>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-custume-gray">
                <th className="py-2">Fecha</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {payouts?.data?.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{new Date(p.createdAt).toLocaleString()}</td>
                  <td>{`COP ${p.amount}`}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner bookings (ingresos) */}
      <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light">
        <h3 className="taviraj text-lg text-custume-blue mb-2">Reservas de mis vehículos</h3>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-custume-gray">
                <th className="py-2">Fecha</th>
                <th>Vehículo</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Pago</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ownerBookings?.data?.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="py-2">{new Date(b.createdAt ?? b.startDate).toLocaleString()}</td>
                  <td>{b.pin?.title ?? `${b.pin?.make ?? ""} ${b.pin?.model ?? ""}`}</td>
                  <td>{b.user?.name ?? b.user?.email ?? "-"}</td>
                  <td>{b.status}</td>
                  <td>{b.paymentStatus}</td>
                  <td>{`COP ${b.totalPrice}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
