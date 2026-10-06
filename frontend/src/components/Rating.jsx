import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value = 0, text = '' }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="product-rating">
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} fill="#F59E0B" stroke="#F59E0B" />
        ))}
        {hasHalfStar && <StarHalf size={16} fill="#F59E0B" stroke="#F59E0B" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} stroke="#CBD5E1" />
        ))}
      </div>
      {text && <span className="review-count">{text}</span>}
    </div>
  );
};

export default Rating;
