"use client";

import React, { useEffect } from "react";
import VehicleCard from "@/components/cards/vehicleCard";
import { useVehicles } from "@/context/VehicleContext";
import MenuBar from "@/components/MenuBar/MenuBar";
import Pagination from "@/components/pagination/Pagination";

export default function VehiclesPage() {
  const {
    vehicles,
    loading,
    error,
    page,
    limit,
    total,
    hasNextPage,
    nextPage,
    prevPage,
    goToPage,
  } = useVehicles();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
    <div className="min-h-screen bg-custume-light">
      <MenuBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-custume-light mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
            <div className="w-3 h-3 bg-custume-red rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl taviraj font-semibold text-custume-red mb-2 text-center">
            Todos nuestros vehículos
          </h1>
          <p className="text-custume-blue text-center text-base sm:text-lg">
            Explora nuestra flota completa de {total} vehículos disponibles
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-custume-gray text-lg">
              No hay vehículos disponibles en este momento
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalItems={total}
              itemsPerPage={limit}
              hasNextPage={hasNextPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
              onGoToPage={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
