import React from "react";
import { Review } from "@/interfaces/reviewInterfaces";

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  // ✅ Validación temprana
  if (!review) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="group relative w-full max-w-sm h-auto bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl rounded-2xl shadow-lg p-6 cursor-pointer mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-dark-blue font-semibold">
              {review.user || "Usuario Anónimo"}
            </p>
          </div>
        </div>

        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
      </div>

      <div className="mt-4">
        <p className="text-custume-blue text-sm leading-relaxed line-clamp-4">
          {review.comment}
        </p>
      </div>

      {review.bookingId && (
        <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Reserva verificada</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-custume-blue to-custume-red transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
}

export default ReviewCard;
