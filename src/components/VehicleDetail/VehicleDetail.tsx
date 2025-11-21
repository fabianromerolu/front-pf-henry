"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import VehicleProps from "@/interfaces/vehicleProps";
import ReviewsList from "@/components/reviews/ReviewsList";
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

  // const handleCreateReview = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   router.push(`/vehicles/reviewsForm`);
  // };

  const rulesArray = vehicle.rules
    .split("\n")
    .filter((rule) => rule.trim() !== "");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[33.33%_66.67%] min-h-screen">
      <section className="bg-dark-blue font-montserrat text-custume-light flex flex-col">
        <div className="flex flex-col text-custume-light p-4 sm:p-6 lg:p-8 flex-shrink-0">
          <header className="flex justify-between items-start p-4 sm:p-6">
            <h1 className="font-normal tracking-tight">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light block">
                {vehicle.make}
              </span>
              <span className="text-xl sm:text-2xl font-light block">
                {vehicle.model}
              </span>

              <p className="mt-4 sm:mt-6 text-xl sm:text-2xl font-light text-custume-light">
                Precio por día ${vehicle.pricePerDay.toLocaleString()}
              </p>
            </h1>
          </header>

          <div className="space-y-2 sm:space-y-3 mb-4 mx-4 sm:mx-6">
            <p className="text-xl sm:text-2xl text-custume-gray">
              {vehicle.city}
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-base text-custume-gray">
              <span>Combustible:</span> {translateFuel(vehicle.fuel)}
              <br />
              <span>Transmisión:</span>{" "}
              {translateTransmission(vehicle.transmission)}
              <br />
              <span>Categoría:</span> {translateCategory(vehicle.category)}
            </p>
          </div>
        </div>

        <figure className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px] overflow-hidden mt-auto">
          <Image
            src={vehicle.thumbnailUrl}
            alt={`Foto del vehículo ${vehicle.make} ${vehicle.model}`}
            sizes="(max-width: 1024px) 100vw, 33vw"
            fill
            priority
            className="object-cover object-center"
          />
        </figure>
      </section>

      <section className="bg-custume-light h-full p-4 sm:p-6 lg:p-8 xl:p-12 text-custume-blue text-base sm:text-lg font-hind flex flex-col">
        <div className="mb-6 lg:mb-8">
          <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
            {vehicle.description}
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-custume-blue">
            Reglas
          </h2>
          <ul className="space-y-2 mb-4 sm:mb-6">
            {rulesArray.map((rule, index) => (
              <li
                key={index}
                className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg"
              >
                <span className="text-custume-blue mt-1 flex-shrink-0">✓</span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-custume-blue">
            Reseñas
          </h2>
          <ReviewsList pinId={vehicle.id.toString()} />
          {/* <div className="flex justify-center">
            <LightButton
              text="crear reseña"
              size="xl"
              className="mt-10"
              onClick={handleCreateReview}
            />
          </div> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <DarkButton
            className="!w-full !min-w-0 py-3 sm:py-4 rounded-full text-base sm:text-lg lg:text-xl lowercase"
            text="rentar ahora"
            onClick={handleRentNow}
          />
          <LightButton
            className="!w-full !min-w-0 py-3 sm:py-4 rounded-full text-base sm:text-lg lg:text-xl lowercase"
            text="volver a vehículos"
            onClick={handleBackVehicles}
          />
        </div>
      </section>
    </div>
  );
}
