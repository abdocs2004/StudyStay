import React, { useEffect, useState } from 'react';
import { getMyReviews } from '../reviews.service';
import StarRating from './StarRating';

const MyReviewsWidget: React.FC = () => {
  const [reviews, setReviews] = useState<(Awaited<ReturnType<typeof getMyReviews>>[number])[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error loading my reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
      <h3 className="font-headline text-lg font-bold mb-4">تقييماتي ({reviews.length})</h3>
      <ul className="space-y-2">
        {reviews.slice(0, 5).map((review) => (
          <li key={review.id} className="rounded-xl bg-white px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-slate-800">{review.owner_name}</span>
              <StarRating value={review.rating} size="text-sm" />
            </div>
            {review.comment && <p className="text-xs text-slate-500">{review.comment}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MyReviewsWidget;
