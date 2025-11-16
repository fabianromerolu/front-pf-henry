"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  handlePaymentFailure,
  getPaymentParamsFromURL,
} from "@/services/paymentsService.service";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "failure">("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = getPaymentParamsFromURL(searchParams);
        await handlePaymentFailure(params.paymentId);
        setStatus("failure");
      } catch (error) {
        console.error("Error al verificar el pago fallido:", error);
        setStatus("failure");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verificando pago...</h2>
          </>
        )}

        {status === "failure" && (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">
              Pago rechazado
            </h2>
            <p className="text-gray-700 mb-4">
              El pago no pudo ser procesado. Por favor, intenta nuevamente o usa
              otro método de pago.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => router.back()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Volver al inicio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
