'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Parallax effect on background image
    gsap.to(imageRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Staggered title reveal
    const titleSpans = titleRef.current?.querySelectorAll('span');
    if (titleSpans) {
      gsap.from(titleSpans, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'expo.out',
        delay: 0.5
      });
    }

    // Subtext and Buttons reveal
    gsap.from('.hero-content-reveal', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 1
    });

    // Experience text parallax
    gsap.to('.parallax-text', {
      xPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      }
    });
  }, { scope: containerRef });

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-black pt-32 md:pt-40">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div ref={imageRef} className="absolute inset-0 scale-110">
          <Image
            src="/images/golf.png"
            alt="Proxy Car Hero"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            priority
          />
        </div>
        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-20 w-full py-20 md:py-28">
        <div className="max-w-5xl">
          <div className="mb-12 md:mb-20 perspective-1000">
            <h1 ref={titleRef} className="text-[clamp(4rem,12vw,10rem)] font-display font-bold leading-[0.8] tracking-tighter uppercase italic">
              <span className="block text-stroke-primary opacity-50">VOTRE</span>
              <span className="block text-white">PROXY</span>
              <span className="block text-primary">AUTO</span>
            </h1>
          </div>

          <div className="hero-content-reveal flex flex-col md:flex-row md:items-end gap-16 md:gap-24">
            <div className="flex-1">
              <p className="text-sm md:text-lg text-white/60 font-sans tracking-[0.2em] uppercase max-w-xl leading-loose">
                Vente et location de véhicules toutes marques. <br />
                Une sélection rigoureuse pour votre sérénité au quotidien, au meilleur prix du marché.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 items-center">
              <a
                href="#vehicles"
                className="group relative px-10 md:px-12 py-5 md:py-6 bg-red-gradient rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,45,45,0.3)] hover:shadow-[0_0_50px_rgba(255,45,45,0.5)]"
              >
                <span className="relative z-10 text-white font-bold uppercase tracking-[0.3em] text-[10px]">Voir nos véhicules</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700"></div>
              </a>

              <a
                href="#contact"
                className="group px-10 md:px-12 py-5 md:py-6 border border-white/10 rounded-xl text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black transition-all duration-500 flex items-center gap-4"
              >
                Nous Contacter
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Experience Text */}
      <div className="absolute bottom-20 right-0 z-20 hidden lg:block overflow-hidden">
        <span className="parallax-text text-[15rem] font-display font-bold uppercase text-white/[0.02] tracking-tighter leading-none select-none whitespace-nowrap translate-x-20 block">
          OCCASION & LOCATION
        </span>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-40">
        <div className="w-[1px] h-24 bg-gradient-to-b from-primary via-white/20 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-bounce-slow"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
