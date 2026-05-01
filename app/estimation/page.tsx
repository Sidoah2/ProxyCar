"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import EstimationForm from "@/app/components/Estimation/EstimationForm";

const EstimationPage = () => {
  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <section className="pt-48 pb-32 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.02] blur-[100px] rounded-full translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Vendez votre véhicule</span>
                <h1 className="text-[clamp(3.5rem,8vw,8rem)] font-display font-bold uppercase tracking-tighter leading-[0.85] italic">
                  VENDRE MON <br /> <span className="text-white/20 text-stroke">VÉHICULE</span>
                </h1>
              </div>

              <div className="space-y-10">
                <p className="text-white/40 text-lg leading-relaxed uppercase tracking-widest max-w-lg">
                  Obtenez une offre de reprise ferme en moins de 24 heures. Notre algorithme et nos experts analysent le marché en temps réel pour vous proposer le meilleur prix.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Rapide", desc: "Réponse sous 24h" },
                    { label: "Gratuit", desc: "Sans engagement" },
                    { label: "Sûr", desc: "Paiement immédiat" },
                    { label: "Expert", desc: "Analyse certifiée" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <span className="text-primary font-bold text-xs uppercase tracking-widest italic">{item.label}</span>
                      <span className="text-white/20 text-[9px] uppercase tracking-widest font-bold">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass p-12 md:p-16 rounded-3xl border-white/10 shadow-2xl relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full"></div>
              <EstimationForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default EstimationPage;
