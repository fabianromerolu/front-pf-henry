import * as Yup from "yup";

export const BookingValidationSchema = Yup.object().shape({
  startDate: Yup.string()
    .required("La fecha de inicio es requerida")
    .test("is-valid-date", "Fecha de inicio inválida", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test(
      "is-current-or-future",
      "Por favor, elige fechas actuales o futuras",
      (value) => {
        if (!value) return false;
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }
    ),

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
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return end > start;
      }
    )
    .test(
      "minimum-rental-period",
      "El período mínimo de renta es de 1 día",
      function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return false;

        const start = new Date(startDate);
        const end = new Date(value);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - start.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays >= 1;
      }
    ),
});

// Schema con validación de disponibilidad (requiere datos del vehículo)
export const createBookingValidationSchemaWithAvailability = (
  unavailableDates: string[] = []
) => {
  return Yup.object().shape({
    startDate: Yup.string()
      .required("La fecha de inicio es requerida")
      .test("is-valid-date", "Fecha de inicio inválida", (value) => {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
      })
      .test(
        "is-current-or-future",
        "Por favor, elige fechas actuales o futuras",
        (value) => {
          if (!value) return false;
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      )
      .test(
        "is-available",
        "El auto no está disponible en esa fecha",
        (value) => {
          if (!value || unavailableDates.length === 0) return true;
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);

          return !unavailableDates.some((unavailableDate) => {
            const unavailable = new Date(unavailableDate);
            unavailable.setHours(0, 0, 0, 0);
            return selectedDate.getTime() === unavailable.getTime();
          });
        }
      ),

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
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          return end > start;
        }
      )
      .test(
        "is-available",
        "El auto no está disponible en esa fecha",
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate || unavailableDates.length === 0)
            return true;

          const start = new Date(startDate);
          const end = new Date(value);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          // Verificar todas las fechas en el rango
          const currentDate = new Date(start);
          while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split("T")[0];

            const isUnavailable = unavailableDates.some((unavailableDate) => {
              const unavailable = new Date(unavailableDate);
              unavailable.setHours(0, 0, 0, 0);
              return currentDate.getTime() === unavailable.getTime();
            });

            if (isUnavailable) {
              return false;
            }

            currentDate.setDate(currentDate.getDate() + 1);
          }

          return true;
        }
      )
      .test(
        "minimum-rental-period",
        "El período mínimo de renta es de 1 día",
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) return false;

          const start = new Date(startDate);
          const end = new Date(value);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          const diffTime = end.getTime() - start.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);

          return diffDays >= 1;
        }
      ),
  });
};

// Schema con validación de precio mínimo
export const createBookingValidationSchemaWithPrice = (
  pricePerDay: number,
  unavailableDates: string[] = []
) => {
  const MINIMUM_TOTAL = 1000;

  return Yup.object().shape({
    startDate: Yup.string()
      .required("La fecha de inicio es requerida")
      .test("is-valid-date", "Fecha de inicio inválida", (value) => {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
      })
      .test(
        "is-current-or-future",
        "Por favor, elige fechas actuales o futuras",
        (value) => {
          if (!value) return false;
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      )
      .test(
        "is-available",
        "El auto no está disponible en esa fecha",
        (value) => {
          if (!value || unavailableDates.length === 0) return true;
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);

          return !unavailableDates.some((unavailableDate) => {
            const unavailable = new Date(unavailableDate);
            unavailable.setHours(0, 0, 0, 0);
            return selectedDate.getTime() === unavailable.getTime();
          });
        }
      ),

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
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          return end > start;
        }
      )
      .test(
        "is-available",
        "El auto no está disponible en esa fecha",
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate || unavailableDates.length === 0)
            return true;

          const start = new Date(startDate);
          const end = new Date(value);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          const currentDate = new Date(start);
          while (currentDate <= end) {
            const isUnavailable = unavailableDates.some((unavailableDate) => {
              const unavailable = new Date(unavailableDate);
              unavailable.setHours(0, 0, 0, 0);
              return currentDate.getTime() === unavailable.getTime();
            });

            if (isUnavailable) {
              return false;
            }

            currentDate.setDate(currentDate.getDate() + 1);
          }

          return true;
        }
      )
      .test(
        "minimum-rental-period",
        "El período mínimo de renta es de 1 día",
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) return false;

          const start = new Date(startDate);
          const end = new Date(value);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          const diffTime = end.getTime() - start.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);

          return diffDays >= 1;
        }
      )
      .test(
        "minimum-total-price",
        `El monto mínimo de reserva es $${MINIMUM_TOTAL.toLocaleString()}`,
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) return false;

          const start = new Date(startDate);
          const end = new Date(value);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const totalPrice = diffDays * pricePerDay;

          return totalPrice >= MINIMUM_TOTAL;
        }
      ),
  });
};
