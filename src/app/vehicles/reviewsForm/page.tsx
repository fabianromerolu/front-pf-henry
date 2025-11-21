"use client";

import React, { useState } from "react";
import { useReviews } from "@/context/ReviewContext";
import { CreateReviewDto } from "@/interfaces/reviewInterfaces";
import DarkButton from "@/components/Buttoms/DarkButtom";

interface CreateReviewFormProps {
  bookingId: string;
  pinId: string;
  onSuccess?: () => void;
}

function ReviewForm({ bookingId, pinId, onSuccess }: CreateReviewFormProps) {
  const { createReview, isLoading } = useReviews();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    if (comment.trim().length < 10) {
      alert("El comentario debe tener al menos 10 caracteres");
      return;
    }

    const reviewData: CreateReviewDto = {
      bookingId,
      pinId,
      rating,
      comment: comment.trim(),
    };

    const result = await createReview(reviewData);

    if (result) {
      setRating(0);
      setComment("");
      onSuccess?.();
      alert("¡Reseña publicada exitosamente!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto my-20"
    >
      <h3 className="text-2xl font-bold text-dark-blue mb-6">Deja tu reseña</h3>

      {/* Selector de estrellas */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Calificación
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-4xl transition-transform hover:scale-110"
            >
              <span
                className={
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Comentario */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tu comentario
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos sobre tu experiencia..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custume-blue focus:border-transparent resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 caracteres
        </p>
      </div>

      {/* Botón de envío */}
      <DarkButton
        text={isLoading ? "Publicando..." : "Publicar reseña"}
        size="xl"
        type="submit"
        disabled={isLoading || rating === 0}
      ></DarkButton>
    </form>
  );
}

export default ReviewForm;
