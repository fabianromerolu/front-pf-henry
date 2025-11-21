export interface ReviewCardProps {
  userName: string;
  comment: string;
  rating: number;
  userImage?: string;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
  bookingId: string;
  pinId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  bookingId?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
