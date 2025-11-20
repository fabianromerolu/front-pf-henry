"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import VehicleProps from "@/interfaces/vehicleProps";
import ReviewCard from "../cards/reviewCard";
import {
  translateFuel,
  translateTransmission,
  translateCategory,
} from "@/helpers/translateVehicleData";

interface VehicleDetailProps {
  vehicle: VehicleProps;
}

export default function VehicleDetail({ vehicle }: VehicleDetailProps) {
  const router = useRouter();

  const handleRentNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/booking?vehicleId=${vehicle.id}`);
  };

  const handleBackVehicles = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/vehicles`);
  };

  // Convertir las reglas en un array si vienen como string
  const rulesArray = vehicle.rules
    .split("\n")
    .filter((rule) => rule.trim() !== "");

  return (
    <div className="grid grid-cols-[33.33%_66.67%] min-h-screen">
      <section className="bg-dark-blue font-montserrat text-custume-lig flex flex-col">
        <div className="flex flex-col text-custume-light p-6 sm:p-8 flex-shrink-0">
          <header className="flex justify-between items-start p-6">
            <h1 className="font-normal tracking-tight">
              <span className="text-4xl font-light block">{vehicle.make}</span>
              <span className="text-2xl font-light block">{vehicle.model}</span>

              <p className="mt-6 text-2xl font-light text-custume-light">
                Precio por día ${vehicle.pricePerDay}
              </p>
            </h1>
          </header>

          <div className="space-y-3 mb-4 mx-6">
            <p className="text-2xl text-custume-gray">{vehicle.city}</p>
            <p className="text-xl font-base text-custume-gray">
              <span>Combustible:</span> {translateFuel(vehicle.fuel)}
              <br />
              <span>Transmisión:</span>{" "}
              {translateTransmission(vehicle.transmission)}
              <br />
              <span>Categoría:</span> {translateCategory(vehicle.category)}
            </p>
          </div>
        </div>

        <figure className="relative w-full h-[400px] overflow-hidden mt-auto">
          <Image
            src={vehicle.thumbnailUrl}
            alt={`Foto del vehículo ${vehicle.make} ${vehicle.model}`}
            sizes="33vw"
            fill
            priority
            className="object-cover object-center"
          />
        </figure>
      </section>

      <section className="bg-custume-light h-full p-8 sm:p-12 text-custume-blue text-lg font-hind flex flex-col">
        <div className="mb-30">
          <p className="mb-6 text-lg leading-relaxed">{vehicle.description}</p>

          <h2 className="text-2xl font-bold mb-4 text-custume-blue">Reglas</h2>
          <ul className="space-y-2 mb-6">
            {rulesArray.map((rule, index) => (
              <li key={index} className="flex items-start gap-3 text-lg">
                <span className="text-custume-blue mt-1 flex-shrink-0">✓</span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-row gap-6 mb-6">
          <ReviewCard
            userName="Juan Pérez"
            comment="Excelente servicio, el auto estaba en perfectas condiciones y la atención fue de primera. Definitivamente volveré a rentar aquí."
            rating={5}
          />

          <ReviewCard
            userName="Carlos Ramírez"
            comment="La experiencia fue regular. El auto funcionó bien pero llegó con el tanque casi vacío y tuve que cargar gasolina de inmediato. La atención al cliente podría mejorar, tardaron en responder mis mensajes."
            rating={3}
          />
        </div>

        <div className="flex flex-row gap-4">
          <DarkButton
            className="w-full py-4 rounded-full text-xl lowercase"
            text="rentar ahora"
            onClick={handleRentNow}
          />
          <LightButton
            className="w-full py-4 rounded-full text-xl lowercase"
            text="volver a vehículos"
            onClick={handleBackVehicles}
          />
        </div>
      </section>
    </div>
  );
}
