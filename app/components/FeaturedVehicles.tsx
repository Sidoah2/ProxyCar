'use client';

import React, { useEffect, useState, useRef } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Listing } from '@/app/lib/types';
import Image from 'next/image';
import { ArrowUpRight, Gauge, Fuel, Calendar, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FeaturedVehicles = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "APPROVED"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
        setListings(data);

        // Refresh ScrollTrigger after content load
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      } catch (error) {
        console.error("Error fetching featured vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useGSAP(() => {
    // Small delay to ensure DOM is ready and images are starting to load
    const timer = setTimeout(() => {
      const validCards = cardsRef.current.filter(card => card !== null);
      if (validCards.length > 0) {
        gsap.from(validCards, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        });
      }
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, { scope: containerRef, dependencies: [listings] });

  return (
    <section ref={containerRef} id="featured-vehicles" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Arrivages Récents</span>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-display font-bold uppercase tracking-tighter leading-tight text-white">
              VÉHICULES <span className="text-white/20 italic">DISPONIBLES</span>
            </h2>
            <p className="text-white/40 text-sm max-w-md font-medium">
              Une sélection de nos dernières pépites disponibles immédiatement à l&apos;achat ou à la location.
            </p>
          </div>

          <Link href="/marketplace" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
            Voir tout le catalogue
            <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="text-primary animate-spin" size={32} />
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Chargement du stock...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
              >
                <Link
                  href={`/marketplace/${listing.id}`}
                  className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={listing.mainImage}
                      alt={listing.description}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${listing.type === 'SALE'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                        {listing.type === 'SALE' ? 'À Vendre' : 'Location'}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6">
                      <span className="text-2xl font-bold text-white">{listing.price.toLocaleString()} €</span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">{listing.description}</h3>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      <div className="flex flex-col gap-1">
                        <Gauge size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium truncate">CERTIFIÉ</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Calendar size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium">{listing.createdAt?.seconds ? new Date(listing.createdAt.seconds * 1000).getFullYear() : '2024'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Fuel size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium truncate">PREMIUM</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Aucun véhicule disponible pour le moment</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
