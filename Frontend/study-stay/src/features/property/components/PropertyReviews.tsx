import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  getPropertyReviews,
  canReviewOwner,
  createReview,
  type ReviewsSummary,
} from '../../reviews/reviews.service';
import StarRating from '../../reviews/components/StarRating';

interface PropertyReviewsProps {
  propertyId: number;
  ownerId: number;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId, ownerId }) => {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const load = async () => {
    try {
      const data = await getPropertyReviews(propertyId);
      setSummary(data);
    } catch (error) {
      console.error('Error loading property reviews:', error);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!isAuthenticated || user?.role !== 'student') return;
      try {
        const result = await canReviewOwner(ownerId);
        setCanReview(result.canReview);
        setAlreadyReviewed(result.alreadyReviewed);
      } catch (error) {
        console.error('Error checking review eligibility:', error);
      }
    };
    checkEligibility();
  }, [isAuthenticated, user?.role, ownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMessage('');
    try {
      await createReview({ owner_id: ownerId, property_id: propertyId, rating, comment: comment || undefined });
      setCanReview(false);
      setAlreadyReviewed(true);
      setComment('');
      await load();
    } catch (error: unknown) {
      const messageText =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'حدث خطأ أثناء إرسال التقييم';
      setFormMessage(messageText);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg font-bold">تقييمات العقار</h3>
        {summary && summary.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(summary.averageRating)} size="text-base" />
            <span className="text-sm font-bold text-slate-700">{summary.averageRating} ({summary.totalReviews})</span>
          </div>
        )}
      </div>

      {canReview && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-50 p-4 mb-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700">شارك تجربتك مع هذا المالك</p>
          <StarRating value={rating} onChange={setRating} size="text-2xl" />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك (اختياري)..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none min-h-[70px]"
          />
          {formMessage && <p className="text-xs font-semibold text-rose-600">{formMessage}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </form>
      )}

      {alreadyReviewed && !canReview && (
        <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 mb-4">شكراً، لقد قمت بتقييم هذا المالك من قبل.</p>
      )}

      {!summary || summary.reviews.length === 0 ? (
        <p className="text-sm text-slate-400">لا توجد تقييمات لهذا العقار حتى الآن.</p>
      ) : (
        <ul className="space-y-3">
          {summary.reviews.slice(0, 5).map((review) => (
            <li key={review.id} className="rounded-xl bg-white border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-800">{review.student_name}</span>
                <StarRating value={review.rating} size="text-sm" />
              </div>
              {review.comment && <p className="text-sm text-slate-600 mt-1">{review.comment}</p>}
              <p className="text-[11px] text-slate-400 mt-2">{new Date(review.created_at).toLocaleDateString('ar-EG')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyReviews;
