'use client';

import React, { useRef } from 'react';
import { ShieldCheck, Car, Tag, Zap, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: 'Achat sécurisé',
    description: 'Transactions garanties et transparence totale sur chaque véhicule.',
    icon: ShieldCheck,
    tag: 'Garantie'
  },
  {
    title: 'Véhicules vérifiés',
    description: 'Expertise rigoureuse sur 150 points de contrôle avant la mise en vente.',
    icon: Car,
    tag: 'Qualité'
  },
  {
    title: 'Prix compétitifs',
    description: 'Le meilleur rapport qualité-prix sur le marché du luxe automobile.',
    icon: Tag,
    tag: 'Marché'
  },
  {
    title: 'Service rapide',
    description: 'Prise en charge immédiate et démarches administratives simplifiées.',
    icon: Zap,
    tag: 'Efficacité'
  },
];

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Reveal Header
    gsap.from('.features-header', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    // Stagger Cards
    gsap.from('.feature-card', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <section id="services" ref={containerRef} className="py-20 md:py-28 bg-[#030303] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/[0.01] skew-x-[-20deg] translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="features-header flex flex-col lg:flex-row items-end justify-between mb-20 md:mb-32 gap-12">
          <div className="max-w-3xl">
            <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] mb-8 block">Pourquoi Nous Choisir</span>
            <h2 className="text-[clamp(3rem,8vw,6rem)] font-display font-bold uppercase tracking-tighter leading-none italic">
              L&apos;ENGAGEMENT <br /> <span className="text-white/20 text-stroke">DE LA PERFECTION</span>
            </h2>
          </div>
          <div className="lg:mb-6">
            <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium max-w-sm leading-relaxed">
              Plus qu&apos;une vente, nous vous offrons une expérience sereine et personnalisée pour votre prochain véhicule de prestige.
            </p>
          </div>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 md:p-10 glass rounded-2xl overflow-hidden transition-all duration-700 hover:border-primary/40 hover:-translate-y-2 space-y-8"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ChevronRight className="text-primary w-5 h-5" />
              </div>

              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center transform transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              <div className="space-y-6">
                <span className="text-primary/40 text-[9px] font-bold uppercase tracking-[0.4em] block group-hover:text-primary transition-colors">{feature.tag}</span>
                <h3 className="text-xl md:text-2xl font-display uppercase tracking-widest italic font-bold group-hover:text-white transition-colors leading-tight">{feature.title}</h3>
                <p className="text-white/30 text-sm leading-loose font-medium uppercase tracking-wider group-hover:text-white/50 transition-colors">{feature.description}</p>
              </div>

              <div className="mt-8 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
