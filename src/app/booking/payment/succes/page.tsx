"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handlePaymentSuccess } from "@/services/paymentsService.service";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await handlePaymentSuccess();
        setLoading(false);
      } catch (error) {
        console.error("Error verificando pago:", error);
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  const goToBookings = () => {
    router.push("/my-bookings");
  };

  const goToHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-custume-blue">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center mx-4">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-custume-blue mb-3">
          ¡Pago Exitoso!
        </h1>

        <p className="text-custume-gray mb-6">
          Tu pago ha sido procesado correctamente. Recibirás un correo de
          confirmación en breve.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-800 font-medium mb-2">
            Tu reserva está confirmada
          </p>
          <p className="text-xs text-green-700">
            Puedes ver los detalles de tu reserva en la sección Mis Reservas
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={goToBookings}
            className="w-full px-6 py-3 bg-custume-blue text-white rounded-xl hover:bg-custume-blue/90 transition-colors font-medium"
          >
            Ver mis reservas
          </button>

          <button
            onClick={goToHome}
            className="w-full px-6 py-3 bg-white text-custume-blue border-2 border-custume-blue rounded-xl hover:bg-custume-light transition-colors font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
