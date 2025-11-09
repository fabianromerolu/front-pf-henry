"use client";

import React from "react";
import TechnicalSpecsSection from "./sections/TechnicalSpecsSection";
import BasicInfoSection from "./sections/BasInfoSection";
import { useVehicleForm } from "./hooks/useVehicleForm";
import IdentificationSection from "./sections/IdentificationSection";
import LocationSection from "./sections/LocationSection";
import RentalConditionsSection from "./sections/RentalConditionsSection";

export default function NewVehicleForm() {
  const {
    formData,
    errors,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useVehicleForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-custume-light via-light-blue/30 to-light-blue/50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-custume-red mb-3 monserrat">
              Registrar Vehículo
            </h1>
            <p className="text-gray-600 text-lg hind max-w-2xl mx-auto">
              Completa el formulario con la información del vehículo que desea
              agregar a la flota
            </p>

            <div className="bg-custume-light py-10">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
                  <div className="w-3 h-3 bg-custume-red rounded-full"></div>
                  <div className="h-px bg-gradient-to-r from-transparent via-custume-blue to-transparent w-full max-w-xs"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <BasicInfoSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
          />

          <TechnicalSpecsSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
          />

          <IdentificationSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
          />
          <LocationSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
          />
          <RentalConditionsSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            onReset={resetForm}
          />
        </form>
      </div>
    </div>
  );
}
