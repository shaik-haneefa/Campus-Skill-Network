import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 5,
  count,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const currentVal = hoverRating || Math.round(rating);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentVal;
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`transition-colors ${
                interactive ? 'cursor-pointer hover:scale-110 p-0.5' : 'cursor-default'
              }`}
            >
              <Star
                className={`${starSizes[size] || starSizes.md} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {rating !== undefined && !interactive && (
        <span className="text-xs font-semibold text-slate-700">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {count !== undefined && !interactive && (
        <span className="text-xs text-slate-400">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
