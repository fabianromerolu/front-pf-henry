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
    <div className="block">
      <div className="group relative w-full max-w-[380px] h-auto bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl rounded-2xl shadow-lg p-4 mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-custume-blue montserrat text-4xl font-bold lowercase mb-0">
              {vehicle.make}
            </h4>
            <h3 className="text-custume-blue montserrat text-3xl font-medium lowercase mb-0">
              {vehicle.model}
            </h3>
          </div>
        </div>

        <Link
          href={`/vehicles/${vehicle.id}`}
          className="block relative w-full h-[240px] overflow-hidden mb-6 bg-gray-50"
        >
          <Image
            fill
            src={vehicle.thumbnailUrl}
            alt={vehicle.model}
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 380px) 100vw, 380px"
            priority
          />
        </Link>

        <div className="mb-5 text-gray-400 montserrat text-xl">
          Precio por día
          <span className="text-custume-blue"> ${vehicle.pricePerDay}</span>
        </div>

        <div className="flex flex-col gap-3">
          <DarkButtom
            className="w-full py-4 rounded-full text-xl lowercase"
            text="rentar ahora"
            onClick={handleRentNow}
          />
          <LightButtom
            className="w-full py-4 rounded-full text-xl lowercase"
            text="ver detalles"
            onClick={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
