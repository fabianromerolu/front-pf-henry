export const validateBookingDates = (
  startDate: string,
  endDate: string
): {
  valid: boolean;
  startError?: string;
  endError?: string;
  error?: string;
} => {
  const [startDay, startMonth, startYear] = startDate.split("/");
  const [endDay, endMonth, endYear] = endDate.split("/");

  const start = new Date(
    Number(startYear),
    Number(startMonth) - 1,
    Number(startDay)
  );
  const end = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay));
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime())) {
    return { valid: false, startError: "Fecha de inicio inválida" };
  }

  if (isNaN(end.getTime())) {
    return { valid: false, endError: "Fecha de término inválida" };
  }

  if (start < now) {
    return {
      valid: false,
      startError: "La fecha de inicio no puede ser en el pasado",
    };
  }

  if (end <= start) {
    return {
      valid: false,
      endError: "La fecha de término debe ser posterior a la de inicio",
    };
  }

  return { valid: true };
};
