"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  handlePaymentPending,
  getPaymentParamsFromURL,
} from "@/services/paymentsService.service";

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "pending">("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = getPaymentParamsFromURL(searchParams);
        await handlePaymentPending(params.paymentId);
        setStatus("pending");
      } catch (error) {
        console.error("Error al verificar el pago pendiente:", error);
        setStatus("pending");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verificando pago...</h2>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="text-yellow-500 text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-600">
              Pago pendiente
            </h2>
            <p className="text-gray-700 mb-4">
              Tu pago está siendo procesado. Te notificaremos cuando se confirme
              la reserva.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mt-4"
            >
              Volver al inicio
            </button>
          </>
        )}
      </div>
    </div>
  );
}
