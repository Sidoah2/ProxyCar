'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Share2, MessageCircle, Globe, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black py-16 md:py-20 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none opacity-[0.02] select-none">
        <span className="text-[20vw] font-display font-bold uppercase tracking-tighter leading-none translate-y-1/2 block">
          AUTO ELITE
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20 md:mb-24">
          <div className="space-y-6 md:space-y-8">
            <Link href="/" onClick={scrollToTop} className="flex flex-col group">
              <span className="text-3xl font-display tracking-tighter text-white leading-none uppercase italic font-bold">
                AUTO<span className="text-primary">ELITE</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.5em] text-white/30 font-bold mt-1">Achat & Location</span>
            </Link>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs uppercase tracking-widest font-medium">
              Votre partenaire de confiance pour l&apos;achat, la vente et la location de véhicules toutes marques.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-display text-lg uppercase tracking-widest italic font-bold">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Accueil', href: '/', onClick: scrollToTop },
                { label: 'Acheter une voiture', href: '/marketplace' },
                { label: 'vendre mon vehicule', href: '/estimation' },
                { label: 'Contact', href: '/#contact' }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className="text-white/40 hover:text-primary transition-colors text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-2 group"
                  >
                    {item.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-display text-lg uppercase tracking-widest italic font-bold">Légal</h4>
            <ul className="space-y-4">
              {['Mentions Légales', 'Politique de Confidentialité', 'CGV', 'Cookies'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.3em] font-bold">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-display text-lg uppercase tracking-widest italic font-bold">Newsletter</h4>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-medium">Restez informé de nos derniers arrivages.</p>
            <div className="relative group max-w-sm">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full bg-white/[0.03] border-b border-white/10 py-4 px-4 outline-none focus:border-primary transition-all text-white text-xs"
              />
              <button className="absolute right-0 bottom-4 text-primary hover:text-white transition-colors">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">Suivez-nous</span>
            <div className="h-[1px] w-8 bg-white/10"></div>
            <div className="flex gap-8">
              {[
                { Icon: Camera, href: '#', label: 'Instagram' },
                { Icon: Share2, href: '#', label: 'Facebook' },
                { Icon: MessageCircle, href: 'https://wa.me/33600000000', label: 'WhatsApp' },
                { Icon: Globe, href: '/', label: 'Site' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : '_self'}
                  className="text-white/20 hover:text-primary transition-all duration-300 hover:scale-125"
                  aria-label={social.label}
                >
                  <social.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">
            &copy; {currentYear} AUTOELITE. Design by <span className="text-white/40">Modern Studio</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

