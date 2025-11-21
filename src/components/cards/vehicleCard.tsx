"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkButtom from "../Buttoms/DarkButtom";
import LightButtom from "../Buttoms/LightButtom";
import vehicleProps from "@/interfaces/vehicleProps";
import Image from "next/image";

interface CardProps {
  vehicle: vehicleProps;
}

export const VehicleCard = ({ vehicle }: CardProps) => {
  const router = useRouter();

  const handleRentNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/booking?vehicleId=${vehicle.id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/vehicles/${vehicle.id}`);
  };

  return (
    <div className="w-full">
      <div className="group relative w-full bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl rounded-xl shadow-lg p-3 flex flex-col h-full">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-custume-blue montserrat text-base sm:text-lg md:text-xl font-bold lowercase truncate">
              {vehicle.make}
            </h4>
            <h3 className="text-custume-blue montserrat text-sm sm:text-base md:text-lg font-medium lowercase truncate">
              {vehicle.model}
            </h3>
          </div>
        </div>

        {/* IMAGE */}
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="block relative w-full aspect-[4/3] overflow-hidden mb-3 bg-gray-50 rounded-lg"
        >
          <div className="relative w-full h-48 bg-custume-light rounded-xl overflow-hidden mb-4">
            {vehicle.thumbnailUrl ? (
              <Image
                src={vehicle.thumbnailUrl}
                alt={vehicle.model}
                fill // ✅ Usa fill para que se adapte al contenedor
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-custume-gray"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            )}
          </div>
        </Link>

        {/* PRICE */}
        <div className="mb-3 text-gray-400 montserrat text-xs sm:text-sm md:text-base">
          Precio por día
          <span className="text-custume-blue font-semibold">
            {" "}
            ${vehicle.pricePerDay.toLocaleString()}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-2 mt-auto">
          <DarkButtom
            className="!w-full !min-w-0 py-2 sm:py-2.5  rounded-full text-xs sm:text-sm md:text-base lowercase"
            text="rentar ahora"
            onClick={handleRentNow}
          />
          <LightButtom
            className="!w-full !min-w-0 py-2 sm:py-2.5  rounded-full text-xs sm:text-sm md:text-base lowercase"
            text="ver detalles"
            onClick={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
