import React from "react";
import SectionHeader from "../shared/SectionHeader";
import VehicleProps from "@/interfaces/vehicleProps";
import InputField from "../FormImputs";

interface LocationSectionProps {
  formData: Partial<VehicleProps>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const sectionStyles =
  "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300";

export default function LocationSection({
  formData,
  errors,
  handleInputChange,
  handleBlur,
}: LocationSectionProps) {
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
        title="Ubicación"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="País"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: Mexico"
          required
          error={errors.country}
        />
        <InputField
          label="Estado"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: Nuevo Leon"
          required
          error={errors.state}
        />
        <InputField
          label="Ciudad"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: Monterrey"
          required
          error={errors.city}
        />
      </div>
    </section>
  );
}
