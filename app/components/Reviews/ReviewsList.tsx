'use client';

import React, { useEffect, useState } from 'react';
import { Star, Quote, Calendar } from 'lucide-react';
import { Review, ServiceType } from '@/app/lib/types';

interface ReviewsListProps {
  serviceType?: ServiceType;
  relatedId?: string;
  limit?: number;
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  GLOBAL: 'Général',
  SALE: 'Achat',
  RENT: 'Location',
};

const SERVICE_COLORS: Record<ServiceType, string> = {
  GLOBAL: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  SALE: 'text-primary bg-primary/10 border-primary/20',
  RENT: 'text-green-400 bg-green-400/10 border-green-400/20',
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? 'fill-primary text-primary' : 'text-white/10'}
        />
      ))}
    </div>
  );
}

function formatDate(createdAt: any): string {
  if (!createdAt) return '';

  try {
    // Handle Firestore Timestamp (both client-side .seconds and server-side ._seconds)
    const seconds = createdAt?.seconds ?? createdAt?._seconds;
    
    if (seconds !== undefined) {
      return new Date(seconds * 1000).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    // Handle Date object or ISO string
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <div
      className="glass p-8 rounded-3xl space-y-6 hover:border-white/15 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-lg uppercase">
            {review.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold tracking-widest text-white">{review.name}</p>
            <StarDisplay rating={review.rating} />
          </div>
        </div>
        <span className={`text-[9px] uppercase tracking-[0.3em] font-bold px-3 py-1.5 rounded-full border ${SERVICE_COLORS[review.serviceType]}`}>
          {SERVICE_LABELS[review.serviceType]}
        </span>
      </div>

      {/* Quote Icon */}
      <Quote size={20} className="text-primary/30" />

      {/* Comment */}
      <p className="text-white/50 text-sm leading-relaxed">{review.comment}</p>

      {/* Footer */}
      <div className="flex items-center gap-2 text-white/20 pt-2 border-t border-white/5">
        <Calendar size={12} />
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">{formatDate(review.createdAt)}</span>
      </div>
    </div>
  );
}

function AverageRating({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const rounded = Math.round(avg * 10) / 10;

  return (
    <div className="flex flex-col items-center gap-4 glass p-10 rounded-3xl text-center">
      <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold">Note Globale</p>
      <p className="text-7xl font-display font-bold text-white">{rounded}</p>
      <StarDisplay rating={Math.round(avg)} />
      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{reviews.length} avis</p>
    </div>
  );
}

export default function ReviewsList({ serviceType, relatedId, limit = 20 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ServiceType | 'ALL'>(serviceType ?? 'ALL');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== 'ALL') params.set('serviceType', filter);
        if (relatedId) params.set('relatedId', relatedId);

        const res = await fetch(`/api/reviews?${params.toString()}`);
        const data = await res.json();
        setReviews(data.reviews ?? []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [filter, relatedId]);

  const displayed = reviews.slice(0, limit);

  return (
    <div className="space-y-12">
      {/* Filter Bar */}
      {!serviceType && (
        <div className="flex flex-wrap gap-3">
          {(['ALL', 'GLOBAL', 'SALE', 'RENT'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-3 rounded-full text-[9px] uppercase tracking-[0.4em] font-bold border transition-all duration-300 ${
                filter === type
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'Tous' : SERVICE_LABELS[type]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-8 rounded-3xl space-y-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  <div className="h-2 bg-white/5 rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/5 rounded w-full"></div>
                <div className="h-2 bg-white/5 rounded w-4/5"></div>
                <div className="h-2 bg-white/5 rounded w-3/5"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Star size={40} className="text-white/10 mx-auto" />
          <p className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold">
            Aucun avis pour le moment
          </p>
          <p className="text-white/20 text-xs">Soyez le premier à partager votre expérience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.length >= 3 && <AverageRating reviews={reviews} />}
          {displayed.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
