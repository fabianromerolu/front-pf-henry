export interface BookingData {
  userId: string;
  pinId: string;
  start_date: string;
  end_date: string;
}

export interface Booking {
  id: string;
  userId: string;
  pinId: string;
  start_date: string;
  end_date: string;
  status?: "pending" | "completed" | "cancelled";
  hasReview?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedBookingsResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
}
