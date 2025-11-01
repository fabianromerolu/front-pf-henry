"use client";

import React, { useState } from "react";
import VehicleCard from "../cards/vehicleCard";
<<<<<<< HEAD
import { useVehicles } from "@/context/VehiclesContext";
=======
import LightButton from "../Buttoms/LightButtom";
import DarkButton from "../Buttoms/DarkButtom";

enum BodyType {
  Sedan,
  Hatchback,
  Suv,
  Pickup,
  Van,
  Coupe,
  Convertible,
}

enum Transmition {
  Manual,
  Automatic,
}

enum Fuel {
  Gasoline,
  Diesel,
  Hybrid,
  Electric,
}
>>>>>>> develop

const filterOptions = {
  transmission: ["Automatico", "Manual"],
  fuel: ["Disel", "Gasolina", "Electrico", "Hibrido"],
  seats: ["2", "4", "5", "7", "8"],
  priceRange: ["0-100", "100-200", "200-300", "300+"],
};

function MenuBar() {
  const { vehicles, loading, error } = useVehicles();

  const [filters, setFilters] = useState<{
    transmission: string | null;
    fuel: string | null;
    seats: string | null;
    priceRange: string | null;
  }>({
    transmission: null,
    fuel: null,
    seats: null,
    priceRange: null,
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleFilterChange = (
    category: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? null : value,
    }));
    setOpenDropdown(null);
  };

  const clearFilters = () => {
    setFilters({
      transmission: null,
      fuel: null,
      seats: null,
      priceRange: null,
    });
  };

  const isPriceInRange = (price: number, range: string): boolean => {
    if (range === "0-100") return price >= 0 && price <= 100;
    if (range === "100-200") return price > 100 && price <= 200;
    if (range === "200-300") return price > 200 && price <= 300;
    if (range === "300+") return price > 300;
    return true;
  };

  const filteredProducts = Array.isArray(vehicles)
    ? vehicles.filter((vehicle) => {
        if (
          filters.transmission &&
          vehicle.transmission?.toUpperCase() !==
            filters.transmission.toUpperCase()
        ) {
          return false;
        }

        if (
          filters.fuel &&
          vehicle.fuel?.toUpperCase() !== filters.fuel.toUpperCase()
        ) {
          return false;
        }

        if (filters.seats && vehicle.seats?.toString() !== filters.seats) {
          return false;
        }

        if (
          filters.priceRange &&
          !isPriceInRange(vehicle.pricePerDay, filters.priceRange)
        ) {
          return false;
        }

        return true;
      })
    : [];

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== null
  ).length;

  const filterLabels: Record<string, string> = {
    transmission: "Transmisión",
    fuel: "Combustible",
    seats: "Asientos",
    priceRange: "Precio Por Día",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-custume-blue">Cargando vehículos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="flex justify-center text-4xl montserrat mb-6 text-custume-red text-bold">
          ¿Qué estás buscando?
        </h2>

        <div className="flex justify-center mb-10">
          <LightButton
            href="/vehicles"
            size="xl"
            text="ver todos los preoductos"
          />
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-custume-light py-4 p-b2">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {(
              Object.keys(filterOptions) as Array<keyof typeof filterOptions>
            ).map((category) => (
              <div key={category} className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === category ? null : category)
                  }
                  className={`w-full px-4 py-3 rounded-lg border-2 font-semibold flex items-center justify-between transition-all ${
                    filters[category]
                      ? "border-dark-blue text-dark-blue"
                      : "border-custume-gray text-custume-gray hover:border-dark-blue"
                  }`}
                >
                  <span className="capitalize truncate">
                    {filters[category] || filterLabels[category] || category}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform flex-shrink-0 ml-2 ${
                      openDropdown === category ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDropdown === category && (
                  <div className="absolute z-10 w-full mt-2 bg-custume-light border-2 border-custume-gray rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filterOptions[category].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange(category, option)}
                        className={`w-full px-4 py-2 text-left hover:bg-light-blue transition-colors capitalize first:rounded-t-lg last:rounded-b-lg ${
                          filters[category] === option
                            ? "bg-light-blue text-dark-blue font-semibold"
                            : "text-custume-gray"
                        }`}
                      >
                        {category === "priceRange"
                          ? `$${option}`
                          : option.toLowerCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-custume-light border-2 border-custume-blue rounded-lg">
              <div className="flex flex-wrap gap-2">
                <span className="text-dark-blue">
                  <strong>{activeFiltersCount}</strong> filtro
                  {activeFiltersCount > 1 ? "s" : ""} activo
                  {activeFiltersCount > 1 ? "s" : ""}:
                </span>
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value && (
                      <span
                        key={key}
                        className="px-2 py-1 bg-light-blue text-dark-blue rounded text-sm font-medium capitalize"
                      >
                        {filterLabels[key] || key}: {value}
                      </span>
                    )
                )}
              </div>
              <DarkButton
                onClick={clearFilters}
                className="whitespace-nowrap ml-4"
<<<<<<< HEAD
                text="Limpiar filtros"
              />
=======
                text="Clean filters"
              ></DarkButton>
>>>>>>> develop
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded-lg p-4">
          <h3 className="text-xl font-bold mb-6 text-custume-gray">
            Resultados ({filteredProducts.length} de {vehicles.length})
          </h3>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-custume-gray text-lg mb-5">
                No se han encontrado vehiculos con dichos filtros
              </p>
              <div className="flex justify-center items-center">
                <DarkButton
                  onClick={clearFilters}
                  size="md"
<<<<<<< HEAD
                  text="Limpiar filtros"
                />
=======
                  text="Clean filters"
                ></DarkButton>
>>>>>>> develop
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
