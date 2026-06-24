import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { submitReview, getUserReviewForMedia } from '@/lib/firebase/reviews';
import type { ContentType } from '@/lib/api/types';

interface ReviewFormProps {
  mediaId: number;
  mediaType: ContentType;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ mediaId, mediaType, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);

  useEffect(() => {
    if (user) {
      getUserReviewForMedia(mediaId, mediaType, user.uid).then(review => {
        if (review) {
          setRating(review.rating);
          setReviewText(review.reviewText);
          setHasExistingReview(true);
        }
      });
    }
  }, [user, mediaId, mediaType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    try {
      await submitReview(
        mediaId,
        mediaType,
        user.uid,
        user.displayName || 'Anonymous User',
        user.photoURL,
        rating,
        reviewText
      );
      setHasExistingReview(true);
      onReviewSubmitted();
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-surface-light border border-white/10 rounded-2xl p-4 md:p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Rate & Review</h3>
        <p className="text-text-muted mb-4">Sign in to leave a review and rate this title.</p>
        {/* We rely on the header sign in button or hero warning, but could add a button here */}
      </div>
    );
  }

  return (
    <div className="bg-surface-light border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">
        {hasExistingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Your Rating (Out of 10)</label>
          <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  type="button"
                  key={starValue}
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starValue)}
                >
                  <Star
                    size={24}
                    className={`transition-colors ${(hoverRating || rating) >= starValue ? 'text-primary fill-primary' : 'text-white/20'}`}
                  />
                </button>
              );
            })}
            <span className="ml-3 text-lg font-bold text-white w-8 text-center">
              {hoverRating || rating || '-'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Your Review (Optional)</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What did you think?"
            className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-white placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-32"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : hasExistingReview ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
