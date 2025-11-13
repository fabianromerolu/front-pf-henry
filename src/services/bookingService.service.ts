import {
  Booking,
  BookingData,
  GetBookingsParams,
  PaginatedBookingsResponse,
} from "@/interfaces/bookingInterfaces";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app"
).replace(/\/+$/, "");

const getHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const errorMessages: Record<number, string> = {
      400: "Solicitud inválida",
      401: "No autorizado. Por favor inicia sesión.",
      403: "No tienes permisos para realizar esta acción.",
      404: "Reserva no encontrada",
      409: "Conflicto: Ya existe una reserva en esas fechas",
      500: "Error del servidor",
    };

    const message =
      errorMessages[res.status] || `HTTP error! status: ${res.status}`;

    try {
      const errorData = await res.json();
      throw new Error(errorData.message || message);
    } catch {
      throw new Error(message);
    }
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
};

export const createBooking = async (
  bookingData: BookingData,
  token: string
): Promise<Booking> => {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(bookingData),
    });

    return await handleResponse<Booking>(res);
  } catch (error) {
    throw new Error(
      `Error al crear la reserva: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const getAllBookings = async (
  token: string,
  params?: GetBookingsParams
): Promise<PaginatedBookingsResponse> => {
  try {
    const { page = 1, limit = 10 } = params || {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(`${API_URL}/bookings?${queryParams.toString()}`, {
      method: "GET",
      headers: getHeaders(token),
    });

    return await handleResponse<PaginatedBookingsResponse>(res);
  } catch (error) {
    throw new Error(
      `Error al obtener las reservas: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const getBookingById = async (
  id: string,
  token: string
): Promise<Booking> => {
  try {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "GET",
      headers: getHeaders(token),
    });

    return await handleResponse<Booking>(res);
  } catch (error) {
    throw new Error(
      `Error al obtener la reserva: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const completeBooking = async (
  id: string,
  token: string
): Promise<Booking> => {
  try {
    const res = await fetch(`${API_URL}/bookings/${id}/complete`, {
      method: "PATCH",
      headers: getHeaders(token),
    });

    return await handleResponse<Booking>(res);
  } catch (error) {
    throw new Error(
      `Error al completar la reserva: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const cancelBooking = async (
  id: string,
  token: string
): Promise<Booking> => {
  try {
    const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: getHeaders(token),
    });

    return await handleResponse<Booking>(res);
  } catch (error) {
    throw new Error(
      `Error al cancelar la reserva: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const formatDateToISO = (date: Date): string => {
  return date.toISOString();
};

const formatDateToDDMMYYYY = (isoDate: string): string => {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateTimeToDisplay = (isoDate: string): string => {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const parseDDMMYYYYToISO = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("/");
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (isNaN(date.getTime())) {
    throw new Error("Formato de fecha inválido. Use DD/MM/AAAA");
  }

  return date.toISOString();
};

export const calculateBookingDuration = (
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = formatDateToDDMMYYYY(startDate);
  const end = formatDateToDDMMYYYY(endDate);
  const duration = calculateBookingDuration(startDate, endDate);

  return `${start} - ${end} (${duration} ${duration === 1 ? "día" : "días"})`;
};
