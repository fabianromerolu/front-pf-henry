
import CloudinaryUpload from "@/components/cloudinary/CloudinaryUpload";
import SectionHeader from "../shared/SectionHeader";
import VehicleProps from "@/interfaces/vehicleProps";
import LightButton from "@/components/Buttoms/LightButtom";
import DarkButton from "@/components/Buttoms/DarkButtom";
import InputField from "../FormImputs";

interface RentalConditionsSectionProps {
  formData: Partial<VehicleProps>;
  errors: Record<string, string>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onReset: () => void;
  handlePhotoUpload: (photo: { url: string; isCover: boolean }) => void;
  handlePhotoRemove: (url: string) => void;
}


const sectionStyles =
  "bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 hover:shadow-xl transition-shadow duration-300";
const inputStyles =
  "w-full bg-white/95 border-2 border-gray-200 focus:border-custume-blue text-gray-800 text-base hind rounded-lg px-4 py-3.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custume-blue/20 transition-all duration-300 hover:border-gray-300";
const labelStyles =
  "monserrat block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide";
const errorStyles =
  "text-custume-red text-xs mt-1.5 hind font-medium flex items-center gap-1";

export default function RentalConditionsSection({
  formData,
  errors,
  handleInputChange,
  handleBlur,
  handlePhotoUpload,
  handlePhotoRemove,
  onReset,
}: RentalConditionsSectionProps) {
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="Condiciones y Requisitos de Renta"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InputField
          label="Precio por Día"
          name="pricePerDay"
          type="number"
          value={formData.pricePerDay}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={0}
          step={0.01}
          placeholder="0.00"
          prefix="$"
          required
          error={errors.pricePerDay}
        />

        <InputField
          label="Edad Mínima del Conductor"
          name="minDriverAge"
          type="number"
          value={formData.minDriverAge}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={18}
          placeholder="21"
          suffix="años"
          required
          error={errors.minDriverAge}
        />
      </div>

      <div className="space-y-2 mb-6">
        <label htmlFor="description" className={labelStyles}>
          Descripción del Vehículo <span className="text-custume-red">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={5}
          placeholder="Describe las características principales del vehículo, condiciones, extras incluidos, etc..."
          className={`${inputStyles} resize-none ${
            errors.description
              ? "border-custume-red focus:border-custume-red focus:ring-custume-red/20"
              : ""
          }`}
        />
        {errors.description && (
          <p className={errorStyles}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <label htmlFor="rules" className={labelStyles}>
          Reglas de Uso
        </label>
        <textarea
          id="rules"
          name="rules"
          value={formData.rules}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={4}
          placeholder="Ej: No fumar, no mascotas, mantener limpio, no conducir fuera de carretera..."
          className={`${inputStyles} resize-none`}
        />
      </div>

      <div className="space-y-2 mb-6">
  <label htmlFor="photos" className={labelStyles}>
    Fotos del Vehículo <span className="text-custume-red">*</span>
  </label>

<CloudinaryUpload 
handlePhotoUpload={handlePhotoUpload} 
handlePhotoRemove={handlePhotoRemove}
existingImages={formData.photos?.map(photo => photo.url) ?? []}
/>

</div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mt-5 p-5 border-2 border-blue-100">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="insuranceIncluded"
            name="insuranceIncluded"
            checked={formData.insuranceIncluded}
            onChange={handleInputChange}
            className="w-6 h-6 text-custume-blue bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-custume-blue/30 mt-1 cursor-pointer transition-all"
          />
          <div className="flex-1">
            <label
              htmlFor="insuranceIncluded"
              className="text-base font-bold text-gray-800 monserrat cursor-pointer flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 text-custume-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Seguro Incluido en el Precio
            </label>
            <p className="text-sm text-gray-600 mt-1.5 hind leading-relaxed">
              Al activar esta opción, el precio de renta incluye seguro básico
              contra terceros y cobertura de responsabilidad civil
            </p>
          </div>
        </div>
      </div>

      <div className="flex mt-10 gap-4 w-full sm:w-auto">
        <LightButton text="Limpiar" type="button" onClick={onReset}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </LightButton>

        <DarkButton text="Registrar Vehículo" type="submit">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </DarkButton>
      </div>
    </section>
  );
}
