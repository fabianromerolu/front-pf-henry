"use client";

import VehicleItems from "@/Interfaces/VehicleItems";
import Image from "next/image";
import Link from "next/link";
import DarkButtom from "../Buttoms/LightButtom";
import LightButtom from "../Buttoms/DarkButtom";

interface CardProps {
  vehicle: VehicleItems;
}

export const VehicleCard = ({ vehicle }: CardProps) => {
  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group w-80 h-auto bg-white overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-2xl p-6 cursor-pointer">
        <div className="space-y-3">
          <div className="absolute top-3 right-3 text-custume-gray px-3 py-1 montserrat text-xl font-medium">
            ${vehicle.pricePerHour}
          </div>
          <h4 className="m-1 text-dark-blue montserrat text-4xl leading-bold">
            {vehicle.make}
          </h4>

          <h3 className="m-1 text-dark-blue montserrat text-xl leading-light">
            {vehicle.model}
          </h3>

          <div className="relative overflow-hidden mb-4">
            <Image
              width={320}
              height={170}
              src={vehicle.photo}
              alt={`Image product: ${vehicle.title}`}
              className="w-full h-72 object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        <div className="px-8 pb-8 flex flex-col items-stretch gap-4">
          <LightButtom className=" py-4 rounded-full text-xl" text="rent now" />
          <DarkButtom
            className=" py-4 rounded-full text-xl"
            text="see details"
          />
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-custume-orange/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  );
};

export default VehicleCard;
