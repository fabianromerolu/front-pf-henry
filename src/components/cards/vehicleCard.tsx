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
          <Image
            fill
            src={vehicle.thumbnailUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
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
