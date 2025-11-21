"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/context/ReviewContext";
import { CreateReviewDto } from "@/interfaces/reviewInterfaces";
import DarkButton from "@/components/Buttoms/DarkButtom";

interface ReviewFormProps {
  bookingId: string;
  pinId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  bookingId,
  pinId,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createReview, isLoading } = useReviews();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      alert("Debes iniciar sesión para dejar una reseña");
      router.push("/login");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      alert("Tu sesión no es válida. Por favor inicia sesión nuevamente.");
      router.push(
        `/login?redirect=/vehicles/addReview?bookingId=${bookingId}&pinId=${pinId}`
      );
      return;
    }

    if (rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    if (comment.trim().length < 10) {
      setError("El comentario debe tener al menos 10 caracteres");
      return;
    }

    try {
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
        alert("¡Reseña publicada exitosamente!.");

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Error al publicar reseña:", err);

      if (
        err instanceof Error &&
        (err.message.includes("401") || err.message.includes("Unauthorized"))
      ) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        router.push(
          `/login?redirect=/vehicles/addReview?bookingId=${bookingId}&pinId=${pinId}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Error al publicar la reseña"
        );
      }
    }
  };

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        {/* ✅ Header personalizado con nombre del usuario */}
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-custume-blue mb-2">
            ¡Hola, {user.name}!
          </h3>
          <p className="text-gray-600">
            Tu opinión es muy importante para nosotros y para otros usuarios.
            Comparte tu experiencia con la comunidad de Volantia.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Calificación */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            ¿Cómo calificarías tu experiencia? *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
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
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "😞 Muy malo"}
              {rating === 2 && "😕 Malo"}
              {rating === 3 && "😐 Regular"}
              {rating === 4 && "😊 Bueno"}
              {rating === 5 && "🤩 Excelente"}
            </p>
          )}
        </div>

        {/* Comentario */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cuéntanos más sobre tu experiencia *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe tu experiencia con el vehículo, el propietario, la limpieza, comodidad, etc..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custume-blue focus:border-transparent resize-none transition-all"
            maxLength={500}
            required
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              {comment.length}/500 caracteres
            </p>
            {comment.trim().length < 10 && comment.length > 0 && (
              <p className="text-xs text-red-500">
                Faltan {10 - comment.trim().length} caracteres
              </p>
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            💡 <strong>Consejo:</strong> Las reseñas honestas y detalladas
            ayudan a otros usuarios a tomar mejores decisiones y mejoran la
            calidad del servicio.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <DarkButton
            text={isLoading ? "Publicando..." : "Publicar reseña"}
            type="submit"
            disabled={isLoading || rating === 0 || comment.trim().length < 10}
            className="!w-full sm:!w-auto"
          />
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
