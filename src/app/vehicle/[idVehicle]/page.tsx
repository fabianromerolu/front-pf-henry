"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import VehicleDetail from "@/components/VehicleDetail/VehicleDetail";
import { useVehicles } from "@/context/VehiclesContext";

export default function Page() {
  const params = useParams();
  const { vehicles, loading, error } = useVehicles();

  const vehicle = useMemo(() => {
    if (!params.idVehicle || !vehicles.length) return null;
    return vehicles.find((v) => v.id.toString() === params.idVehicle);
  }, [vehicles, params.idVehicle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-custume-blue">Cargando vehículo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-gray-500">Vehículo no encontrado</div>
      </div>
    );
  }

  return <VehicleDetail vehicle={vehicle} />;
}
