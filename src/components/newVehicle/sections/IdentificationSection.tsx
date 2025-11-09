import React from "react";
import SectionHeader from "../shared/SectionHeader";
import VehicleProps from "@/interfaces/vehicleProps";
import InputField from "../FormImputs";

interface IdentificationSectionProps {
  formData: Partial<VehicleProps>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const sectionStyles =
  "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300";

export default function IdentificationSection({
  formData,
  errors,
  handleInputChange,
  handleBlur,
}: IdentificationSectionProps) {
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
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        }
        title="Identificación Vehícular"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Placa"
          name="licensePlate"
          value={formData.licensePlate}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: ABC-123"
          required
          error={errors.licensePlate}
        />

        <InputField
          label="VIN (Número de Serie)"
          name="vin"
          value={formData.vin}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Ej: 1HGCM82633A004352"
          maxLength={17}
          required
          error={errors.vin}
        />
      </div>
    </section>
  );
}
