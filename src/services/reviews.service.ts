/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/services/api.service";
import {
  CreateReviewDto,
  Review,
  ReviewSummary,
} from "@/interfaces/reviewInterfaces";

class ReviewsService {
  /**
   * Crear una nueva reseña
   */
  static async createReview(data: CreateReviewDto): Promise<Review> {
    try {
      console.log("Creating review with data:", data);

      // ✅ Usa la instancia api que tiene el interceptor
      const response = await api.post<Review>(`/reviews`, data);

      return response.data;
    } catch (error: any) {
      console.error("Error creating review:", error);
      console.error("Error response:", error.response?.data);

      if (error.response) {
        throw new Error(
          error.response.data?.message ||
            `Error ${error.response.status}: No se pudo crear la reseña`
        );
      } else if (error.request) {
        throw new Error(
          "No se pudo conectar con el servidor. Verifica que tu backend esté corriendo."
        );
      } else {
        throw new Error("Error al crear la reseña");
      }
    }
  }

  /**
   * Obtener todas las reseñas de un vehículo
   */
  static async getVehicleReviews(pinId: string): Promise<Review[]> {
    try {
      console.log("Fetching reviews for pinId:", pinId);

      // ✅ Usa la instancia api
      const response = await api.get<Review[]>(`/reviews/pin/${pinId}`);

      console.log("Reviews response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching vehicle reviews:", error);

      if (error.response) {
        if (error.response.status === 404) {
          console.log("No reviews found for this vehicle");
          return [];
        }
        throw new Error(
          error.response.data?.message ||
            "Error al cargar las reseñas del vehículo"
        );
      } else if (error.request) {
        console.error("No response from server. Is your backend running?");
        throw new Error("No se pudo conectar con el servidor");
      } else {
        throw new Error("Error al cargar las reseñas del vehículo");
      }
    }
  }

  /**
   * Obtener el resumen de reseñas de un vehículo
   */
  static async getVehicleReviewsSummary(pinId: string): Promise<ReviewSummary> {
    try {
      console.log("Fetching summary for pinId:", pinId);

      // ✅ Usa la instancia api
      const response = await api.get<ReviewSummary>(
        `/reviews/pin/${pinId}/summary`
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching reviews summary:", error);

      if (error.response) {
        if (error.response.status === 404) {
          return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
            },
          };
        }
        throw new Error(
          error.response.data?.message ||
            "Error al cargar el resumen de reseñas"
        );
      } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor");
      } else {
        throw new Error("Error al cargar el resumen de reseñas");
      }
    }
  }
}

export default ReviewsService;
