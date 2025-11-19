//src/components/dashboards/renter/vehicles/[id]/VehicleDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { myVehiclesApi } from "@/services/userRenter.service";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { PinDetail } from "@/services/userRenter.service";

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PinDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    myVehiclesApi.getPinPublic(id).then(setData).catch(() => {});
  }, [id]);

  if (!data) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="taviraj text-xl text-custume-blue">{`${data.make} ${data.model}`}</h2>
        <Link className="underline text-custume-blue" href={`/dashboard/renter/vehicles/${id}/edit`}>
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {data.photos?.map((p, i) => (
            <div key={i} className="relative w-full h-64">
              <Image src={p.url} alt={`photo-${i}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="rounded-xl border object-cover" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div><b>Body</b>: {data.bodyType}</div>
          <div><b>Category</b>: {data.category}</div>
          <div><b>Transmission</b>: {data.transmission}</div>
          <div><b>Fuel</b>: {data.fuel}</div>
          <div><b>Seats</b>: {data.seats}</div>
          <div><b>Price/day</b>: MXN {data.pricePerDay}</div>
          <div><b>Location</b>: {`${data.city}, ${data.state}, ${data.country}`}</div>
          {data.rules && <div><b>Rules</b>: {data.rules}</div>}
          {data.description && <div><b>Description</b>: {data.description}</div>}
          <div><b>Status</b>: {data.status}</div>
        </div>
      </div>
    </div>
  );
}
