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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-custume-light via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-light-blue/5 to-transparent"></div>
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border border-gray-200">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-custume-blue/30 border-t-custume-blue rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-light-blue rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1s",
                  }}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold bg-gradient-to-r from-custume-blue via-dark-blue to-custume-blue bg-clip-text text-transparent mb-2">
                  Cargando vehículo...
                </div>
                <div className="text-sm text-gray-500">
                  Por favor espera un momento
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-custume-light via-white to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-custume-red/5 to-transparent"></div>
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border border-red-100 max-w-md">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-custume-red rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
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
              <div className="text-center">
                <div className="text-2xl font-semibold text-red-600 mb-2">
                  {error || "Vehículo no encontrado"}
                </div>
                <div className="text-sm text-gray-600 mb-6">
                  No pudimos encontrar el vehículo que buscas
                </div>
                <Link
                  href="/vehicles"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-custume-blue to-dark-blue text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
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
                  Volver a vehículos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-custume-light via-white to-blue-50">
      <div className="absolute inset-0 bg-gradient-to-tr from-light-blue/5 to-transparent pointer-events-none"></div>
      <div className="relative">
        <VehicleDetail vehicle={vehicle} />
      </div>
    </div>
  );
}
