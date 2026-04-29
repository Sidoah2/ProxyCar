'use client';

import React, { useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Gauge, Fuel, Calendar, MessageCircle, Info } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const cars = [
  {
    id: 1,
    name: 'Renault Clio 1.0 TCe',
    brand: 'Renault',
    type: 'occasion',
    price: '13 900 €',
    image: '/images/clio.png',
    specs: { mileage: '45 000 km', year: '2020', fuel: 'Essence' }
  },
  {
    id: 2,
    name: 'Volkswagen Golf 8 2.0 TDI',
    brand: 'Volkswagen',
    type: 'occasion',
    price: '24 500 €',
    image: '/images/golf.png',
    specs: { mileage: '32 000 km', year: '2021', fuel: 'Diesel' }
  },
  {
    id: 3,
    name: 'Peugeot 208 PureTech',
    brand: 'Peugeot',
    type: 'location',
    price: '45 €',
    period: '/ jour',
    image: '/images/p208.png',
    specs: { mileage: '15 000 km', year: '2022', fuel: 'Essence' }
  },
  {
    id: 4,
    name: 'Toyota Yaris Hybrid',
    brand: 'Toyota',
    type: 'location',
    price: '55 €',
    period: '/ jour',
    image: '/images/yaris.png',
    specs: { mileage: '12 000 km', year: '2023', fuel: 'Hybride' }
  },
  {
    id: 5,
    name: 'Dacia Sandero Stepway',
    brand: 'Dacia',
    type: 'occasion',
    price: '15 800 €',
    image: '/images/sandero.png',
    specs: { mileage: '15 000 km', year: '2022', fuel: 'GPL' }
  },
];

const Vehicles = () => {
  const [activeFilter, setActiveFilter] = useState<'tous' | 'occasion' | 'location'>('tous');
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredCars = useMemo(() => {
    if (activeFilter === 'tous') return cars;
    return cars.filter(car => car.type === activeFilter);
  }, [activeFilter]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Reset refs array
    cardsRef.current = cardsRef.current.slice(0, filteredCars.length);

    // Initial entrance for header
    gsap.from('.vehicles-header', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    // Staggered reveal for car cards
    gsap.fromTo(cardsRef.current, 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );

  }, { scope: containerRef, dependencies: [filteredCars] });

  return (
    <section id="vehicles" ref={containerRef} className="py-20 md:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Section */}
        <div className="vehicles-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-display font-bold uppercase tracking-tighter leading-[0.9] text-white">
              NOS <span className="text-primary italic">VÉHICULES</span>
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-md font-medium tracking-tight">
              Découvrez nos véhicules disponibles immédiatement à l&apos;achat ou à la location courte et longue durée.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-sm self-start">
            {(['tous', 'occasion', 'location'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === filter 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredCars.map((car, index) => (
            <div
              key={car.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group flex flex-col bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-primary/40 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                    car.type === 'occasion' 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {car.type === 'occasion' ? 'À Vendre' : 'Disponible'}
                  </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{car.price}</span>
                    {car.period && <span className="text-white/50 text-xs font-medium">{car.period}</span>}
                  </div>
                </div>

                {/* WhatsApp Quick Action */}
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 shadow-lg">
                  <MessageCircle size={20} fill="currentColor" />
                </button>
              </div>

              {/* Info Content */}
              <div className="p-6 md:p-8 flex flex-col flex-grow space-y-6">
                <div className="space-y-2">
                  <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">{car.brand}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{car.name}</h3>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <Gauge size={14} className="text-white/20" />
                    <span className="text-[10px] text-white/60 font-medium">{car.specs.mileage}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Calendar size={14} className="text-white/20" />
                    <span className="text-[10px] text-white/60 font-medium">{car.specs.year}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Fuel size={14} className="text-white/20" />
                    <span className="text-[10px] text-white/60 font-medium">{car.specs.fuel}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                  car.type === 'occasion'
                  ? 'bg-white text-black hover:bg-primary hover:text-white'
                  : 'bg-primary text-white hover:bg-white hover:text-black'
                }`}>
                  {car.type === 'occasion' ? 'Voir détails' : 'Réserver'}
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">Près de 50 autres véhicules en stock</p>
          <button className="group flex items-center gap-4 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-500">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Tout l&apos;inventaire</span>
            <div className="w-8 h-[1px] bg-primary group-hover:w-12 transition-all duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Vehicles;
