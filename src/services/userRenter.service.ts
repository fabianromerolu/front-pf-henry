// src/services/userRenter.service.ts
import { api } from "@/services/api.service";

// === Enums compatibles con tu backend ===
export type BodyType =
  | "SEDAN"
  | "HATCHBACK"
  | "SUV"
  | "PICKUP"
  | "VAN"
  | "COUPE"
  | "CONVERTIBLE";
export type VehicleCategory =
  | "ECONOMY"
  | "COMPACT"
  | "MIDSIZE"
  | "SUV"
  | "PICKUP"
  | "VAN"
  | "PREMIUM"
  | "ELECTRIC";
export type Transmission = "MANUAL" | "AUTOMATIC";
export type FuelType = "GASOLINE" | "DIESEL" | "HYBRID" | "ELECTRIC";

// Lo que trae un pin cuando lo listás (puede variar, mantén lo que ya tenías + fotos/owner, etc.)
export type PinSummary = {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerDay?: number | string;
  photos?: { url: string; isCover?: boolean }[];
  // Agrega si ya los usabas en otros lados
  bodyType?: BodyType;
  category?: VehicleCategory;
  transmission?: Transmission;
  fuel?: FuelType;
  seats?: number;
  city?: string;
  state?: string;
  country?: string;
  description?: string | null;
  rules?: string | null;
};

// Input para update (coincide con tu UpdatePinDto en el backend)
export type UpdatePinInput = Partial<{
  make: string;
  model: string;
  year: number;
  bodyType: BodyType;
  category: VehicleCategory;
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  pricePerDay: number;
  city: string;
  state: string;
  country: string;
  description: string | null;
  rules: string | null;
  photos: { url: string; isCover?: boolean }[];
}>;

/** Utilidades */
function q(params: Record<string, unknown> = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Tipos básicos del front (ajusta según tus DTOs si quieres tipado más estricto) */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  pages: number;     
  hasNext: boolean;
  hasPrev: boolean;
};


export type Paginated<T> = { data: T[]; meta: PaginationMeta };

export type UserProfile = {
  id: string;
  email: string;
  username?: string;
  name?: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  address?: string | null;
  sex?: "male" | "female" | "other" | "undisclosed";
  birthDate?: string | null; // ISO
  biography?: string | null;
  profilePicture?: string | null;
  role?: "ADMIN" | "RENTER" | "USER";
};

export type PinDetail = {
  id: string;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  pricePerDay: string;
  city: string;
  state: string;
  country: string;
  rules: string | null;
  description: string | null;
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "BLOCKED";
  photos: { url: string }[];
};

export type VehicleStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "BLOCKED";

export type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  status: "active" | "suspended" | "complete";
  totalPrice: string | number;
  paymentStatus?: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  currency?: string;
  pin?: { id: string; title?: string; make?: string; model?: string };
  user?: { id: string; name?: string; email?: string };
  createdAt?: string;
  updatedAt?: string;
};

export type WalletTransaction = {
  id: string;
  ownerId: string;
  bookingId?: string | null;
  type: "CREDIT" | "DEBIT";
  amount: string | number;
  currency: string;
  status: "PENDING" | "AVAILABLE" | "PAID";
  availableAt?: string | null;
  createdAt: string;
};

export type Payout = {
  id: string;
  ownerId: string;
  amount: string | number;
  currency: string;
  status: "REQUESTED" | "PROCESSING" | "PAID" | "FAILED";
  createdAt: string;
  paidAt?: string | null;
};

export type RenterOverview = {
  pins: { total: number; published: number; blocked: number };
  revenueLast30d: string; // COP en string
  revenuePending: string; // COP en string
};

export type RenterBalance = {
  available: string; // COP
  pending: string; // COP
  currency: "COP";
};

