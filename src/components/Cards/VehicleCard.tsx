"use client";
import Image from "next/image";
import Link from "next/link";
import DarkButtom from "../Buttoms/DarkButtom";
import LightButtom from "../Buttoms/LightButtom";
import vehicleItems from "@/Interfaces/vehicleItems";



interface CardProps {
  vehicle: vehicleItems;
}

export const VehicleCard = ({ vehicle }: CardProps) => {
  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group relative w-full max-w-[380px] h-auto bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-lg p-8 cursor-pointer mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-dark-blue montserrat text-4xl font-bold lowercase mb-0">
              {vehicle.make}
            </h4>
            <h3 className="text-dark-blue montserrat text-3xl font-medium lowercase mb-0">
              {vehicle.model}
            </h3>
          </div>
          <div className="text-gray-400 montserrat text-3xl font-semibold">
            ${vehicle.pricePerHour}
          </div>
        </div>

        <div className="relative overflow-hidden mb-6 bg-gray-50">
          <Image
            width={600}
            height={600}
            src={vehicle.photo}
            alt={vehicle.title}
            className="w-full object-contain transition-all duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex justify-around items-center mb-8">{/* iconos */}</div>

        <div className="flex flex-col gap-3">
          <DarkButtom className="w-full py-4 rounded-full text-xl lowercase" text="rent now" />
          <LightButtom className="w-full py-4 rounded-full text-xl lowercase" text="see details" />
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
