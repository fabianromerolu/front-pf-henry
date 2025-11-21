// src/app/vehicles/addReview/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "@/components/reviews/ReviewForm";

function AddReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const bookingId = searchParams.get("bookingId");
  const pinId = searchParams.get("pinId");

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custume-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // ✅ Validar AMBOS bookingId Y pinId
  if (!bookingId || !pinId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Información incompleta
          </h2>
          <p className="text-gray-600 mb-6">
            {!bookingId &&
              !pinId &&
              "Falta información de la reserva y el vehículo."}
            {!bookingId && pinId && "Falta información de la reserva."}
            {bookingId && !pinId && "Falta información del vehículo."}
            <br />
            Debes acceder desde tu dashboard.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full px-6 py-3 bg-custume-blue text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ Ahora TypeScript sabe que ambos son definitivamente string
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="mb-6 px-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-custume-blue hover:text-opacity-80 transition-all mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-custume-blue">Nueva Reseña</h1>
          <p className="text-gray-600 mt-2">
            Tu opinión ayuda a otros usuarios a tomar mejores decisiones
          </p>
        </div>

        <ReviewForm
          bookingId={bookingId}
          pinId={pinId}
          onSuccess={() => {
            router.push("/dashboard");
          }}
        />
      </div>
    </div>
  );
}

export default function AddReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custume-blue"></div>
        </div>
      }
    >
      <AddReviewContent />
    </Suspense>
  );
}
