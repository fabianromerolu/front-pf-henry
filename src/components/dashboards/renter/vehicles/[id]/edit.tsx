"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { myVehiclesApi, meApi } from "@/services/userRenter.service";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import LightButton from "@/components/Buttoms/LightButtom";
import DarkButton from "@/components/Buttoms/DarkButtom";
import type { UpdatePinInput, PinDetail } from "@/services/userRenter.service";

const input = "w-full rounded-xl border px-3 py-2";

/**
 * Corrige tipos para que coincidan con lo que el form realmente maneja:
 * - pricePerDay: number (el input es numérico y en el patch va como number)
 * - description/rules: string (textarea no acepta null)
 */
type EditablePin = Omit<
  Pick<
    PinDetail,
    | "make"
    | "model"
    | "year"
    | "bodyType"
    | "category"
    | "transmission"
    | "fuel"
    | "seats"
    | "city"
    | "state"
    | "country"
  > &
    Pick<PinDetail, never>,
  never
> & {
  pricePerDay: number;
  description: string;
  rules: string;
  photos: { url: string; isCover?: boolean }[];
};

function apiMsg(e: unknown) {
  const msg =
    (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return msg ?? "Ocurrió un error";
}

export default function EditVehicle() {
  const { id } = useParams<{ id: string }>();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<EditablePin | null>(null);

  function patch<K extends keyof EditablePin>(k: K, v: EditablePin[K]) {
    setForm((s) => (s ? { ...s, [k]: v } : s));
  }

  async function uploadImage(file: File) {
    const sig = await meApi.getUploadSignature(`pins/${id}`);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.apiKey);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("folder", sig.folder);
    fd.append("signature", sig.signature);
    const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
    const res = await fetch(url, { method: "POST", body: fd });
    const json = await res.json();
    if (!json?.secure_url) throw new Error("Upload failed");
    return json.secure_url as string;
  }

  useEffect(() => {
    if (!id) return;
    myVehiclesApi
      .getPinPublic(id)
      .then((d) =>
        setForm({
          make: d.make,
          model: d.model,
          year: Number(d.year),
          bodyType: d.bodyType,
          category: d.category,
          transmission: d.transmission,
          fuel: d.fuel,
          seats: Number(d.seats),
          // d.pricePerDay viene como string en PinDetail → lo convertimos a number para el form
          pricePerDay: Number(d.pricePerDay),
          city: d.city,
          state: d.state,
          country: d.country,
          description: d.description ?? "",
          rules: d.rules ?? "",
          photos: d.photos?.map((p) => ({ url: p.url })) ?? [],
        })
      )
      .catch(() => toast.error("No se pudo cargar el vehículo"));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form) return;
    setBusy(true);
    try {
      const patchPayload: UpdatePinInput = {
        make: form.make,
        model: form.model,
        year: form.year,
        bodyType: form.bodyType as UpdatePinInput["bodyType"],
        category: form.category as UpdatePinInput["category"],
        transmission: form.transmission as UpdatePinInput["transmission"],
        fuel: form.fuel as UpdatePinInput["fuel"],
        seats: form.seats,
        pricePerDay: Number(form.pricePerDay ?? 0),
        city: form.city,
        state: form.state,
        country: form.country,
        description: form.description,
        rules: form.rules,
        photos: form.photos,
      };
      await myVehiclesApi.updatePin(id, patchPayload);
      toast.success("Guardado");
    } catch (e: unknown) {
      toast.error(apiMsg(e));
    } finally {
      setBusy(false);
    }
  }

  if (!form) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      <h2 className="taviraj text-xl text-custume-blue">Editar vehículo</h2>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-custume-gray">Make</label>
          <input className={input} value={form.make} onChange={(e) => patch("make", e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-custume-gray">Model</label>
          <input className={input} value={form.model} onChange={(e) => patch("model", e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-custume-gray">Year</label>
          <input
            type="number"
            className={input}
            value={form.year}
            onChange={(e) => patch("year", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm text-custume-gray">Body Type</label>
          <select
            className={input}
            value={form.bodyType}
            onChange={(e) => patch("bodyType", e.target.value as EditablePin["bodyType"])}
          >
            {["SEDAN", "HATCHBACK", "SUV", "PICKUP", "VAN", "COUPE", "CONVERTIBLE"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Category</label>
          <select
            className={input}
            value={form.category}
            onChange={(e) => patch("category", e.target.value as EditablePin["category"])}
          >
            {["ECONOMY", "COMPACT", "MIDSIZE", "SUV", "PICKUP", "VAN", "PREMIUM", "ELECTRIC"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Transmission</label>
          <select
            className={input}
            value={form.transmission}
            onChange={(e) => patch("transmission", e.target.value as EditablePin["transmission"])}
          >
            {["MANUAL", "AUTOMATIC"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Fuel</label>
          <select
            className={input}
            value={form.fuel}
            onChange={(e) => patch("fuel", e.target.value as EditablePin["fuel"])}
          >
            {["GASOLINE", "DIESEL", "HYBRID", "ELECTRIC"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Seats</label>
          <input
            type="number"
            className={input}
            value={form.seats}
            onChange={(e) => patch("seats", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm text-custume-gray">Price/day (COP)</label>
          <input
            type="number"
            className={input}
            value={form.pricePerDay}
            onChange={(e) => patch("pricePerDay", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm text-custume-gray">City</label>
          <input className={input} value={form.city} onChange={(e) => patch("city", e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-custume-gray">State</label>
          <input className={input} value={form.state} onChange={(e) => patch("state", e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-custume-gray">Country</label>
          <input className={input} value={form.country} onChange={(e) => patch("country", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-custume-gray">Description</label>
          <textarea
            rows={3}
            className={input}
            value={form.description}
            onChange={(e) => patch("description", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-custume-gray">Rules</label>
          <textarea
            rows={2}
            className={input}
            value={form.rules}
            onChange={(e) => patch("rules", e.target.value)}
          />
        </div>

        {/* Fotos */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex gap-2 flex-wrap">
            {form.photos?.map((p, i) => (
              <div key={i} className="w-40">
                <div className="relative w-full h-24">
                  <Image src={p.url} alt={`p-${i}`} fill sizes="160px" className="object-cover rounded-xl border" />
                </div>
                <button
                  type="button"
                  className="text-sm text-custume-red underline"
                  onClick={() => patch("photos", form.photos.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const url = await uploadImage(f);
                  patch("photos", [...(form.photos ?? []), { url }]);
                } catch {
                  toast.error("No se pudo subir");
                }
              }}
            />
            <LightButton text="Add image" />
          </label>
        </div>

        <div className="md:col-span-2 flex gap-2">
          <DarkButton text={busy ? "Guardando..." : "Guardar"} type="submit" disabled={busy} />
        </div>
      </form>
    </div>
  );
}
