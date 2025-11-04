"use client";

import React, { useState } from "react";
import Image from "next/image";
import { myVehiclesApi, meApi } from "@/services/userRenter.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import DarkButton from "@/components/Buttoms/DarkButtom";

const input = "w-full rounded-xl border px-3 py-2";

// Reutiliza el tipo del parámetro de createPin sin duplicarlo
type CreatePinPayload = Parameters<typeof myVehiclesApi.createPin>[0];

function apiMsg(e: unknown) {
  const msg =
    (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return msg ?? "Ocurrió un error";
}

export default function NewVehicle() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState<CreatePinPayload>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    bodyType: "SEDAN",
    category: "ECONOMY",
    transmission: "AUTOMATIC",
    fuel: "GASOLINE",
    seats: 5,
    pricePerDay: 0,
    city: "",
    state: "",
    country: "",
    description: "",
    rules: "",
    photos: [],
  });

  function patch<K extends keyof CreatePinPayload>(k: K, v: CreatePinPayload[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function uploadImage(file: File) {
    const sig = await meApi.getUploadSignature(`pins/new`);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await myVehiclesApi.createPin(form);
      toast.success("Vehículo creado en borrador");
      router.push(`/dashboard/renter/vehicles/${created.id}/edit`);
    } catch (e: unknown) {
      toast.error(apiMsg(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="taviraj text-xl text-custume-blue">Publicar nuevo vehículo</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <select className={input} value={form.bodyType} onChange={(e) => patch("bodyType", e.target.value as CreatePinPayload["bodyType"])}>
            {["SEDAN","HATCHBACK","SUV","PICKUP","VAN","COUPE","CONVERTIBLE"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Category</label>
          <select className={input} value={form.category} onChange={(e) => patch("category", e.target.value as CreatePinPayload["category"])}>
            {["ECONOMY","COMPACT","MIDSIZE","SUV","PICKUP","VAN","PREMIUM","ELECTRIC"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Transmission</label>
          <select className={input} value={form.transmission} onChange={(e) => patch("transmission", e.target.value as CreatePinPayload["transmission"])}>
            {["MANUAL","AUTOMATIC"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Fuel</label>
          <select className={input} value={form.fuel} onChange={(e) => patch("fuel", e.target.value as CreatePinPayload["fuel"])}>
            {["GASOLINE","DIESEL","HYBRID","ELECTRIC"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-custume-gray">Seats</label>
          <input type="number" className={input} value={form.seats ?? 0} onChange={(e) => patch("seats", Number(e.target.value))} />
        </div>
        <div>
          <label className="text-sm text-custume-gray">Price per day (COP)</label>
          <input type="number" className={input} value={form.pricePerDay} onChange={(e) => patch("pricePerDay", Number(e.target.value))} />
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
          <textarea rows={3} className={input} value={form.description ?? ""} onChange={(e) => patch("description", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-custume-gray">Rules</label>
          <textarea rows={2} className={input} value={form.rules ?? ""} onChange={(e) => patch("rules", e.target.value)} />
        </div>

        {/* Upload simple (foto cover) */}
        <div className="md:col-span-2">
          <label className="text-sm text-custume-gray">Cover image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const url = await uploadImage(f);
                patch("photos", [{ url, isCover: true }]);
                toast.success("Imagen subida");
              } catch {
                toast.error("No se pudo subir la imagen");
              }
            }}
          />
          {form.photos?.[0]?.url && (
            <div className="relative mt-2 w-full max-w-xl h-64">
              <Image src={form.photos[0].url} alt="cover" fill sizes="(max-width: 768px) 100vw, 640px" className="rounded-xl border object-cover" />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <DarkButton text={busy ? "Guardando..." : "Crear"} type="submit" disabled={busy} />
        </div>
      </form>
    </div>
  );
}
