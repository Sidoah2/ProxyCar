'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Star, Send, CheckCircle, User, Mail, ChevronRight, MessageCircle } from 'lucide-react';
import { ServiceType } from '@/app/lib/types';

interface ReviewFormProps {
  defaultServiceType?: ServiceType;
  relatedId?: string;
  onSuccess?: () => void;
}

const SERVICE_OPTIONS: { value: ServiceType; label: string; desc: string }[] = [
  { value: 'GLOBAL', label: 'Expérience Générale', desc: 'Avis global sur PROXY CAR' },
  { value: 'SALE', label: 'Achat Véhicule', desc: 'Avis sur un achat effectué' },
  { value: 'RENT', label: 'Location Véhicule', desc: 'Avis sur une location effectuée' },
];

const StarRating = ({
  rating,
  hovered,
  onHover,
  onClick,
}: {
  rating: number;
  hovered: number;
  onHover: (n: number) => void;
  onClick: (n: number) => void;
}) => (
  <div className="flex gap-2" onMouseLeave={() => onHover(0)}>
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onClick(star)}
        onMouseEnter={() => onHover(star)}
        className="transition-all duration-150 focus:outline-none"
        aria-label={`Note ${star} sur 5`}
      >
        <Star
          size={36}
          className={`transition-all duration-150 ${
            star <= (hovered || rating)
              ? 'fill-primary text-primary scale-110 drop-shadow-[0_0_8px_rgba(255,45,45,0.6)]'
              : 'text-white/20 hover:text-white/40'
          }`}
        />
      </button>
    ))}
  </div>
);

const RATING_LABELS = ['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'];

export default function ReviewForm({ defaultServiceType = 'GLOBAL', relatedId, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>(defaultServiceType);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Client-side preflight
    const clientErrors: string[] = [];
    if (name.trim().length < 3) clientErrors.push('Le nom doit contenir au moins 3 caractères.');
    if (rating < 1) clientErrors.push('Veuillez sélectionner une note.');
    if (comment.trim().length < 10) clientErrors.push('Le commentaire doit contenir au moins 10 caractères.');
    if (clientErrors.length > 0) { setErrors(clientErrors); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name,
        email,
        rating,
        comment,
        serviceType,
        relatedId: relatedId || null,
        status: 'NEW', // New reviews need approval
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setName(''); setEmail(''); setRating(0); setComment('');
      onSuccess?.();
    } catch (error) {
      console.error("Submission error:", error);
      setErrors(['Une erreur est survenue. Veuillez réessayer.']);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-display font-bold uppercase italic tracking-widest">Merci pour votre avis !</h3>
          <p className="text-white/40 text-sm uppercase tracking-widest max-w-sm">
            Votre témoignage a été soumis et sera visible prochainement.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-primary transition-colors font-bold border-b border-white/10 pb-1"
        >
          Laisser un autre avis
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-4">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold flex items-center gap-2">
          <ChevronRight size={10} className="text-primary" /> Service concerné
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SERVICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setServiceType(opt.value)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                serviceType === opt.value
                  ? 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-widest transition-colors ${serviceType === opt.value ? 'text-primary' : 'text-white/60'}`}>
                {opt.label}
              </p>
              <p className="text-[10px] text-white/20 mt-1 tracking-wide">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold flex items-center gap-2">
          <Star size={10} className="text-primary" /> Votre note
        </p>
        <div className="space-y-3">
          <StarRating rating={rating} hovered={hovered} onHover={setHovered} onClick={setRating} />
          {(hovered || rating) > 0 && (
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary font-bold animate-in fade-in duration-200">
              {RATING_LABELS[hovered || rating]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3 group/input">
          <div className="flex items-center gap-2 text-white/40 group-focus-within/input:text-primary transition-colors">
            <User size={11} />
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Votre Nom *</label>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Jean Dupont"
            maxLength={80}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
          />
        </div>
        <div className="space-y-3 group/input">
          <div className="flex items-center gap-2 text-white/40 group-focus-within/input:text-primary transition-colors">
            <Mail size={11} />
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Email (facultatif)</label>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: jean@email.com"
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
          />
        </div>
      </div>

      <div className="space-y-3 group/input">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40 group-focus-within/input:text-primary transition-colors">
            <MessageCircle size={11} />
            <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Votre Commentaire *</label>
          </div>
          <span className={`text-[9px] font-bold transition-colors ${comment.length > 450 ? 'text-primary' : 'text-white/20'}`}>
            {comment.length}/500
          </span>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec PROXY CAR..."
          rows={4}
          maxLength={500}
          className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs resize-none placeholder:text-white/10"
        />
      </div>

      {errors.length > 0 && (
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in duration-300">
          {errors.map((err, i) => (
            <p key={i} className="text-[10px] text-primary uppercase tracking-widest font-bold">• {err}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-6 bg-white text-black rounded-2xl transition-all duration-500 hover:bg-primary hover:text-white group/btn shadow-xl shadow-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-4 font-bold uppercase tracking-[0.4em] text-[10px]">
          {loading ? 'Envoi en cours...' : 'Envoyer votre avis'}
          {!loading && <Send size={13} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />}
        </span>
      </button>
    </form>
  );
}
