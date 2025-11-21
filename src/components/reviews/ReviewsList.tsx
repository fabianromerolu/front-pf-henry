"use client";

import { useEffect } from "react";
import { useReviews } from "@/context/ReviewContext";
import ReviewCard from "@/components/reviews/reviewCard";

interface ReviewsListProps {
  pinId: string;
}

export default function ReviewsList({ pinId }: ReviewsListProps) {
  const { reviews, isLoading, error, fetchVehicleReviews } = useReviews();

  useEffect(() => {
    if (pinId) {
      fetchVehicleReviews(pinId);
    }
  }, [pinId, fetchVehicleReviews]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-gray-500">Cargando reseñas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 py-4 px-4 bg-red-50 rounded-lg">
        <p className="font-semibold">Error al cargar reseñas:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-gray-500 py-8 px-4 bg-gray-50 rounded-lg text-center">
        <p>No hay reseñas disponibles para este vehículo.</p>
        <p className="text-sm mt-2">Sé el primero en dejar una reseña.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {reviews.map((review, index) => (
        <ReviewCard
          key={review.id || `review-${index}`} // ✅ Esta es la línea que falta
          review={review}
        />
      ))}
    </div>
  );
}
