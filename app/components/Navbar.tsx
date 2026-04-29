'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Menu, X, Camera, Share2, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Estimation', href: '/estimation' },
    { label: 'Contact', href: '/#contact' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-6 ${isScrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-lg shadow-2xl border-b border-white/5' : 'bg-transparent'
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-4 z-[110]">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-gradient rounded-xl transform group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-500 shadow-lg shadow-primary/20"></div>
              <span className="relative z-10 text-white font-display text-xl md:text-2xl font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-display tracking-tighter text-white leading-none uppercase italic font-bold">
                PROXY<span className="text-primary">CAR</span>
              </span>
              <span className="text-[7px] md:text-[8px] uppercase tracking-[0.5em] text-white/40 font-bold">Achat & Location</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-12">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 hover:text-white transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="lg:hidden relative z-[110] w-12 h-12 flex items-center justify-center text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-700 ease-expo ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="absolute inset-0 bg-black"></div>

        <div className="relative h-full flex flex-col justify-center px-12 space-y-16">
          <div className="flex flex-col space-y-10">
            {navLinks.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter italic transition-all duration-500 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="text-white hover:text-primary transition-all duration-300">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className={`space-y-8 transition-all duration-700 delay-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="h-[1px] w-12 bg-primary"></div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold">Votre partenaire automobile</p>
            <div className="flex gap-10 text-white/60">
              <Camera size={24} className="hover:text-primary transition-all duration-300 hover:scale-125 cursor-pointer" />
              <Share2 size={24} className="hover:text-primary transition-all duration-300 hover:scale-125 cursor-pointer" />
              <MessageCircle size={24} className="hover:text-primary transition-all duration-300 hover:scale-125 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
