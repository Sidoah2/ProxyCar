'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HeroCars from './components/HeroCars';
import Trust from './components/Trust';
import FeaturedVehicles from './components/FeaturedVehicles';
import Features from './components/Features';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ReviewsSection from './components/Reviews/ReviewsSection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <HeroCars />
      <Trust />
      <FeaturedVehicles />

      {/* Estimation Teaser */}
      <section className="py-20 md:py-28 bg-[#050505] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="glass p-12 md:p-20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 group hover:border-primary/20 transition-all duration-700">
            <div className="space-y-6 md:max-w-2xl text-center md:text-left">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Vendez votre véhicule</span>
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-display font-bold uppercase tracking-tighter leading-none italic">
                VENDRE MON <br /> <span className="text-white/20">VÉHICULE EN 24H</span>
              </h2>
              <p className="text-white/40 text-sm uppercase tracking-widest leading-relaxed">
                Notre service d&apos;expertise analyse votre véhicule pour vous proposer le meilleur prix du marché. Simple, rapide et sans engagement.
              </p>
            </div>
            <Link 
              href="/estimation"
              className="px-12 py-6 bg-white text-black font-bold uppercase tracking-[0.4em] text-[10px] rounded-xl hover:bg-primary hover:text-white transition-all duration-500 flex items-center gap-4 group/btn"
            >
              Vendre mon véhicule
              <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace Teaser */}
      <section className="py-20 md:py-28 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="glass p-12 md:p-20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 group hover:border-primary/20 transition-all duration-700 border border-white/10">
            <div className="space-y-6 md:max-w-2xl text-center md:text-left">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Parcourez nos offres</span>
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-display font-bold uppercase tracking-tighter leading-none italic">
                ACHETER UNE <br /> <span className="text-white/20">VOITURE</span>
              </h2>
              <p className="text-white/40 text-sm uppercase tracking-widest leading-relaxed">
                Accédez à une large sélection de véhicules révisés, certifiés et prêts à rouler dès aujourd&apos;hui.
              </p>
            </div>
            <Link 
              href="/marketplace"
              className="px-12 py-6 bg-white text-black font-bold uppercase tracking-[0.4em] text-[10px] rounded-xl hover:bg-primary hover:text-white transition-all duration-500 flex items-center gap-4 group/btn"
            >
              Voir le catalogue
              <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Features />
      <ReviewsSection />
      <Contact />
      <Footer />

      {/* Global Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/[0.03] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/[0.02] blur-[120px] rounded-full"></div>
      </div>
    </main>
  );
}

