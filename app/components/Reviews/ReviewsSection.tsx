'use client';

import React, { useState } from 'react';
import { Star, PenLine } from 'lucide-react';
import ReviewForm from '@/app/components/Reviews/ReviewForm';
import ReviewsList from '@/app/components/Reviews/ReviewsList';

export default function ReviewsSection() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section id="avis" className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/[0.02] blur-[200px] rounded-full -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/[0.02] blur-[150px] rounded-full translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10 space-y-20">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] block">
              Témoignages
            </span>
            <h2 className="text-[clamp(2.8rem,7vw,5.5rem)] font-display font-bold uppercase tracking-tighter leading-[0.9] italic">
              CE QUE DISENT
              <br />
              <span className="text-white/10 text-stroke">NOS CLIENTS</span>
            </h2>
            <p className="text-white/40 text-sm max-w-md leading-relaxed uppercase tracking-wider">
              Des témoignages authentiques de clients qui ont fait confiance à PROXY CAR.
            </p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={`flex items-center gap-4 px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] border transition-all duration-500 shrink-0 ${
              showForm
                ? 'bg-white/5 border-white/20 text-white/60'
                : 'bg-white text-black border-white hover:bg-primary hover:text-white hover:border-primary shadow-xl shadow-white/5'
            }`}
          >
            <PenLine size={14} />
            {showForm ? 'Masquer le formulaire' : 'Laisser un avis'}
          </button>
        </div>

        {/* Review Form (togglable) */}
        {showForm && (
          <div className="glass p-10 md:p-14 rounded-[2.5rem] border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-2 mb-10">
              <div className="flex items-center gap-3">
                <Star size={18} className="text-primary" />
                <h3 className="text-2xl font-display font-bold uppercase italic tracking-widest">
                  Votre Avis
                </h3>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold ml-7">
                Sans inscription requise
              </p>
            </div>
            <ReviewForm
              onSuccess={() => {
                setShowForm(false);
                setRefreshKey((k) => k + 1);
              }}
            />
          </div>
        )}

        {/* Reviews List */}
        <ReviewsList key={refreshKey} />
      </div>
    </section>
  );
}