/** ===== Renter (propietario) ===== */
export const renterApi = {
  // Reservas de mis vehículos (como owner), con filtros/paginación
  async getOwnerBookings(params: {
    status?: "active" | "suspended" | "complete";
    from?: string; // ISO
    to?: string; // ISO
    page?: number;
    limit?: number;
  }) {
    const { data } = await api.get<{ data: Booking[]; meta: PaginationMeta }>(
      `/renter/bookings${q(params)}`
    );
    return data;
  },

  // Resumen para dashboard (cards: publicados, bloqueados, revenue, etc.)
  async getOverview() {
    const { data } = await api.get<RenterOverview>(
      `/renter/dashboard/overview`
    );
    return data;
  },

  // Saldo (disponible / pendiente)
  async getBalance() {
    const { data } = await api.get<RenterBalance>(`/renter/balance`);
    return data;
  },

  // Historial de wallet (créditos/débitos)
  async getPayments(page = 1, limit = 20) {
    const { data } = await api.get<{
      data: WalletTransaction[];
      meta: PaginationMeta;
    }>(`/renter/payments${q({ page, limit })}`);
    return data;
  },

  // Crear solicitud de retiro (payout)
  async createPayout(amount: number) {
    const { data } = await api.post<Payout>(`/renter/payouts`, { amount });
    return data;
  },

  // Listado de retiros
  async listPayouts(page = 1, limit = 20) {
    const { data } = await api.get<{ data: Payout[]; meta: PaginationMeta }>(
      `/renter/payouts${q({ page, limit })}`
    );
    return data;
  },
};

/** ===== Perfil del usuario (RENTER/USER) ===== */
export const meApi = {
  async getMe() {
    const { data } = await api.get<UserProfile>(`/users/me`);
    return data;
  },
  async updateMe(patch: Partial<UserProfile>) {
    const { data } = await api.patch<UserProfile>(`/users/me`, patch);
    return data;
  },
  // Espera publicId de Cloudinary (tu backend lo guarda tal cual)
  async updateProfilePicture(publicId: string) {
    const { data } = await api.patch<UserProfile>(`/users/me/profile-picture`, {
      publicId,
    });
    return data;
  },
  // Firma para upload directo a Cloudinary
  async getUploadSignature(folder?: string) {
    const { data } = await api.get<{
      timestamp: number;
      signature: string;
      apiKey: string;
      cloudName: string;
      folder: string;
    }>(`/files/signature${q({ folder })}`);
    return data;
  },
};

/** ===== Mis Vehículos (RENTER) ===== */
export const myVehiclesApi = {
  // Lista paginada de mis vehículos (vista owner)
  async listMine(params: { page?: number; limit?: number; q?: string }) {
    const { data } = await api.get<PinSummary[]>(`/pins/mine/list${q(params)}`);
    // Este endpoint devuelve array directo en tu back (no viene meta).
    return data as PinSummary[];
  },

  // Crear vehículo
  async createPin(payload: {
    make: string;
    model: string;
    year: number;
    bodyType: string;
    category: string;
    transmission: string;
    fuel: string;
    seats?: number;
    pricePerDay: number;
    pricePerHour?: number;
    pricePerWeek?: number;
    city: string;
    state: string;
    country: string;
    description?: string | null;
    rules?: string | null;
    photos?: { url: string; isCover?: boolean }[];
  }) {
    const { data } = await api.post<PinSummary>(`/pins`, payload);
    return data;
  },

  // Detalle público (si lo quieres para vista detail del owner también)
  async getPinPublic(id: string) {
    const { data } = await api.get<PinDetail>(`/pins/${id}`);
    return data;
  },

  // Actualizar vehículo (owner/admin)
  async updatePin(
    id: string,
    patch: Partial<PinSummary> & {
      photos?: { url: string; isCover?: boolean }[];
    }
  ) {
    const { data } = await api.patch<PinSummary>(`/pins/${id}`, patch);
    return data;
  },

  // Cambiar estado (publish/pause/block)
  async setStatus(id: string, status: VehicleStatus) {
    const { data } = await api.patch<PinSummary>(`/pins/${id}/status`, {
      status,
    });
    return data;
  },

  // Eliminar vehículo
  async deletePin(id: string) {
    const { data } = await api.delete<{ success: boolean }>(`/pins/${id}`);
    return data;
  },
};

/** ===== Utilidades de reservas del lado del “cliente” (no owner) =====
 * Si en tu dashboard del Renter también muestras reservas que él hizo como usuario,
 * puedes usar estos helpers a /bookings (de tu BookingsController).
 */
export const myBookingsApi = {
  async listMyBookings(page = 1, limit = 10) {
    const { data } = await api.get<{
      data: Booking[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>(`/bookings${q({ page, limit })}`);
    return data;
  },
  async getMyBookingById(id: string) {
    const { data } = await api.get<Booking>(`/bookings/${id}`);
    return data;
  },
  async completeBooking(id: string) {
    const { data } = await api.patch<{ success: true }>(
      `/bookings/${id}/complete`
    );
    return data;
  },
  async cancelBooking(id: string) {
    const { data } = await api.patch<{ success: true }>(
      `/bookings/${id}/cancel`
    );
    return data;
  },
};
