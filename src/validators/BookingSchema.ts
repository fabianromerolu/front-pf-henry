import { validateBookingDates } from "@/helpers/booking.helper";
import * as Yup from "yup";

export default interface InputsPropsType {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export interface CheckoutData {
  cartNumber: "";
  expirationDate: "";
  cvv: "";
}

export const BookingValidationSchema = Yup.object({
  startDate: Yup.string()
    .required("La fecha de inicio es obligatoria")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Formato debe ser DD/MM/AAAA"),
  endDate: Yup.string()
    .required("La fecha de fin es obligatoria")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Formato debe ser DD/MM/AAAA")
    .test("dates-validation", "Fechas inválidas", function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;

      const validation = validateBookingDates(startDate, value);
      if (!validation.valid) {
        return this.createError({ message: validation.error });
      }
      return true;
    }),
  street: Yup.string().required("La calle es obligatoria"),
  exteriorNumber: Yup.string().required("El número exterior es obligatorio"),
  interiorNumber: Yup.string(),
  neighborhood: Yup.string().required("La colonia es obligatoria"),
  municipality: Yup.string().required("El municipio/alcaldía es obligatorio"),
  state: Yup.string().required("El estado es obligatorio"),
  postalCode: Yup.string()
    .required("El código postal es obligatorio")
    .matches(/^\d{5}$/, "Debe tener 5 dígitos"),
});
