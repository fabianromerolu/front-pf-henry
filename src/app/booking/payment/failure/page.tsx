"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handlePaymentFailure } from "@/services/paymentsService.service";

export default function PaymentFailurePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await handlePaymentFailure();
        setLoading(false);
      } catch (error) {
        console.error("Error verificando pago:", error);
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  const tryAgain = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/");
  };

  const goToBookings = () => {
    router.push("/my-bookings");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-custume-blue">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center mx-4">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-custume-blue mb-3">
          Pago Fallido
        </h1>

        <p className="text-custume-gray mb-6">
          No se pudo procesar tu pago. Por favor, verifica tus datos e intenta
          nuevamente.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800 font-medium mb-2">
            Posibles causas:
          </p>
          <ul className="text-sm text-red-700 text-left space-y-1">
            <li>• Fondos insuficientes</li>
            <li>• Datos de tarjeta incorrectos</li>
            <li>• Límite de compra excedido</li>
            <li>• Tarjeta bloqueada o vencida</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={tryAgain}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Intentar nuevamente
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={goToBookings}
              className="px-4 py-2 bg-gray-200 text-custume-blue rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Mis reservas
            </button>

            <button
              onClick={goHome}
              className="px-4 py-2 bg-gray-200 text-custume-blue rounded-xl hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
