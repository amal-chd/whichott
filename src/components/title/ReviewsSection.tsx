import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { getReviewsForMedia } from '@/lib/firebase/reviews';
import type { UserReview } from '@/lib/firebase/reviews';
import type { ContentType } from '@/lib/api/types';
import { ReviewForm } from '../reviews/ReviewForm';

interface ReviewsSectionProps {
  mediaId: number;
  mediaType: ContentType;
}

export function ReviewsSection({ mediaId, mediaType }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getReviewsForMedia(mediaId, mediaType);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [mediaId, mediaType]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 border-t border-white/10">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Left Column: Form & Stats */}
        <div className="w-full md:w-1/3 shrink-0">
          <h2 className="text-3xl font-extrabold text-white mb-6">User Reviews</h2>
          
          <div className="bg-surface-light rounded-2xl p-6 mb-8 border border-white/10 flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white">{averageRating}</div>
              <div className="text-sm text-text-muted mt-1">out of 10</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={(Number(averageRating) / 2) >= i + 1 ? 'fill-primary' : 'text-white/20'} 
                  />
                ))}
              </div>
              <div className="text-sm text-text-muted">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </div>
            </div>
          </div>

          <ReviewForm mediaId={mediaId} mediaType={mediaType} onReviewSubmitted={fetchReviews} />
        </div>

        {/* Right Column: Review List */}
        <div className="w-full md:w-2/3">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-surface-light rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-white/10 rounded" />
                      <div className="w-24 h-3 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-16 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-surface-light border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
              <Star size={48} className="text-white/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
              <p className="text-text-muted">Be the first to review this title!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-surface-light rounded-2xl p-6 border border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
                        {review.userPhoto ? (
                          <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={20} className="text-text-muted" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{review.userName}</div>
                        <div className="text-xs text-text-muted">
                          {review.createdAt ? new Date(review.createdAt.toDate?.() || review.createdAt).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-primary fill-primary" />
                      <span className="text-sm font-bold text-white">{review.rating}</span>
                    </div>
                  </div>
                  
                  {review.reviewText && (
                    <p className="text-white/80 leading-relaxed text-sm md:text-base">
                      {review.reviewText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
