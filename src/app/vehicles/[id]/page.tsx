"use client";

import React from "react";
import VehicleCard from "@/components/cards/vehicleCard";
import { useVehicles } from "@/context/VehicleContext";
import MenuBar from "@/components/MenuBar/MenuBar";

export default function VehiclesPage() {
  const { vehicles, loading, error } = useVehicles();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-custume-blue">Cargando vehículos...</div>
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

  return (
    <div className="min-h-screen bg-custume-light mt-18">
      <div className="bg-custume-light py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
            <div className="w-3 h-3 bg-custume-red rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
          </div>
        </div>
      </div>
      <MenuBar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-custume-light py-6">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
              <div className="w-3 h-3 bg-custume-red rounded-full"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-4xl taviraj font-semibold text-custume-red mb-2 text-center">
            Todos nuestros vehículos
          </h1>
          <p className="text-custume-blue text-center text-lg">
            Explora nuestra flota completa de {vehicles.length} vehículos
            disponibles
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-custume-gray text-lg">
              No hay vehículos disponibles en este momento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
