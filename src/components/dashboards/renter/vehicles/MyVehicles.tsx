"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { myVehiclesApi } from "@/services/userRenter.service";
import Link from "next/link";
import { toast } from "react-toastify";
import LightButton from "@/components/Buttoms/LightButtom";
import DarkButton from "@/components/Buttoms/DarkButtom";
import type { PinSummary } from "@/services/userRenter.service";

function apiMsg(e: unknown) {
  const msg =
    (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return msg ?? "Ocurrió un error";
}

export default function MyVehicles() {
  const [data, setData] = useState<PinSummary[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const rows = await myVehiclesApi.listMine({ page: 1, limit: 50 });
    setData(rows);
  }

  useEffect(() => {
    load().catch(() => toast.error("No se pudieron cargar tus vehículos"));
  }, []);

  async function setStatus(id: string, status: "PUBLISHED" | "PAUSED" | "BLOCKED") {
    setBusyId(id);
    try {
      await myVehiclesApi.setStatus(id, status);
      toast.success(`Status → ${status}`);
      await load();
    } catch (e: unknown) {
      toast.error(apiMsg(e));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar vehículo?")) return;
    setBusyId(id);
    try {
      await myVehiclesApi.deletePin(id);
      toast.success("Vehículo eliminado");
      await load();
    } catch (e: unknown) {
      toast.error(apiMsg(e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="taviraj text-lg text-custume-blue">My Vehicles</h3>
        <LightButton text="Add new" href="/dashboard/renter/vehicles/new" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((v) => (
          <div key={v.id} className="rounded-2xl shadow bg-white border border-custume-light overflow-hidden">
            <div className="relative aspect-video bg-custume-light">
              <Image
                src={
                  v.photos?.[0]?.url ??
                  `https://via.placeholder.com/600x400?text=${encodeURIComponent(v.make)}+${encodeURIComponent(v.model)}`
                }
                alt={v.model}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-3 space-y-2">
              <div className="taviraj text-custume-blue">{`${v.make} ${v.model} ${v.year}`}</div>
              <div className="text-sm text-custume-gray">COP {v.pricePerDay ?? "-"} / día</div>
              <div className="flex gap-2 flex-wrap">
                <Link className="underline text-custume-blue" href={`/dashboard/renter/vehicles/${v.id}`}>Details</Link>
                <Link className="underline text-custume-blue" href={`/dashboard/renter/vehicles/${v.id}/edit`}>Edit</Link>
              </div>

              <div className="flex gap-2 flex-wrap pt-2">
                <DarkButton
                  text="Publish"
                  size="sm"
                  disabled={busyId === v.id}
                  onClick={() => setStatus(v.id, "PUBLISHED")}
                />
                <LightButton
                  text="Pause"
                  size="sm"
                  onClick={() => setStatus(v.id, "PAUSED")}
                />
                <LightButton
                  text="Block"
                  size="sm"
                  onClick={() => setStatus(v.id, "BLOCKED")}
                />
                <button
                  className="text-custume-red text-sm underline"
                  onClick={() => remove(v.id)}
                  disabled={busyId === v.id}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-custume-gray">Aún no tienes vehículos. ¡Crea el primero!</div>
        )}
      </div>
    </div>
  );
}
