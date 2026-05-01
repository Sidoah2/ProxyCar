'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
const staticCars = [
  {
    id: 's1',
    name: 'Arrivage recents',
    brand: 'Proxy',
    image: '/images/golf.png', // Using existing realistic images for now but as static
    tag: 'Design Focus'
  },
  {
    id: 's2',
    name: 'Nos occasion',
    brand: 'Proxy',
    image: '/images/clio.png',
    tag: 'Modern Life'
  },
  {
    id: 's3',
    name: 'Vehicules disponible',
    brand: 'Proxy',
    image: '/images/p208.png',
    tag: 'Innovation'
  }
];

const HeroCars = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.static-card', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'expo.out',
      delay: 1.5
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-10 bg-black overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row gap-8 items-center overflow-x-auto no-scrollbar pb-10">
          {staticCars.map((car) => (
            <div 
              key={car.id}
              className="static-card flex-shrink-0 w-[300px] md:w-[400px] group relative aspect-video rounded-2xl overflow-hidden border border-white/5"
            >
              <Image 
                src={car.image}
                alt={car.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary">{car.tag}</span>
                <h3 className="text-xl font-display font-bold uppercase italic text-white">{car.name}</h3>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCars;
