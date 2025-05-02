import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number; // e.g., 4.5
  max?: number;   // default 5
};

const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
      ))}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <Star className="absolute left-0 top-0 w-4 h-4 fill-yellow-500 stroke-yellow-500" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          <Star className="absolute left-0 top-0 w-4 h-4 stroke-yellow-500" />
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 stroke-yellow-500" />
      ))}
    </div>
  );
};

export default StarRating;
