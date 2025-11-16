import {
  CreateReviewDto,
  Review,
  ReviewSummary,
} from "@/interfaces/reviewInterfaces";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://back-pf-henry-production-03d3.up.railway.app";

// Servicio de Reviews
export class ReviewsService {
  /**
   * Crear una nueva reseña a partir de una reserva (booking)
   * POST /reviews
   */
  static async createReview(data: CreateReviewDto): Promise<Review> {
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  /**
   * Obtener reseñas simplificadas de un vehículo (formato para el frontend)
   * GET /reviews/pin/{pinId}
   */
  static async getVehicleReviews(pinId: string): Promise<Review[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/pin/${pinId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle reviews:", error);
      throw error;
    }
  }

  /**
   * Obtener promedio de calificaciones y cantidad total de reseñas
   * GET /reviews/pin/{pinId}/summary
   */
  static async getVehicleReviewsSummary(pinId: string): Promise<ReviewSummary> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/reviews/pin/${pinId}/summary`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews summary:", error);
      throw error;
    }
  }
}

export default ReviewsService;
