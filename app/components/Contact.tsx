'use client';

import React, { useRef } from 'react';
import { Mail, Phone, MapPin, Send, Camera, Globe, Share2, User, MessageCircle, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Reveal Left Side
    gsap.from('.contact-info > *', {
      x: -60,
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

    // Reveal Right Side (Form)
    gsap.from('.contact-form', {
      x: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        toggleActions: 'play none none none'
      }
    });

    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <section id="contact" ref={containerRef} className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[150px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[150px] rounded-full -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* Left Side: Concierge Info */}
          <div className="contact-info space-y-20">
            <div className="space-y-8">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] block font-sans">Restons en contact</span>
              <h2 className="text-[clamp(3rem,8vw,5.5rem)] font-display font-bold uppercase tracking-tighter leading-[0.9] italic">
                PRÊT POUR <br /> <span className="text-white/10 text-stroke">L&apos;EXCEPTION ?</span>
              </h2>
              <p className="text-white/40 text-lg max-w-lg leading-relaxed uppercase tracking-widest font-sans">
                Notre conciergerie est à votre disposition pour toute demande personnalisée ou visite privée en showroom.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: 'Email', value: 'proxycars57@outlook.fr', href: 'mailto:proxycars57@outlook.fr' },
                { icon: Phone, label: 'téléphone', value: '07 59 54 92 77', href: 'tel:0759549277' },
                { icon: MapPin, label: 'adresse', value: '24 rue du Moulin, Florange', href: '#' }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="flex flex-col gap-6 p-8 glass rounded-3xl hover:border-primary/40 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary transition-all duration-500">
                    <item.icon size={20} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">{item.label}</p>
                    <p className="text-xs font-bold uppercase tracking-widest leading-relaxed break-words">{item.value}</p>
                  </div>
                </a>
              ))}

              <div className="flex flex-col gap-6 p-8 glass rounded-3xl justify-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Suivez-nous</p>
                <div className="flex gap-8">
                  {[Camera, Share2, MessageCircle, Globe].map((Icon, i) => (
                    <a key={i} href="#" className="text-white/20 hover:text-primary transition-all duration-300 hover:scale-125">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Form */}
          <div className="contact-form relative group">
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative glass p-10 md:p-14 rounded-[2.5rem] border-white/10 shadow-2xl space-y-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold uppercase italic tracking-widest">Demande Directe</h3>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Réponse sous 2 heures ouvrées</p>
              </div>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 relative group/input">
                    <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within/input:text-primary transition-colors">
                      <User size={12} />
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Votre Nom</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: Jean Dupont"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
                    />
                  </div>
                  <div className="space-y-3 relative group/input">
                    <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within/input:text-primary transition-colors">
                      <Mail size={12} />
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Votre Email</label>
                    </div>
                    <input
                      type="email"
                      placeholder="Ex: jean@email.com"
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-3 relative group/input">
                  <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within/input:text-primary transition-colors">
                    <ChevronRight size={12} />
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Objet de la demande</label>
                  </div>
                  <select className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs appearance-none cursor-pointer">
                    <option className="bg-[#111]">Achat d&apos;un véhicule de prestige</option>
                    <option className="bg-[#111]">Service de reprise / vendre mon vehicule</option>
                    <option className="bg-[#111]">Demande de conciergerie VIP</option>
                    <option className="bg-[#111]">Autres informations</option>
                  </select>
                </div>

                <div className="space-y-3 relative group/input">
                  <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within/input:text-primary transition-colors">
                    <MessageCircle size={12} />
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold">Votre Message</label>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Détaillez votre projet automobile..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs resize-none placeholder:text-white/10"
                  ></textarea>
                </div>

                <button className="w-full py-6 bg-white text-black rounded-2xl transition-all duration-500 hover:bg-primary hover:text-white group/btn shadow-xl shadow-white/5">
                  <span className="flex items-center justify-center gap-4 font-bold uppercase tracking-[0.4em] text-[10px]">
                    Envoyer ma demande
                    <Send size={14} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-500" />
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
