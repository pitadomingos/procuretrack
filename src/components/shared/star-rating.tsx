
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onRate?: (rating: number) => void;
  totalVoters?: number;
  pageKey: string; // Unique key for this rating instance (e.g., pathname)
  size?: 'sm' | 'md' | 'lg';
}

// Mock storage for ratings (replace with backend in a real app)
const ratingsStore: Record<string, { sum: number; count: number }> = {};

export function StarRating({
  initialRating = 0,
  totalStars = 5,
  onRate,
  totalVoters: initialTotalVoters = 0,
  pageKey,
  size = 'md',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Initialize from store or use initial props
  const [ratingData, setRatingData] = useState(() => {
    if (ratingsStore[pageKey]) {
      return ratingsStore[pageKey];
    }
    return { sum: initialRating * initialTotalVoters, count: initialTotalVoters };
  });

  const currentAverageRating = ratingData.count > 0 ? ratingData.sum / ratingData.count : 0;

  const handleClick = (newRating: number) => {
    const newSum = ratingData.sum - (ratingData.count > 0 ? currentAverageRating : 0) + newRating; // Adjust sum carefully
    const newCount = ratingData.count > 0 && currentAverageRating > 0 ? ratingData.count : ratingData.count +1; // Increment count only if it was 0 before, or this is a "new" vote
    
    // This logic is a simplification. A real system would prevent multiple votes or average correctly.
    const updatedData = { sum: ratingData.sum + newRating, count: ratingData.count + 1 };
    
    ratingsStore[pageKey] = updatedData; // Update mock store
    setRatingData(updatedData); // Update local state to re-render

    if (onRate) {
      onRate(newRating);
    }
    console.log(`Rated ${newRating} for ${pageKey}. New avg: ${updatedData.sum / updatedData.count}, Total votes: ${updatedData.count}`);
  };

  const starSizeClass = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size];

  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            className={cn(
              starSizeClass,
              'cursor-pointer transition-colors',
              (hoverRating || Math.round(currentAverageRating)) >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
            )}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
      {ratingData.count > 0 && (
        <span className={cn("text-xs text-muted-foreground ml-2", size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({currentAverageRating.toFixed(1)} from {ratingData.count} vote{ratingData.count === 1 ? '' : 's'})
        </span>
      )}
       {ratingData.count === 0 && (
         <span className={cn("text-xs text-muted-foreground ml-2", size === 'sm' ? 'text-xs' : 'text-sm')}>
          (No votes yet)
        </span>
       )}
    </div>
  );
}
