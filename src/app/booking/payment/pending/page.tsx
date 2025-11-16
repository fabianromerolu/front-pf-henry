"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handlePaymentPending } from "@/services/paymentsService.service";

export default function PaymentPendingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await handlePaymentPending();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-custume-blue">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center mx-4">
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-custume-blue mb-3">
          Pago Pendiente
        </h1>

        <p className="text-custume-gray mb-6">
          Tu pago está siendo procesado. Te notificaremos por correo cuando se
          confirme.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Esto puede tardar unos minutos. Puedes cerrar esta ventana de forma
            segura.
          </p>
        </div>

        <button
          onClick={goToBookings}
          className="w-full px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium"
        >
          Ver mis reservas
        </button>
      </div>
    </div>
  );
}
