"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CreateReviewDto,
  Review,
  ReviewSummary,
} from "@/interfaces/reviewInterfaces";
import ReviewsService from "@/services/reviews.service";

interface ReviewsContextValue {
  // Estado
  reviews: Review[];
  reviewSummary: ReviewSummary | null;
  isLoading: boolean;
  error: string | null;

  // Métodos
  createReview: (data: CreateReviewDto) => Promise<Review | null>;
  fetchVehicleReviews: (pinId: string) => Promise<void>;
  fetchReviewsSummary: (pinId: string) => Promise<void>;
  clearReviews: () => void;
  clearError: () => void;
}

const ReviewsContext = createContext<ReviewsContextValue | undefined>(
  undefined
);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear una nueva reseña
   */
  const createReview = useCallback(
    async (data: CreateReviewDto): Promise<Review | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const newReview = await ReviewsService.createReview(data);

        // Agregar la nueva reseña al estado local
        setReviews((prev) => [newReview, ...prev]);

        // Actualizar el resumen si existe
        if (reviewSummary) {
          setReviewSummary({
            averageRating:
              (reviewSummary.averageRating * reviewSummary.totalReviews +
                newReview.rating) /
              (reviewSummary.totalReviews + 1),
            totalReviews: reviewSummary.totalReviews + 1,
          });
        }

        return newReview;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear la reseña";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [reviewSummary]
  );

  /**
   * Obtener todas las reseñas de un vehículo
   */
  const fetchVehicleReviews = useCallback(async (pinId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ReviewsService.getVehicleReviews(pinId);
      setReviews(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar las reseñas del vehículo";
      setError(errorMessage);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtener el resumen de reseñas de un vehículo
   */
  const fetchReviewsSummary = useCallback(async (pinId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ReviewsService.getVehicleReviewsSummary(pinId);
      setReviewSummary(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar el resumen de reseñas";
      setError(errorMessage);
      setReviewSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpiar las reseñas del estado
   */
  const clearReviews = useCallback(() => {
    setReviews([]);
    setReviewSummary(null);
  }, []);

  /**
   * Limpiar el error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ReviewsContextValue = {
    reviews,
    reviewSummary,
    isLoading,
    error,
    createReview,
    fetchVehicleReviews,
    fetchReviewsSummary,
    clearReviews,
    clearError,
  };

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de Reviews
 */
export const useReviews = (): ReviewsContextValue => {
  const context = useContext(ReviewsContext);

  if (context === undefined) {
    throw new Error("useReviews debe ser usado dentro de un ReviewsProvider");
  }

  return context;
};

export default ReviewsContext;
