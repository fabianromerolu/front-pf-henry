// src/services/paymentService.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app";

// Tipos para la API de pagos
export interface CreatePaymentRequest {
  bookingId: string;
}

export interface CreatePaymentResponse {
  init_point: string;
}

export interface PaymentStatus {
  status: "success" | "pending" | "failure";
  bookingId?: string;
  paymentId?: string;
  message?: string;
}

/**
 * Crea una preferencia de pago en Mercado Pago
 * @param bookingId - ID de la reserva
 * @returns URL de inicio de pago (init_point)
 */
export const createPayment = async (bookingId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId }),
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
 * @returns Estado del pago exitoso
 */
export const handlePaymentSuccess = async (): Promise<PaymentStatus> => {
  try {
    const response = await fetch(`${API_URL}/payments/success`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return {
      status: "success",
      message: "Pago procesado exitosamente",
    };
  } catch (error) {
    console.error("Error al verificar el pago exitoso:", error);
    return {
      status: "success",
      message: "Pago completado",
    };
  }
};

/**
 * Maneja la redirección de pago pendiente
 * @returns Estado del pago pendiente
 */
export const handlePaymentPending = async (): Promise<PaymentStatus> => {
  try {
    const response = await fetch(`${API_URL}/payments/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return {
      status: "pending",
      message: "Pago pendiente de confirmación",
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
 * @returns Estado del pago fallido
 */
export const handlePaymentFailure = async (): Promise<PaymentStatus> => {
  try {
    const response = await fetch(`${API_URL}/payments/failure`, {
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
 * @param bookingId - ID de la reserva
 */
export const processPayment = async (bookingId: string): Promise<void> => {
  try {
    const initPoint = await createPayment(bookingId);

    // Redirigir a la URL de pago de Mercado Pago
    window.location.href = initPoint;
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    throw error;
  }
};

/**
 * Obtiene el estado del pago desde los query params de la URL
 * @param searchParams - Parámetros de búsqueda de la URL
 * @returns Estado del pago basado en la ruta
 */
export const getPaymentStatusFromURL = (
  pathname: string
): "success" | "pending" | "failure" | null => {
  if (pathname.includes("/payments/success")) return "success";
  if (pathname.includes("/payments/pending")) return "pending";
  if (pathname.includes("/payments/failure")) return "failure";
  return null;
};

// Export default con todas las funciones
const paymentService = {
  createPayment,
  handlePaymentSuccess,
  handlePaymentPending,
  handlePaymentFailure,
  processPayment,
  getPaymentStatusFromURL,
};

export default paymentService;
