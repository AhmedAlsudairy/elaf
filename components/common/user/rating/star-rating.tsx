import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className="focus:outline-none"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => onRatingChange(star)}
        >
          <Star
            className={`w-6 h-6 ${
              rating >= star
                ? 'text-yellow-400 fill-yellow-400'
                : rating >= star - 0.5
                ? 'text-yellow-400 fill-yellow-400 star-half'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;