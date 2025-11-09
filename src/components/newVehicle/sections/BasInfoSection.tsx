import React from "react";
import VehicleProps from "@/interfaces/vehicleProps";
import InputField from "../FormImputs";
import SectionHeader from "../shared/SectionHeader";

interface BasicInfoSectionProps {
  formData: Partial<VehicleProps>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const sectionStyles =
  "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300";

export default function BasicInfoSection({
  formData,
  errors,
  handleInputChange,
  handleBlur,
}: BasicInfoSectionProps) {
  return (
    <section className={sectionStyles}>
      <SectionHeader
        icon={
          <svg
            className="w-6 h-6 text-custume-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="Información Básica"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Marca"
          name="make"
          value={formData.make}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: Toyota"
          required
          error={errors.make}
        />

        <InputField
          label="Modelo"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: Corolla"
          required
          error={errors.model}
        />

        <InputField
          label="Año"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={1900}
          max={new Date().getFullYear() + 1}
          required
          error={errors.year}
        />

        <InputField
          label="Color"
          name="color"
          value={formData.color}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: Blanco Perla"
          required
          error={errors.color}
        />
      </div>
    </section>
  );
}
