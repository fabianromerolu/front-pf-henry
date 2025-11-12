import * as yup from "yup";

const photoSchema = yup.object().shape({
  url: yup
    .string()
    .url("Debe ser una URL válida")
    .required("La URL de la foto es requerida"),
  isCover: yup.boolean().required(),
});

export const vehicleSchema = yup.object().shape({
  
  make: yup
    .string()
    .required("La marca es requerida")
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(50, "La marca no puede exceder 50 caracteres"),

  model: yup
    .string()
    .required("El modelo es requerido")
    .min(1, "El modelo debe tener al menos 1 caracter")
    .max(50, "El modelo no puede exceder 50 caracteres"),

  year: yup
    .number()
    .required("El año es requerido")
    .integer("El año debe ser un número entero")
    .min(1900, "El año debe ser mayor a 1900")
    .max(
      new Date().getFullYear() + 1,
      `El año no puede ser mayor a ${new Date().getFullYear() + 1}`
    )
    .typeError("El año debe ser un número válido"),

  trim: yup
    .string()
    .max(50, "La versión no puede exceder 50 caracteres")
    .nullable(),

  bodyType: yup
    .string()
    .required("El tipo de carrocería es requerido")
    .oneOf(
      ["SEDAN", "SUV", "HATCHBACK", "COUPE", "TRUCK", "VAN", "CONVERTIBLE"],
      "Tipo de carrocería no válido"
    ),

  category: yup
    .string()
    .required("La categoría es requerida")
    .oneOf(
      ["ECONOMY", "STANDARD", "LUXURY", "PREMIUM", "SPORT"],
      "Categoría no válida"
    ),

  transmission: yup
    .string()
    .required("La transmisión es requerida")
    .oneOf(
      ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"],
      "Tipo de transmisión no válido"
    ),

  fuel: yup
    .string()
    .required("El tipo de combustible es requerido")
    .oneOf(
      ["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID", "PLUGIN_HYBRID"],
      "Tipo de combustible no válido"
    ),

  drivetrain: yup
    .string()
    .required("El tipo de tracción es requerido")
    .oneOf(["FWD", "RWD", "AWD", "4WD"], "Tipo de tracción no válido"),

  color: yup
    .string()
    .required("El color es requerido")
    .min(2, "El color debe tener al menos 2 caracteres")
    .max(30, "El color no puede exceder 30 caracteres"),

  licensePlate: yup
    .string()
    .required("La placa es requerida")
    .matches(
      /^[A-Za-z0-9-]{3,10}$/,
      "La placa debe tener entre 3 y 10 caracteres alfanuméricos"
    )
    .transform((value) => value.toUpperCase()),

  vin: yup
    .string()
    .required("El VIN es requerido")
    .length(17, "El VIN debe tener exactamente 17 caracteres")
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/i, "El VIN contiene caracteres no válidos")
    .transform((value) => value.toUpperCase()),

  city: yup
    .string()
    .required("La ciudad es requerida")
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede exceder 100 caracteres"),

  state: yup
    .string()
    .required("El departamento/estado es requerido")
    .min(2, "El departamento debe tener al menos 2 caracteres")
    .max(100, "El departamento no puede exceder 100 caracteres"),

  country: yup
    .string()
    .required("El país es requerido")
    .min(2, "El país debe tener al menos 2 caracteres")
    .max(100, "El país no puede exceder 100 caracteres"),

  lat: yup
    .number()
    .required("La latitud es requerida")
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90")
    .typeError("La latitud debe ser un número válido"),

  lng: yup
    .number()
    .required("La longitud es requerida")
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180")
    .typeError("La longitud debe ser un número válido"),

  pricePerDay: yup
    .number()
    .required("El precio por día es requerido")
    .min(0, "El precio por día no puede ser negativo")
    .max(100000, "El precio por día no puede exceder 100,000")
    .test(
      "price-per-day-validation",
      "El precio por día debe ser menor que el precio por hora multiplicado por 24",
      function (value) {
        const { pricePerHour } = this.parent;
        if (!value || !pricePerHour) return true;
        return value < pricePerHour * 24;
      }
    )
    .typeError("El precio por día debe ser un número válido"),

  deposit: yup
    .number()
    .required("El depósito es requerido")
    .min(0, "El depósito no puede ser negativo")
    .max(1000000, "El depósito no puede exceder 1,000,000")
    .typeError("El depósito debe ser un número válido"),

  kmIncludedPerDay: yup
    .number()
    .required("Los kilómetros incluidos por día son requeridos")
    .integer("Los kilómetros deben ser un número entero")
    .min(0, "Los kilómetros no pueden ser negativos")
    .max(1000, "Los kilómetros incluidos no pueden exceder 1,000 por día")
    .typeError("Los kilómetros incluidos deben ser un número válido"),

  pricePerExtraKm: yup
    .number()
    .required("El precio por kilómetro extra es requerido")
    .min(0, "El precio por kilómetro extra no puede ser negativo")
    .max(100, "El precio por kilómetro extra no puede exceder 100")
    .typeError("El precio por kilómetro extra debe ser un número válido"),

  minHours: yup
    .number()
    .required("Las horas mínimas de renta son requeridas")
    .integer("Las horas mínimas deben ser un número entero")
    .min(1, "Las horas mínimas deben ser al menos 1")
    .max(168, "Las horas mínimas no pueden exceder 168 (1 semana)")
    .typeError("Las horas mínimas deben ser un número válido"),

  minDriverAge: yup
    .number()
    .required("La edad mínima del conductor es requerida")
    .integer("La edad mínima debe ser un número entero")
    .min(18, "La edad mínima debe ser al menos 18 años")
    .max(99, "La edad mínima no puede exceder 99 años")
    .typeError("La edad mínima debe ser un número válido"),

  insuranceIncluded: yup
    .boolean()
    .required("Debe especificar si incluye seguro"),

  rules: yup
    .string()
    .max(1000, "Las reglas no pueden exceder 1,000 caracteres")
    .nullable(),

  description: yup
    .string()
    .required("La descripción es requerida")
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(2000, "La descripción no puede exceder 2,000 caracteres"),

  photos: yup
    .array()
    .of(photoSchema)
    .min(1, "Debe agregar al menos 1 foto")
    .max(10, "No puede agregar más de 10 fotos")
    .test(
      "has-cover-photo",
      "Debe marcar al menos una foto como principal",
      (photos) => {
        if (!photos || photos.length === 0) return false;
        return photos.some((photo) => photo.isCover === true);
      }
    )
    .required("Las fotos son requeridas"),
});

export type VehicleFormData = yup.InferType<typeof vehicleSchema>;

yup.setLocale({
  mixed: {
    required: "Este campo es requerido",
    notType: "Tipo de dato no válido",
  },
  string: {
    min: "Debe tener al menos ${min} caracteres",
    max: "No puede exceder ${max} caracteres",
    email: "Debe ser un correo electrónico válido",
    url: "Debe ser una URL válida",
  },
  number: {
    min: "Debe ser mayor o igual a ${min}",
    max: "Debe ser menor o igual a ${max}",
    positive: "Debe ser un número positivo",
    integer: "Debe ser un número entero",
  },
  array: {
    min: "Debe tener al menos ${min} elementos",
    max: "No puede tener más de ${max} elementos",
  },
});

export const validateField = async (
  fieldName: keyof VehicleFormData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
): Promise<string | null> => {
  try {
    await vehicleSchema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "Error de validación";
  }
};

export const validateForm = async (
  data: Partial<VehicleFormData>
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await vehicleSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Error de validación" } };
  }
};
