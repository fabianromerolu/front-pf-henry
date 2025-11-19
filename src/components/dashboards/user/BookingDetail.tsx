"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { Booking } from "@/services/userRenter.service";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import { standardUserApi } from "@/services/userStandar.service";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStatus(status: Booking["status"]) {
  if (status === "active") return "Activa";
  if (status === "complete") return "Completada";
  if (status === "suspended") return "Cancelada";
  return status;
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    standardUserApi
      .getMyBookingById(id)
      .then(setData)
      .catch(() => toast.error("No se pudo cargar la reserva"));
  }, [id]);

  async function handleCancel() {
    if (!data || data.status !== "active") return;
    if (!confirm("¿Cancelar esta reserva?")) return;
    setBusy(true);
    try {
      await standardUserApi.cancelMyBooking(data.id);
      toast.success("Reserva cancelada");
      router.push("/dashboard");
    } catch {
      toast.error("No se pudo cancelar la reserva");
    } finally {
      setBusy(false);
    }
  }

  if (!data) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="taviraj text-xl text-custume-blue">
          Detalle de reserva
        </h2>
        <LightButton
          text="Volver"
          onClick={() => router.back()}
          size="sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light space-y-2 text-sm">
          <h3 className="taviraj text-lg text-custume-blue mb-1">
            Información de la reserva
          </h3>
          <p>
            <span className="font-semibold">Estado: </span>
            {formatStatus(data.status)}
          </p>
          <p>
            <span className="font-semibold">Inicio: </span>
            {formatDateTime(data.startDate)}
          </p>
          <p>
            <span className="font-semibold">Fin: </span>
            {formatDateTime(data.endDate)}
          </p>
          <p>
            <span className="font-semibold">Total: </span>
            COP {data.totalPrice}
          </p>
          {data.paymentStatus && (
            <p>
              <span className="font-semibold">Pago: </span>
              {data.paymentStatus}
            </p>
          )}
          {data.createdAt && (
            <p className="text-xs text-custume-gray">
              Creada el {formatDateTime(data.createdAt)}
            </p>
          )}
        </div>

        <div className="rounded-2xl p-4 shadow-lg bg-white border border-custume-light space-y-2 text-sm">
          <h3 className="taviraj text-lg text-custume-blue mb-1">
            Vehículo
          </h3>
          <p className="font-semibold text-custume-blue">
            {data.pin?.make} {data.pin?.model}
          </p>
          <p className="text-xs text-custume-gray">
            {[
              data.pin?.city,
              data.pin?.state,
              data.pin?.country,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="pt-4 flex gap-2">
            {data.status === "active" && (
              <DarkButton
                text={busy ? "Cancelando..." : "Cancelar reserva"}
                onClick={handleCancel}
                disabled={busy}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
