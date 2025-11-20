// src/services/adminService.service.ts
import { api } from "@/services/api.service";
import type {
  Booking,
  WalletTransaction,
  Payout,
  PaginationMeta,
  PinDetail,
} from "@/services/userRenter.service";

/** Utilidad para querystring (misma firma que en userRenter.service.ts) */
function q(params: Record<string, unknown> = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/* ====================== TIPOS BASE ADMIN ====================== */

export type AdminRole = "ADMIN" | "RENTER" | "USER";
export type AdminUserStatus = "active" | "suspended";

export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role: AdminRole;
  status: AdminUserStatus;
  sex: "male" | "female" | "other" | "undisclosed";
  city?: string | null;
  state?: string | null;
  country?: string | null;
  profilePicture?: string | null;
  biography?: string | null;
  pinsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminUsersFilters = {
  q?: string;
  role?: AdminRole;
  status?: AdminUserStatus;
  city?: string;
  page?: number;
  limit?: number;
};

export type AdminUpdateUserStatusPayload = {
  status: AdminUserStatus;
  /** Si true, bloquea los pins del usuario (según tu endpoint) */
  blockPins?: boolean;
};

/** Item simplificado de pin para vistas de admin (basado en PinListItemResponseDto) */
export type AdminPinListItem = {
  id: string;
  pricePerDay: string;
  fuel: "GASOLINE" | "DIESEL" | "HYBRID" | "ELECTRIC";
  seats: number;
  transmission: "MANUAL" | "AUTOMATIC";
  description: string | null;
  thumbnailUrl: string | null;
};

/** Respuesta paginada tipo /pins/public */
export type PaginatedPinsPublic = {
  data: AdminPinListItem[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
};

/** Filtros para /admin/bookings */
export type AdminBookingsFilters = {
  status?: "active" | "suspended" | "complete";
  userId?: string;
  ownerId?: string;
  from?: string; // ISO date
  to?: string;   // ISO date
  page?: number;
  limit?: number;
};

/** Admin → filtros para transacciones */
export type AdminTransactionsFilters = {
  ownerId?: string;
  type?: "CREDIT" | "DEBIT";
  status?: "AVAILABLE" | "PENDING" | "PAID";
  page?: number;
  limit?: number;
};

/** Admin → filtros para payouts */
export type AdminPayoutsFilters = {
  ownerId?: string;
  status?: "REQUESTED" | "PROCESSING" | "PAID" | "REJECTED";
  page?: number;
  limit?: number;
};

export type AdminMetricsOverview = {
  usersTotal: number;
  usersActive: number;
  usersSuspended: number;
  pinsTotal: number;
  pinsPublished: number;
  pinsBlocked: number;
  bookingsTotal: number;
  bookingsActive: number;
  bookingsComplete: number;
  revenueTotal: string;   
  revenueLast30d: string;  
  topCities: string[];
};

/** No tienes schema explícito para series, lo dejamos abierto pero tipado por conveniencia */
export type AdminMetricsSeriesPoint = {
  date: string;
  bookings: number;
  revenue: number; // número, como viene del back
};


export type AdminMetricsSeriesResponse = {
  data: AdminMetricsSeriesPoint[];
  from?: string;
  to?: string;
  granularity: "day" | "month";
};

/* ====================== ADMIN USERS ====================== */

export const adminUsersApi = {
  /** GET /admin/users – lista de usuarios con filtros/paginación */
  async listUsers(params: AdminUsersFilters = {}) {
    const { data } = await api.get<{
      data: AdminUser[];
      meta: PaginationMeta;
    }>(`/admin/users${q(params)}`);
    return data;
  },

  /** GET /users/{id} – detalle de usuario */
  async getUserById(id: string) {
    const { data } = await api.get<AdminUser>(`/users/${id}`);
    return data;
  },

  /** PATCH /users/{id} – update genérico de usuario (nombre, rol, etc.) */
  async updateUser(id: string, patch: Partial<AdminUser>) {
    const { data } = await api.patch<AdminUser>(`/users/${id}`, patch);
    return data;
  },

  /** DELETE /users/{id} – soft delete */
  async deleteUser(id: string) {
    const { data } = await api.delete<{ success?: boolean }>(`/users/${id}`);
    return data;
  },

  /** PATCH /admin/users/{id}/status – cambiar estado (active/suspended) y opcionalmente bloquear pins */
  async updateUserStatus(id: string, payload: AdminUpdateUserStatusPayload) {
    const { data } = await api.patch<AdminUser>(
      `/admin/users/${id}/status`,
      payload
    );
    return data;
  },

  /** GET /users/{id}/pins – pins de un usuario */
  async getUserPins(id: string, params: { page?: number; limit?: number } = {}) {
    const { data } = await api.get<PinDetail[]>(
      `/users/${id}/pins${q(params)}`
    );
    return data;
  },

  /** GET /users/{id}/pins-count – conteo de pins de un usuario */
  async getUserPinsCount(id: string) {
    const { data } = await api.get<{ count: number }>(
      `/users/${id}/pins-count`
    );
    return data;
  },
};

/* ====================== ADMIN BOOKINGS ====================== */

export const adminBookingsApi = {
  /** GET /admin/bookings – listado global de reservas con filtros */
  async listBookings(params: AdminBookingsFilters = {}) {
    const { data } = await api.get<{
      data: Booking[];
      meta: PaginationMeta;
    }>(`/admin/bookings${q(params)}`);

    // si quieres devolver directo el objeto con data + meta:
    return data; // { data: Booking[], meta: PaginationMeta }
  },

  /** GET /bookings/{id} – detalle de reserva */
  async getBookingById(id: string) {
    const { data } = await api.get<Booking>(`/bookings/${id}`);
    return data;
  },

  /** PATCH /bookings/{id}/complete – completar reserva */
  async completeBooking(id: string) {
    const { data } = await api.patch<{ success: true }>(
      `/bookings/${id}/complete`
    );
    return data;
  },

  /** PATCH /bookings/{id}/cancel – cancelar reserva */
  async cancelBooking(id: string) {
    const { data } = await api.patch<{ success: true }>(
      `/bookings/${id}/cancel`
    );
    return data;
  },
};

/* ====================== ADMIN PAYMENTS ====================== */

export const adminPaymentsApi = {
  /** GET /admin/payments/transactions – historial global de wallet (créditos/débitos) */
  async listTransactions(params: AdminTransactionsFilters = {}) {
    const { data } = await api.get<{
      data: WalletTransaction[];
      meta: PaginationMeta;
    }>(`/admin/payments/transactions${q(params)}`);
    return data;
  },

  /** GET /admin/payments/payouts – historial global de retiros */
  async listPayouts(params: AdminPayoutsFilters = {}) {
    const { data } = await api.get<{
      data: Payout[];
      meta: PaginationMeta;
    }>(`/admin/payments/payouts${q(params)}`);
    return data;
  },
};

/* ====================== ADMIN METRICS ====================== */

export const adminMetricsApi = {
  /** GET /admin/metrics/overview – métricas agregadas para dashboard admin */
  async getOverview() {
    const { data } = await api.get<AdminMetricsOverview>(
      `/admin/metrics/overview`
    );
    return data;
  },

  /**
   * GET /admin/metrics/series – series temporales de bookings y revenue
   * from/to: YYYY-MM-DD (según swagger)
   */
  async getSeries(params: { from?: string; to?: string; granularity?: "day" | "month" }) {
    const { data } = await api.get<AdminMetricsSeriesPoint[]>(
      `/admin/metrics/series${q(params)}`
    );
    return data; // data es AdminMetricsSeriesPoint[]
  }

};

/* ====================== ADMIN PINS (GLOBAL) ====================== */

export const adminPinsApi = {
  /**
   * GET /pins/public – listado de vehículos publicados (con filtros)
   * Lo usamos en el panel admin para ver inventario global.
   */
  async listPublicPins(params: {
    page?: number;
    limit?: number;
    city?: string;
    category?:
      | "ECONOMY"
      | "COMPACT"
      | "MIDSIZE"
      | "SUV"
      | "PICKUP"
      | "VAN"
      | "PREMIUM"
      | "ELECTRIC";
    status?: "DRAFT" | "PUBLISHED" | "PAUSED" | "BLOCKED";
    q?: string;
    priceMin?: number;
    priceMax?: number;
    yearMin?: number;
    yearMax?: number;
    ownerId?: string;
  } = {}) {
    const { data } = await api.get<PaginatedPinsPublic>(
      `/pins/public${q(params)}`
    );
    return data;
  },

  /** GET /pins/{id} – detalle público del vehículo */
  async getPinById(id: string) {
    const { data } = await api.get<PinDetail>(`/pins/${id}`);
    return data;
  },

  /**
   * PATCH /pins/{id} – update de pin (admin/owner)
   * Útil para cambiar título, fotos, etc.
   */
  async updatePin(
    id: string,
    patch: Partial<PinDetail> & {
      photos?: { url: string; isCover?: boolean }[];
      title?: string;
    }
  ) {
    const { data } = await api.patch<PinDetail>(`/pins/${id}`, patch);
    return data;
  },

  /** PATCH /pins/{id}/status – cambiar estado (incluye bloqueo por admin) */
  async updatePinStatus(
    id: string,
    status: "DRAFT" | "PUBLISHED" | "PAUSED" | "BLOCKED"
  ) {
    const { data } = await api.patch<PinDetail>(`/pins/${id}/status`, {
      status,
    });
    return data;
  },

  /** DELETE /pins/{id} – borrar vehículo (owner/admin) */
  async deletePin(id: string) {
    const { data } = await api.delete<{ success: boolean }>(`/pins/${id}`);
    return data;
  },
};
