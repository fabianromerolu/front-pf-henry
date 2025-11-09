/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useVehicleForm.ts
import { useState } from "react";
import { vehicleSchema } from "@/validators/NewVehicleSchema";
import VehicleProps, {
  BodyType,
  Category,
  DriveTrain,
  Fuel,
  Transmition,
} from "@/interfaces/vehicleProps";

const initialFormData: Partial<VehicleProps> = {
  title: "",
  make: "",
  model: "",
  year: new Date().getFullYear(),
  trim: "",
  bodyType: BodyType.Sedan,
  category: Category.Economy,
  transmission: Transmition.Manual,
  fuel: Fuel.Gasoline,
  drivetrain: DriveTrain.AWD,
  color: "",
  licensePlate: "",
  vin: "",
  city: "",
  state: "",
  country: "Colombia",
  lat: 0,
  lng: 0,
  pricePerHour: 0,
  pricePerDay: 0,
  pricePerWeek: 0,
  deposit: 0,
  kmIncludedPerDay: 150,
  pricePerExtraKm: 0.25,
  minHours: 2,
  minDriverAge: 21,
  insuranceIncluded: true,
  rules: "",
  description: "",
};

export function useVehicleForm() {
  const [formData, setFormData] =
    useState<Partial<VehicleProps>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = async (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name } = e.target;
    try {
      await vehicleSchema.validateAt(name, formData);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vehicleSchema.validate(formData, { abortEarly: false });
      console.log("Formulario válido:", formData);
      alert("Vehículo registrado exitosamente!");
      return true;
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      error.inner?.forEach((err: any) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      setErrors(validationErrors);
      console.error("Errores de validación:", validationErrors);
      return false;
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
