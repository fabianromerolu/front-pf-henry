"use client";

import React, { useState } from "react";
import DarkButtom from "../Buttoms/DarkButtom";
import VehicleCard from "../cards/vehicleCard";
import { useVehicles } from "@/context/VehicleContext";
import {
  translateFuel,
  translateTransmission,
} from "@/helpers/translateVehicleData";
import Pagination from "../pagination/Pagination";

const mexicoStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

const filterOptions = {
  transmission: ["AUTOMATIC", "MANUAL"],
  fuel: ["DIESEL", "GASOLINE", "ELECTRIC", "HYBRID"],
  seats: ["2", "4", "5", "7", "8"],
  state: mexicoStates,
};

type FilterCategory = keyof typeof filterOptions;

function MenuBar() {
  const {
    vehicles,
    loading,
    error,
    page,
    limit,
    total,
    hasNextPage,
    nextPage,
    prevPage,
    goToPage,
  } = useVehicles();

  const [filters, setFilters] = useState<{
    transmission: string | null;
    fuel: string | null;
    seats: string | null;
    state: string | null;
    maxPrice: number;
  }>({
    transmission: null,
    fuel: null,
    seats: null,
    state: null,
    maxPrice: 3000,
  });

  const [openDropdown, setOpenDropdown] = useState<FilterCategory | null>(null);

  const handleFilterChange = (category: FilterCategory, value: string) => {
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
      state: null,
      maxPrice: 3000,
    });
  };

  const getTranslatedValue = (category: string, value: string): string => {
    if (category === "transmission") return translateTransmission(value);
    if (category === "fuel") return translateFuel(value);
    return value;
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== null && v !== 3000
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const filteredProducts = hasActiveFilters
    ? vehicles.filter((vehicle) => {
        if (
          filters.transmission &&
          vehicle.transmission?.toUpperCase() !== filters.transmission
        )
          return false;

        if (filters.fuel && vehicle.fuel?.toUpperCase() !== filters.fuel)
          return false;

        if (filters.seats && vehicle.seats?.toString() !== filters.seats)
          return false;

        if (filters.state && vehicle.state !== filters.state) return false;

        if (vehicle.pricePerDay > filters.maxPrice) return false;

        return true;
      })
    : [];

  const filterLabels: Record<string, string> = {
    transmission: "Transmisión",
    fuel: "Combustible",
    seats: "Asientos",
    state: "Estado",
    maxPrice: "Precio Máximo",
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
      <div className="sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-3">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {(Object.keys(filterOptions) as FilterCategory[]).map(
              (category) => (
                <div key={category} className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === category ? null : category
                      )
                    }
                    className={`w-full px-4 py-3 rounded-lg border-2 font-semibold flex items-center justify-between transition-all ${
                      filters[category]
                        ? "border-dark-blue text-dark-blue"
                        : "border-custume-gray text-custume-gray hover:border-dark-blue"
                    }`}
                  >
                    <span className="capitalize truncate">
                      {filters[category]
                        ? getTranslatedValue(category, filters[category]!)
                        : filterLabels[category]}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ml-2 ${
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
                    <div className="bg-custume-light absolute z-10 w-full mt-2 border-2 border-custume-gray rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filterOptions[category].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleFilterChange(category, option)}
                          className={`w-full px-4 py-2 text-left hover:bg-light-blue transition-colors ${
                            filters[category] === option
                              ? "bg-light-blue text-dark-blue font-semibold"
                              : "text-custume-gray"
                          }`}
                        >
                          {getTranslatedValue(category, option)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

            <div className="flex flex-col">
              <label className="text-custume-gray font-semibold mb-1">
                Precio Máximo: ${filters.maxPrice}
              </label>

              <input
                type="range"
                min={0}
                max={3000}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: Number(e.target.value),
                  }))
                }
                className="w-full accent-dark-blue"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-6 p-3 bg-custume-light border-2 border-custume-blue rounded-lg">
              <div className="flex flex-wrap gap-2">
                <span className="text-dark-blue">
                  <strong>{activeFiltersCount}</strong> filtro(s) activo(s):
                </span>

                {Object.entries(filters).map(([key, value]) => {
                  if (key === "maxPrice" || value === null) return null;

                  const keyTyped = key as FilterCategory;
                  const valueStr = String(value);

                  return (
                    <span
                      key={key}
                      className="px-2 py-1 bg-light-blue text-dark-blue rounded text-sm font-medium"
                    >
                      {filterLabels[keyTyped] || key}:{" "}
                      {getTranslatedValue(keyTyped, valueStr)}
                    </span>
                  );
                })}

                {filters.maxPrice !== 3000 && (
                  <span className="px-2 py-1 bg-light-blue text-dark-blue rounded text-sm font-medium">
                    Máx: ${filters.maxPrice}
                  </span>
                )}
              </div>

              <DarkButtom
                onClick={clearFilters}
                className="whitespace-nowrap ml-4"
                text="Limpiar filtros"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-0">
        <div className="rounded-lg p-4 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
