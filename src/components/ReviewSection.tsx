import { useState } from 'react';
import { FiStar, FiTrash2, FiEdit2, FiMessageSquare } from 'react-icons/fi';
import { useReviews, useUpsertReview, useDeleteReview } from '../hooks/useReviews';
import { isAuthenticated, getUser } from '../utils/auth';
import Button from './Button';
import type { Review } from '../types';

// ── Star display / picker ─────────────────────────────────────────────────────
const Stars = ({
  rating,
  interactive = false,
  hovered = 0,
  onSelect,
  onHover,
  onLeave,
  size = 16,
}: {
  rating:       number;
  interactive?: boolean;
  hovered?:     number;
  onSelect?:    (r: number) => void;
  onHover?:     (r: number) => void;
  onLeave?:     () => void;
  size?:        number;
}) => {
  const display = hovered || rating;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onSelect?.(i)}
          onMouseEnter={() => onHover?.(i)}
          onMouseLeave={() => onLeave?.()}
          className={interactive ? 'cursor-pointer focus:outline-none' : 'cursor-default'}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
        >
          <FiStar
            size={size}
            className={`transition-colors ${i <= display ? 'text-amber-400' : 'text-gray-300'}`}
            style={{ fill: i <= display ? 'currentColor' : 'none' }}
          />
        </button>
      ))}
    </div>
  );
};

// ── Rating distribution bar ───────────────────────────────────────────────────
const RatingBar = ({ label, count, total }: { label: number; count: number; total: number }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-gray-500 text-xs">{label}</span>
      <FiStar size={11} style={{ fill: 'currentColor' }} className="text-amber-400 flex-shrink-0" />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-5 text-xs text-gray-400">{count}</span>
    </div>
  );
};

// ── Review card ───────────────────────────────────────────────────────────────
const ReviewCard = ({
  review,
  productId,
  onEdit,
}: {
  review:    Review;
  productId: string;
  onEdit:    (r: Review) => void;
}) => {
  const deleteMutation = useDeleteReview(productId);
  const currentUser    = getUser();
  const isOwner        = currentUser?._id === review.user._id;
  const isAdmin        = currentUser?.role === 'admin';

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + meta */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B0000] to-red-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">{review.user.name}</p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          </div>
        </div>
        {/* Owner / admin actions */}
        {(isOwner || isAdmin) && (
          <div className="flex items-center gap-1">
            {isOwner && (
              <Button
                variant="ghost" size="sm"
                onClick={() => onEdit(review)}
                className="text-blue-500 hover:bg-blue-50 !px-1.5"
                title="Edit"
              >
                <FiEdit2 size={14} />
              </Button>
            )}
            <Button
              variant="ghost" size="sm"
              onClick={() => deleteMutation.mutate(review._id)}
              loading={deleteMutation.isPending}
              className="text-red-500 hover:bg-red-50 !px-1.5"
              title="Delete"
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        )}
      </div>
      <div className="mt-3">
        <Stars rating={review.rating} />
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
};

// ── Review form ───────────────────────────────────────────────────────────────
const ReviewForm = ({
  productId,
  initial,
  onDone,
}: {
  productId: string;
  initial?:  Review;
  onDone:    () => void;
}) => {
  const [rating,   setRating]   = useState(initial?.rating  ?? 0);
  const [hovered,  setHovered]  = useState(0);
  const [comment,  setComment]  = useState(initial?.comment ?? '');
  const mutation = useUpsertReview(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    mutation.mutate(
      { rating, comment },
      { onSuccess: () => { onDone(); if (!initial) { setRating(0); setComment(''); } } },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <h4 className="text-sm font-semibold text-gray-800 mb-4">
        {initial ? 'Edit your review' : 'Write a review'}
      </h4>

      {/* Star picker */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-1.5">Your rating *</p>
        <Stars
          rating={rating}
          interactive
          hovered={hovered}
          size={26}
          onSelect={setRating}
          onHover={setHovered}
          onLeave={() => setHovered(0)}
        />
        {!rating && <p className="text-xs text-red-400 mt-1">Please select a rating</p>}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Your comment *</label>
        <textarea
          rows={3}
          required
          maxLength={1000}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000] transition-all"
        />
        <p className="text-right text-xs text-gray-400 mt-0.5">{comment.length}/1000</p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="brand" size="md" loading={mutation.isPending} disabled={!rating}>
          {initial ? 'Update Review' : 'Submit Review'}
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
const ReviewSection = ({ productId }: { productId: string }) => {
  const { data, isLoading } = useReviews(productId);
  const [showForm,   setShowForm]   = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);

  const authenticated = isAuthenticated();
  const currentUser   = getUser();
  const reviews       = data?.reviews       ?? [];
  const total         = data?.totalReviews  ?? 0;
  const average       = data?.averageRating ?? 0;

  // Distribution bars 5 → 1
  const dist = [5, 4, 3, 2, 1].map(star => ({
    label: star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const userReview = reviews.find(r => r.user._id === currentUser?._id);

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiMessageSquare size={20} className="text-[#8B0000]" />
          Customer Reviews
          {total > 0 && <span className="text-sm font-normal text-gray-400">({total})</span>}
        </h2>
        {authenticated && !userReview && !showForm && (
          <Button variant="brandOutline" size="sm" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Summary */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex flex-col items-center justify-center min-w-[90px]">
            <p className="text-5xl font-extrabold text-gray-900 leading-none">{average.toFixed(1)}</p>
            <div className="mt-1.5"><Stars rating={Math.round(average)} /></div>
            <p className="text-xs text-gray-400 mt-1">{total} review{total !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-1.5 justify-center flex flex-col">
            {dist.map(d => <RatingBar key={d.label} label={d.label} count={d.count} total={total} />)}
          </div>
        </div>
      )}

      {/* New review form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm productId={productId} onDone={() => setShowForm(false)} />
        </div>
      )}

      {/* Login prompt */}
      {!authenticated && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <a href="/login" className="font-semibold underline">Sign in</a> to leave a review.
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FiStar size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review =>
            editReview?._id === review._id ? (
              <ReviewForm
                key={review._id}
                productId={productId}
                initial={review}
                onDone={() => setEditReview(null)}
              />
            ) : (
              <ReviewCard
                key={review._id}
                review={review}
                productId={productId}
                onEdit={r => { setEditReview(r); setShowForm(false); }}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
