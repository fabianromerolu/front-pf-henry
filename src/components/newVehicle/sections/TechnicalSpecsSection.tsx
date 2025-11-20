import React from "react";
import FormSelect from "../shared/FormSelect";
import SectionHeader from "../shared/SectionHeader";
import VehicleProps from "@/interfaces/vehicleProps";

interface TechnicalSpecsSectionProps {
  formData: Partial<VehicleProps>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const sectionStyles =
  "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300";

export default function TechnicalSpecsSection({
  formData,
  errors,
  handleInputChange,
  handleBlur,
}: TechnicalSpecsSectionProps) {
  const bodyTypeOptions = [
    { value: "SEDAN", label: "Sedán" },
    { value: "SUV", label: "SUV" },
    { value: "HATCHBACK", label: "Hatchback" },
    { value: "COUPE", label: "Coupé" },
    { value: "TRUCK", label: "Camioneta" },
    { value: "VAN", label: "Van" },
    { value: "CONVERTIBLE", label: "Convertible" },
  ];

  const categoryOptions = [
    { value: "ECONOMY", label: "Económico" },
    { value: "COMPACT", label: "Compacto" },
    { value: "MIDSIZE", label: "Mediano" },
    { value: "PREMIUM", label: "Premium" },
  ];

  const transmissionOptions = [
    { value: "MANUAL", label: "Manual" },
    { value: "AUTOMATIC", label: "Automática" },
  ];

  const fuelOptions = [
    { value: "GASOLINE", label: "Gasolina" },
    { value: "DIESEL", label: "Diésel" },
    { value: "ELECTRIC", label: "Eléctrico" },
    { value: "HYBRID", label: "Híbrido" },
  ];

  const drivetrainOptions = [
    { value: "FWD", label: "Delantera (FWD)" },
    { value: "RWD", label: "Trasera (RWD)" },
    { value: "AWD", label: "Integral (AWD)" },
    { value: "4WD", label: "4x4 (4WD)" },
  ];

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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        }
        title="Especificaciones Técnicas"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormSelect
          label="Tipo de Carrocería"
          name="bodyType"
          value={formData.bodyType}
          onChange={handleInputChange}
          onBlur={handleBlur}
          options={bodyTypeOptions}
          error={errors.bodyType}
          required
        />

        <FormSelect
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          onBlur={handleBlur}
          options={categoryOptions}
          error={errors.category}
          required
        />

        <FormSelect
          label="Transmisión"
          name="transmission"
          value={formData.transmission}
          onChange={handleInputChange}
          onBlur={handleBlur}
          options={transmissionOptions}
          error={errors.transmission}
          required
        />

        <FormSelect
          label="Combustible"
          name="fuel"
          value={formData.fuel}
          onChange={handleInputChange}
          onBlur={handleBlur}
          options={fuelOptions}
          error={errors.fuel}
          required
        />

        <FormSelect
          label="Tracción"
          name="drivetrain"
          value={formData.drivetrain}
          onChange={handleInputChange}
          onBlur={handleBlur}
          options={drivetrainOptions}
          error={errors.drivetrain}
          required
        />
      </div>
    </section>
  );
}
