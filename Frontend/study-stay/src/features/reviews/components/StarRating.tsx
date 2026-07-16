import React from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 'text-lg' }) => {
  const stars = [1, 2, 3, 4, 5];
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={`${size} ${interactive ? 'cursor-pointer' : 'cursor-default'} ${
            star <= value ? 'text-amber-400' : 'text-slate-300'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: star <= value ? "'FILL' 1" : "'FILL' 0" }}>
            star
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
