"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useVehicles } from "@/context/VehicleContext";
import VehicleProps from "@/interfaces/vehicleProps";
import Link from "next/link";
import VehicleDetail from "@/components/VehicleDetail/VehicleDetail";

export default function VehicleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { getVehicle } = useVehicles();
  const [vehicle, setVehicle] = useState<VehicleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const vehicleData = await getVehicle(id);

        if (vehicleData) {
          setVehicle(vehicleData);
        } else {
          setError("Vehículo no encontrado");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el vehículo"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetail();
  }, [id, getVehicle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-custume-light">
        <div className="text-2xl text-custume-blue">Cargando vehículo...</div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-custume-light">
        <div className="text-2xl text-red-500 mb-4">
          {error || "Vehículo no encontrado"}
        </div>
        <Link
          href="/vehicles"
          className="text-custume-blue hover:underline text-lg"
        >
          Volver a vehículos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custume-light">
      <VehicleDetail vehicle={vehicle} />
    </div>
  );
}
