const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app";

interface CreateBookingPayload {
  userId: string;
  pinId: string;
  start_date: string;
  end_date: string;
}

interface BookingResponse {
  id?: string;
  _id?: string;
  userId: string;
  pinId: string;
  start_date: string;
  end_date: string;
  status?: string;
}

/**
 * Crea una nueva reserva
 * @param payload - Datos de la reserva con fechas en formato ISO
 * @param token - Token de autenticación del usuario
 * @returns Respuesta del servidor con los datos de la reserva creada
 */
export const createBooking = async (
  payload: CreateBookingPayload,
  token: string
): Promise<BookingResponse> => {
  try {
    console.log("📤 Enviando reserva:", payload);

    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Reserva creada exitosamente:", data);

    return data;
  } catch (error) {
    console.error("💥 Error en createBooking:", error);
    throw error;
  }
};

/**
 * Calcula la duración en días entre dos fechas ISO
 * @param startDate - Fecha de inicio en formato ISO
 * @param endDate - Fecha de fin en formato ISO
 * @returns Número de días de duración
 */
export const calculateBookingDuration = (
  startDate: string,
  endDate: string
): number => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Fechas inválidas");
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    console.error("Error calculando duración:", error);
    return 0;
  }
};

/**
 * Convierte una fecha Date a formato ISO string
 * @param date - Objeto Date
 * @returns String en formato ISO
 */
export const dateToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Valida que una fecha ISO sea válida y futura
 * @param isoDate - Fecha en formato ISO
 * @returns true si la fecha es válida y futura
 */
export const isValidFutureDate = (isoDate: string): boolean => {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    return date.getTime() > now.getTime();
  } catch {
    return false;
  }
};
