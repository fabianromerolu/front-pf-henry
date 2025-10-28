"use client";

import mockProducts from "@/helpers/mockProducts";
import React, { useState } from "react";
import VehicleCard from "../Cards/VehicleCard";
import DarkButtom from "../Buttoms/DarkButtom";
import LightButton from "../Buttoms/LightButtom";

const filterOptions = {
  type: ["sedan", "suv", "pickup"],
  state: ["nuevo", "usado"],
  make: ["toyota", "honda", "ford", "kia"],
  energy: ["gasoline", "diesel", "electric"],
};

function MenuBar() {
  const [filters, setFilters] = useState<{
    type: string | null;
    state: string | null;
    make: string | null;
    energy: string | null;
  }>({
    type: null,
    state: null,
    make: null,
    energy: null,
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
      state: null,
      make: null,
      type: null,
      energy: null,
    });
  };

  const filteredProducts = mockProducts.filter((product) => {
    return Object.keys(filters).every((key) => {
      const filterKey = key as keyof typeof filters;
      const filterValue = filters[filterKey];

      if (filterValue === null) return true;

      const productValue = product[filterKey as keyof typeof product];
      if (typeof productValue === "string") {
        return productValue.toLowerCase() === filterValue.toLowerCase();
      }

      return false;
    });
  });

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== null
  ).length;

  return (
    <div>
      {/* Título y botón (NO sticky) */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="flex justify-center text-3xl montserrat mb-6 text-dark-blue">
          What are you looking for?
        </h2>

        <div className="flex justify-center mb-10">
          <LightButton href="/vehicles" size="xl" text="see all our products" />
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-custume-light py-4 p-b2 ">
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
                    {filters[category] || category}
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
                  <div className="absolute z-10 w-full mt-2 bg-custume-light border-2 border-custume-gray rounded-lg shadow-lg">
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
                        {option}
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
                  <strong>{activeFiltersCount}</strong> filter
                  {activeFiltersCount > 1 ? "s" : ""} activ
                  {activeFiltersCount > 1 ? "s" : ""}:
                </span>
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value && (
                      <span
                        key={key}
                        className="px-2 py-1 bg-light-blue text-dark-blue rounded text-sm font-medium capitalize"
                      >
                        {key}: {value}
                      </span>
                    )
                )}
              </div>
              <DarkButtom
                onClick={clearFilters}
                className="whitespace-nowrap ml-4"
                text="Limpiar todo"
              ></DarkButtom>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="rounded-lg p-4">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Resaults ({filteredProducts.length} to {mockProducts.length})
          </h3>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-5">
                No vehicles found with that caracteristic
              </p>
              <div className="flex justify-center items-center ">
                <LightButton
                  onClick={clearFilters}
                  size="md"
                  text="Delete filters"
                ></LightButton>
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
