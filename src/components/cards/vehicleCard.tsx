"use client";

import Image from "next/image";
import Link from "next/link";
import vehicleProps from "@/interfaces/vehicleProps";
import DarkButton from "../Buttoms/DarkButtom";
import LightButton from "../Buttoms/LightButtom";

interface CardProps {
  vehicle: vehicleProps;
}

export const VehicleCard = ({ vehicle }: CardProps) => {
  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group relative w-full max-w-[380px] h-auto bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-lg p-4 cursor-pointer mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-dark-blue montserrat text-4xl font-bold lowercase mb-0">
              {vehicle.make}
            </h4>
            <h3 className="text-dark-blue montserrat text-3xl font-medium lowercase mb-0">
              {vehicle.model}
            </h3>
          </div>
          <div className="text-gray-400 montserrat text-3xl">
            ${vehicle.pricePerHour}
          </div>
        </div>

        <div className="relative w-full h-[240px] overflow-hidden mb-6 bg-gray-50">
          <Image
            fill
            src={vehicle.photo}
            alt={vehicle.title}
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 380px) 100vw, 380px"
          />
        </div>

        <div className="flex justify-around items-center mb-8">
          {/* Aquí van los iconos */}
        </div>

        <div className="flex flex-col gap-3">
          <DarkButton
            className="w-full py-4 rounded-full text-xl lowercase"
            text="rent now"
          />
          <LightButton
            className="w-full py-4 rounded-full text-xl lowercase"
            text="see details"
          />
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
