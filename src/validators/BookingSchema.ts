import * as Yup from "yup";

export const BookingValidationSchema = Yup.object().shape({
  startDate: Yup.string()
    .required("La fecha de inicio es requerida")
    .test("is-valid-date", "Fecha de inicio inválida", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("is-future-date", "La fecha de inicio debe ser futura", (value) => {
      if (!value) return false;
      const date = new Date(value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return date >= now;
    }),

  endDate: Yup.string()
    .required("La fecha de término es requerida")
    .test("is-valid-date", "Fecha de término inválida", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test(
      "is-after-start",
      "La fecha de término debe ser posterior a la fecha de inicio",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return false;

        const start = new Date(startDate);
        const end = new Date(value);

        return end > start;
      }
    ),
});
