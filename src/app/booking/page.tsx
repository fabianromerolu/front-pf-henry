"use client";

import BookingCheckout from "@/components/booking/BookingCheckout";
import { Suspense } from "react";

function BookingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-custume-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-custume-blue text-lg">Cargando...</p>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingCheckout />
    </Suspense>
  );
}
