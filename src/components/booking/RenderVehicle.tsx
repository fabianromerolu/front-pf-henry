import VehicleProps from "@/interfaces/vehicleProps";
import Image from "next/image";
import {
  translateFuel,
  translateTransmission,
  translateCategory,
} from "@/helpers/translateVehicleData";

interface RenderVehicleProps {
  vehicle: VehicleProps;
}

export default function RenderVehicle({ vehicle }: RenderVehicleProps) {
  return (
    <div className="bg-white border border-custume-blue/20 rounded-2xl p-6 shadow-xl sticky top-6">
      <h3 className="text-xl font-bold text-custume-blue mb-4">
        Resumen del vehículo
      </h3>

      <div className="w-full h-48 bg-custume-light rounded-xl overflow-hidden mb-4">
        {vehicle.thumbnailUrl ? (
          <Image
            src={vehicle.thumbnailUrl}
            alt={vehicle.model}
            width={400}
            height={300}
            className="object-cover w-full h-full"
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

      <div className="space-y-3 mb-4">
        <p className="text-2xl text-custume-gray m-1">
          <span className="font-semibold text-custume-blue">
            {vehicle.make}
          </span>{" "}
          {vehicle.model}
        </p>
        <p className="text-2xl text-custume-gray">
          <span className="font-semibold text-custume-blue">
            {vehicle.state}
          </span>{" "}
          {vehicle.city}
        </p>
        <p className="text-xl font-base text-custume-gray">
          <span>Combustible:</span> {translateFuel(vehicle.fuel)}
          <br />
          <span>Transmisión:</span>{" "}
          {translateTransmission(vehicle.transmission)}
          <br />
          <span>Categoría:</span> {translateCategory(vehicle.category)}
        </p>
      </div>

      <div className="border-t border-custume-blue/20 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-custume-gray">Precio por día:</span>
          <span className="text-2xl font-bold text-custume-red">
            ${vehicle.pricePerDay?.toLocaleString() || "0"}
          </span>
        </div>
      </div>

      {vehicle.description && (
        <div className="mt-4 p-4 bg-custume-light rounded-lg">
          <p className="text-sm text-custume-gray">{vehicle.description}</p>
        </div>
      )}
    </div>
  );
}
