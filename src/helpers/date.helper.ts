export const formatDateToISO = (displayDate: string): string => {
  if (!displayDate) return "";

  const [day, month, year] = displayDate.split("/");

  if (!day || !month || !year) {
    throw new Error("Formato de fecha inválido. Use DD/MM/AAAA");
  }

  // Crear fecha a medianoche UTC
  const date = new Date(
    Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      0,
      0,
      0,
      0
    )
  );

  if (isNaN(date.getTime())) {
    throw new Error("Fecha inválida");
  }

  return date.toISOString(); // "2025-11-19T00:00:00.000Z"
};

/**
 * Convierte una fecha ISO (completa o simple) a formato DD/MM/AAAA
 * @param isoDate - Fecha en formato ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns Fecha en formato DD/MM/AAAA
 */
export const formatDateToDisplay = (isoDate: string): string => {
  if (!isoDate) return "";

  let date: Date;

  // Si viene en formato simple YYYY-MM-DD
  if (isoDate.length === 10 && isoDate.includes("-")) {
    const [year, month, day] = isoDate.split("-");
    date = new Date(
      Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        0,
        0,
        0,
        0
      )
    );
  } else {
    // Si viene en formato ISO completo
    date = new Date(isoDate);
  }

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Convierte una fecha en formato DD/MM/AAAA a un objeto Date
 * @param displayDate - Fecha en formato DD/MM/AAAA
 * @returns Objeto Date o null si es inválida
 */
export const parseDisplayDate = (displayDate: string): Date | null => {
  if (!displayDate) return null;

  try {
    const [day, month, year] = displayDate.split("/");

    if (!day || !month || !year) return null;

    // Crear fecha a medianoche UTC
    const date = new Date(
      Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        0,
        0,
        0,
        0
      )
    );

    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Convierte un timestamp ISO completo a formato DD/MM/AAAA HH:mm
 * @param isoTimestamp - Timestamp ISO completo
 * @returns Fecha formateada con hora
 */
export const formatDateTimeToDisplay = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Calcula la duración en días entre dos fechas en formato DD/MM/AAAA
 * @param startDate - Fecha inicial en formato DD/MM/AAAA
 * @param endDate - Fecha final en formato DD/MM/AAAA
 * @returns Número de días de diferencia
 */
export const calculateBookingDuration = (
  startDate: string,
  endDate: string
): number => {
  const start = parseDisplayDate(startDate);
  const end = parseDisplayDate(endDate);

  if (!start || !end) {
    throw new Error("Fechas inválidas");
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Formatea un rango de fechas con duración
 * @param startDate - Fecha inicial en formato DD/MM/AAAA
 * @param endDate - Fecha final en formato DD/MM/AAAA
 * @returns String formateado "DD/MM/AAAA - DD/MM/AAAA (X días)"
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const duration = calculateBookingDuration(startDate, endDate);
  return `${startDate} - ${endDate} (${duration} ${
    duration === 1 ? "día" : "días"
  })`;
};

/**
 * DEPRECATED: Usa formatDateToISO en su lugar
 */
export const parseDDMMYYYYToISO = (dateStr: string): string => {
  console.warn(
    "parseDDMMYYYYToISO está deprecado. Usa formatDateToISO en su lugar."
  );
  return formatDateToISO(dateStr);
};
