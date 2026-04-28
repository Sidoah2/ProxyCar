'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Shield, Star, Award, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Trust = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Reveal Image
    gsap.from(imageRef.current, {
      x: -60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    // Reveal Text Content
    gsap.from('.trust-content > *', {
      x: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    // Reveal Cards
    gsap.from('.trust-card', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.trust-grid',
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <section id="trust" ref={containerRef} className="py-20 md:py-28 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Image Side - Trust Element */}
          <div ref={imageRef} className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
            <Image
              src="/images/trust.png"
              alt="Premium Car Details"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-10 left-10 glass p-8 rounded-2xl border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                  <Shield className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-white font-bold text-2xl tracking-tighter italic">10+ ANS</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">D&apos;Expertise</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="trust-content space-y-16 md:space-y-24">
            <div className="space-y-8 md:space-y-10">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] mb-6 block">Notre Engagement</span>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-bold uppercase tracking-tighter leading-none italic">
                L&apos;EXCELLENCE <br /> <span className="text-white/20 text-stroke">SANS CONCESSION</span>
              </h2>
              <p className="text-white/50 text-lg leading-loose max-w-xl">
                Chez PROXY CAR, nous ne vendons pas seulement des voitures, nous offrons une expérience de possession inégalée, basée sur la transparence et la passion.
              </p>
            </div>

            <div className="trust-grid grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {[
                { icon: Star, title: "Qualité Certifiée", desc: "Inspection sur 150 points de contrôle" },
                { icon: Award, title: "Garantie Premium", desc: "Couverture complète jusqu'à 24 mois" },
                { icon: CheckCircle2, title: "Origine Garantie", desc: "Historique complet et traçabilité" },
                { icon: Shield, title: "Service Concierge", desc: "Accompagnement personnalisé dédié" }
              ].map((item, idx) => (
                <div key={idx} className="trust-card flex flex-col gap-6 p-8 glass rounded-2xl border-white/5 hover:border-primary/20 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <item.icon className="text-primary" size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs italic">{item.title}</h4>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
