// src/services/userStandard.service.ts
import { api } from "@/services/api.service";
import type { Booking, PaginationMeta } from "@/services/userRenter.service";

/** Helper para querystring (igual que en otros servicios) */
function q(params: Record<string, unknown> = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/* ====================== TIPOS DASHBOARD USER ====================== */

export type StandardUserBookingStatus = Booking["status"]; // "active" | "suspended" | "complete"

export type StandardUserBookingsFilters = {
  status?: StandardUserBookingStatus;
  from?: string; // ISO date (startDate >= from)
  to?: string;   // ISO date (startDate <= to)
  page?: number;
  limit?: number;
};

export type StandardUserNextBookingPin = {
  id: string;
  make: string | null;
  model: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

export type StandardUserNextBooking = {
  id: string;
  startDate: string;
  endDate: string;
  pin: StandardUserNextBookingPin;
};

export type StandardUserOverview = {
  bookingsTotal: number;
  bookingsActive: number;
  bookingsComplete: number;
  /** Total gastado en los últimos 30 días (string COP) */
  spentLast30d: string;
  /** Próxima reserva futura activa (o null si no hay) */
  nextBooking: StandardUserNextBooking | null;
};

/* ====================== API STANDARD USER ====================== */

export const standardUserApi = {
  /** GET /standard-user/dashboard/overview
   *  Resumen para el dashboard del usuario normal (cliente).
   */
  async getOverview() {
    const { data } = await api.get<StandardUserOverview>(
      `/standard-user/dashboard/overview`
    );
    return data;
  },

  /** GET /standard-user/bookings
   *  Listado paginado de MIS reservas (como USER).
   *  Respeta filtros status/from/to/page/limit que mapea el backend.
   */
  async listMyBookings(params: StandardUserBookingsFilters = {}) {
    const { data } = await api.get<{
      data: Booking[];
      meta: PaginationMeta;
    }>(`/standard-user/bookings${q(params)}`);
    // Devolvemos el objeto tal cual: { data, meta }
    return data;
  },

  /** GET /standard-user/bookings/:id
   *  Detalle de una reserva mía.
   */
  async getMyBookingById(id: string) {
    const { data } = await api.get<Booking>(`/standard-user/bookings/${id}`);
    return data;
  },

  /** PATCH /standard-user/bookings/:id/cancel
   *  Cancelar una de mis reservas.
   */
  async cancelMyBooking(id: string) {
    const { data } = await api.patch<{ success: boolean }>(
      `/standard-user/bookings/${id}/cancel`,
      {}
    );
    return data;
  },
};
