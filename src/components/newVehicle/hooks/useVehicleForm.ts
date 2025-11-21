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
import { createPin } from "@/services/vehicleService.service"; // 👈 importamos la función POST
import { useAuth } from "@/context/AuthContext"; // 👈 para obtener el token del usuario
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type VehicleFormData = Partial<VehicleProps> & {
  photos?: { url: string; isCover: boolean }[];
};

const initialFormData: VehicleFormData = {
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
  country: "",
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
  photos: [],
};

export function useVehicleForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false); // 👈 para estado de carga
  const [success, setSuccess] = useState(false); // 👈 para feedback visual

  const { token } = useAuth(); // 👈 recupera el token del contexto Auth

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
    setLoading(true);
    setSuccess(false);

    try {
      await vehicleSchema.validate(formData, { abortEarly: false });

      if (!token) {
        throw new Error("Token no encontrado. Iniciá sesión antes de continuar.");
      }

      console.log("📤 Enviando datos al backend:", formData);

      const createdVehicle = await createPin(formData, token);

      console.log("Vehículo creado con éxito:", createdVehicle);
      toast.success("Vehículo registrado exitosamente", {
        position: "top-right",
        autoClose: 3000,
      });

      setSuccess(true);
      setFormData(initialFormData);

      setTimeout(() => {
        router.push("/dashboard");
      }, 600);

    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      if (error.inner?.length) {
        error.inner.forEach((err: any) => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        console.error("Errores de validación:", validationErrors);
      } else {
        console.error("Error en la petición:", error.message);
        toast.error("UPSSS!!! Espere e intente nuevamente",{ 
          position: "top-right",
          autoClose: 3000,
         }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSuccess(false);
  };

  const handlePhotoUpload = (photo: { url: string; isCover: boolean }) => {
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), photo],
    }));
  };

  const handlePhotoRemove = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((p) => p.url !== url),
    }));
  };

  return {
    formData,
    errors,
    loading,
    success,
    handleInputChange,
    handleBlur,
    handleSubmit,
    resetForm,
    handlePhotoUpload,
    handlePhotoRemove,
  };
}
