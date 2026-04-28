'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Gauge, Fuel, Shield } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const cars = [
  {
    id: 1,
    name: 'Berline de Luxe',
    brand: 'Mercedes-Benz',
    price: '45 900 €',
    image: '/images/car1.png',
    specs: { hp: '250 ch', type: 'Hybride', safety: '5*' }
  },
  {
    id: 2,
    name: 'SUV Premium',
    brand: 'Audi',
    price: '62 500 €',
    image: '/images/car2.png',
    specs: { hp: '340 ch', type: 'Diesel', safety: '5*' }
  },
  {
    id: 3,
    name: 'Sportive Exclusive',
    brand: 'Porsche',
    price: '89 000 €',
    image: '/images/car3.png',
    specs: { hp: '450 ch', type: 'Essence', safety: '5*' }
  },
];

const Vehicles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Delayed refresh to ensure Preloader has cleared
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Entrance Animation for the whole section
    gsap.from('.vehicles-header', {
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

    // Staggered reveal for car cards
    gsap.from(cardsRef.current, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.vehicles-grid',
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <section id="vehicles" ref={containerRef} className="py-20 md:py-28 bg-black relative overflow-hidden">
      {/* Decorative Text Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] flex items-center justify-center select-none">
        <span className="text-[30vw] font-display font-bold uppercase tracking-tighter">COLLECTION</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="vehicles-header flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-10">
          <div className="max-w-3xl">
            <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] mb-8 block">Notre Stock</span>
            <h2 className="text-[clamp(3rem,8vw,6rem)] font-display font-bold uppercase tracking-tighter leading-none italic">
              VÉHICULES <br /> <span className="text-white/20">D&apos;EXCEPTION</span>
            </h2>
          </div>
          <div className="pb-4">
            <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium max-w-sm leading-relaxed">
              Chaque véhicule est rigoureusement sélectionné et préparé dans nos ateliers par nos experts.
            </p>
          </div>
        </div>

        <div className="vehicles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {cars.map((car, index) => (
            <div
              key={car.id}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              className="group relative flex flex-col glass rounded-2xl overflow-hidden transition-all duration-700 hover:border-primary/30 hover:shadow-[0_0_50px_rgba(255,45,45,0.1)]"
            >
              {/* Image Container */}
              <div className="relative h-[400px] md:h-[450px] overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Price Badge */}
                <div className="absolute top-6 right-6 glass px-6 py-2 rounded-full border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                  <span className="text-white font-bold text-lg">{car.price}</span>
                </div>

                {/* Specs Overlay (Visible on Hover) */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo bg-black/60 backdrop-blur-md border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Gauge size={16} className="text-primary" />
                      <span className="text-[10px] text-white font-bold uppercase">{car.specs.hp}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Fuel size={16} className="text-primary" />
                      <span className="text-[10px] text-white font-bold uppercase">{car.specs.type}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Shield size={16} className="text-primary" />
                      <span className="text-[10px] text-white font-bold uppercase">{car.specs.safety}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col flex-grow relative space-y-6">
                <div className="space-y-4">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-2 block">{car.brand}</span>
                  <h3 className="text-2xl md:text-3xl font-display uppercase tracking-widest group-hover:text-primary transition-colors duration-500 italic font-bold leading-tight">{car.name}</h3>
                </div>

                <button className="mt-auto group/btn relative flex items-center justify-between w-full py-6 px-10 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-primary">
                  <span className="relative z-10 text-[10px] uppercase tracking-[0.4em] font-bold text-white">Consulter le dossier</span>
                  <ArrowUpRight size={18} className="relative z-10 text-white group-hover/btn:rotate-45 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-red-gradient translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 md:mt-32 flex justify-center">
          <button className="group flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all duration-500">
            Voir tout l&apos;inventaire
            <div className="w-12 h-[1px] bg-white/20 group-hover:w-24 group-hover:bg-primary transition-all duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Vehicles;
