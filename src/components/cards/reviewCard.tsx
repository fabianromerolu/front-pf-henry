import React from "react";

interface ReviewProps {
  userName: string;
  comment: string;
  rating: number;
  userImage?: string;
}

function ReviewCard({ userName, comment, rating }: ReviewProps) {
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
            <p className="text-dark-blue font-semibold">{userName}</p>
          </div>
        </div>
        <div className="flex gap-0.5">{renderStars(rating)}</div>
      </div>

      <div className="mt-4">
        <p className="text-custume-blue text-sm leading-relaxed line-clamp-4">
          {comment}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-custume-blue to-custume-red transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
}

export default ReviewCard;
