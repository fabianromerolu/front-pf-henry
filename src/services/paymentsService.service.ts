const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app";

// Tipos para la API de pagos
export interface CreatePaymentRequest {
  bookingId: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  // Agrega aquí cualquier otro campo que necesite tu backend
}

export interface CreatePaymentResponse {
  init_point: string;
  preferenceId?: string;
}

export interface PaymentStatus {
  status: "success" | "pending" | "failure";
  bookingId?: string;
  paymentId?: string;
  message?: string;
}

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param bookingData - Datos de la reserva
 * @returns URL de inicio de pago (init_point)
 */
export const createPayment = async (
  bookingData: CreatePaymentRequest
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data: CreatePaymentResponse = await response.json();

    if (!data.init_point) {
      throw new Error("No se recibió el init_point de Mercado Pago");
    }

    return data.init_point;
  } catch (error) {
    console.error("Error al crear el pago:", error);
    throw error instanceof Error
      ? error
      : new Error("Error desconocido al crear el pago");
  }
};

/**
 * Maneja la redirección exitosa del pago
 */
export const handlePaymentSuccess = async (
  paymentId?: string,
  preferenceId?: string
): Promise<PaymentStatus> => {
  try {
    const params = new URLSearchParams();
    if (paymentId) params.append("payment_id", paymentId);
    if (preferenceId) params.append("preference_id", preferenceId);

    const response = await fetch(
      `${API_URL}/payments/success?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: "success",
      message: "Pago procesado exitosamente",
      bookingId: data.bookingId,
      paymentId: data.paymentId,
    };
  } catch (error) {
    console.error("Error al verificar el pago exitoso:", error);
    return {
      status: "success",
      message: "Pago completado. Verificando reserva...",
    };
  }
};

/**
 * Maneja la redirección de pago pendiente
 */
export const handlePaymentPending = async (
  paymentId?: string
): Promise<PaymentStatus> => {
  try {
    const params = paymentId ? `?payment_id=${paymentId}` : "";

    const response = await fetch(`${API_URL}/payments/pending${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: "pending",
      message: "Pago pendiente de confirmación",
      paymentId: data.paymentId,
    };
  } catch (error) {
    console.error("Error al verificar el pago pendiente:", error);
    return {
      status: "pending",
      message: "Pago en proceso de confirmación",
    };
  }
};

/**
 * Maneja la redirección de pago fallido
 */
export const handlePaymentFailure = async (
  paymentId?: string
): Promise<PaymentStatus> => {
  try {
    const params = paymentId ? `?payment_id=${paymentId}` : "";

    const response = await fetch(`${API_URL}/payments/failure${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return {
      status: "failure",
      message: "El pago no pudo ser procesado",
    };
  } catch (error) {
    console.error("Error al verificar el pago fallido:", error);
    return {
      status: "failure",
      message: "Error al procesar el pago",
    };
  }
};

/**
 * Procesa el pago y redirige a Mercado Pago
 */
export const processPayment = async (
  bookingData: CreatePaymentRequest
): Promise<void> => {
  try {
    const initPoint = await createPayment(bookingData);
    window.location.href = initPoint;
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    throw error;
  }
};

/**
 * Obtiene el estado del pago desde la URL
 */
export const getPaymentStatusFromURL = (
  pathname: string
): "success" | "pending" | "failure" | null => {
  if (pathname.includes("/payments/success")) return "success";
  if (pathname.includes("/payments/pending")) return "pending";
  if (pathname.includes("/payments/failure")) return "failure";
  return null;
};

/**
 * Extrae los parámetros de pago de la URL
 */
export const getPaymentParamsFromURL = (
  searchParams: URLSearchParams
): {
  paymentId?: string;
  preferenceId?: string;
  status?: string;
  merchantOrderId?: string;
} => {
  return {
    paymentId: searchParams.get("payment_id") || undefined,
    preferenceId: searchParams.get("preference_id") || undefined,
    status: searchParams.get("status") || undefined,
    merchantOrderId: searchParams.get("merchant_order_id") || undefined,
  };
};

const paymentService = {
  createPayment,
  handlePaymentSuccess,
  handlePaymentPending,
  handlePaymentFailure,
  processPayment,
  getPaymentStatusFromURL,
  getPaymentParamsFromURL,
};

export default paymentService;
