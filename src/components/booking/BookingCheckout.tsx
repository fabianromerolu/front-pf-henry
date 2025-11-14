"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getVehicleById } from "@/services/vehicleService.service";
import VehicleProps from "@/interfaces/vehicleProps";
import Link from "next/link";
import RenderVehicle from "./RenderVehicle";
import BookingForm from "./BookingForm";

export default function BookingCheckout() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState<VehicleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) {
        setError("No se especificó un vehículo");
        setLoading(false);
        return;
      }

      try {
        const vehicleData = await getVehicleById(vehicleId);
        setVehicle(vehicleData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el vehículo"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-custume-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-custume-blue text-lg">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-custume-blue mb-2">
              RESERVA DE VEHÍCULO
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-custume-red to-custume-orange rounded-full"></div>
          </div>

          <div className="bg-white border border-custume-blue/20 rounded-2xl p-8 sm:p-12 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-custume-blue mb-4">
              {error || "Vehículo no encontrado"}
            </h2>
            <p className="text-custume-gray mb-8 text-sm sm:text-base">
              Por favor selecciona un vehículo para continuar con tu reserva
            </p>
            <Link
              href="/vehicles"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-custume-blue text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-dark-blue hover:scale-105 transition-all duration-300 shadow-lg"
            >
              VER VEHÍCULOS DISPONIBLES
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custume-light p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-custume-red">
              RESERVA DE VEHÍCULO
            </h1>
            <Link
              href="/vehicles"
              className="text-custume-orange hover:text-custume-red transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Volver a vehículos</span>
            </Link>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-custume-red to-custume-orange rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <RenderVehicle vehicle={vehicle} />
          </div>

          <div className="w-full lg:w-2/3">
            <BookingForm
              vehicleId={vehicle.id.toString()}
              vehicleName={vehicle.model}
              vehiclePrice={vehicle.pricePerDay || 0}
              vehicleImage={vehicle.thumbnailUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
