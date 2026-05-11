"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Listing } from "@/app/lib/types";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ArrowLeft, CheckCircle2, Phone, MessageSquare, Info } from "lucide-react";
import Link from "next/link";
import BookingForm from "@/app/components/BookingForm";

const CarDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "listings", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 space-y-8">
        <h1 className="text-4xl font-display font-bold uppercase italic">Véhicule non trouvé</h1>
        <Link href="/marketplace" className="text-primary uppercase tracking-[0.3em] font-bold text-[10px] hover:text-white transition-colors">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto space-y-12">
        {/* Back Link */}
        <Link href="/marketplace" className="flex items-center gap-4 text-white/40 hover:text-white transition-all group w-fit">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Retour au catalogue</span>
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Main Image */}
          <div className="relative group">
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 glass">
              <img src={listing.mainImage} alt={listing.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl">
              <p className="text-primary font-display text-3xl font-bold uppercase italic">{listing.price} €</p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] bg-primary/10 px-4 py-2 rounded-full">
                {listing.type === "SALE" ? "En Vente" : listing.type === "RENT" ? "Location" : "Accidenté"}
              </span>
              <h1 className="text-[clamp(2rem,5vw,4rem)] font-display font-bold uppercase italic tracking-tighter leading-none">
                {listing.description}
              </h1>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 text-white/60">
                <CheckCircle2 size={18} className="text-primary" />
                <span className="text-xs uppercase tracking-widest font-bold">Certifié AutoElite</span>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <CheckCircle2 size={18} className="text-primary" />
                <span className="text-xs uppercase tracking-widest font-bold">Disponible immédiatement</span>
              </div>
            </div>

            {listing.type === "RENT" ? (
              <BookingForm rentalId={listing.id} carDetails={listing.description} />
            ) : (
              <div className="flex flex-wrap gap-6 pt-10">
                <a href="tel:0759549277" className="flex-grow md:flex-grow-0 px-12 py-6 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-4">
                  <Phone size={16} />
                  Appeler
                </a>
                <button className="flex-grow md:flex-grow-0 px-12 py-6 border border-white/10 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-4">
                  <MessageSquare size={16} />
                  WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Long Description / Specs */}
        <div className="pt-20 border-t border-white/5 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center gap-4">
              <Info size={20} className="text-primary" />
              <h2 className="text-2xl font-display font-bold uppercase italic tracking-widest">Description Détaillée</h2>
            </div>
            <div className="glass p-12 rounded-[2rem] border border-white/10">
              <p className="text-white/60 text-lg leading-relaxed whitespace-pre-wrap">
                {listing.details || "Aucune description supplémentaire fournie pour ce véhicule."}
              </p>
            </div>
          </div>

          {/* Expert Note or Side Info */}
          <div className="space-y-10">
            <h3 className="text-xl font-display font-bold uppercase italic tracking-widest">Notre Engagement</h3>
            <div className="space-y-6">
              {[
                "Inspection rigoureuse en 150 points",
                "Garantie premium incluse",
                "Financement sur mesure possible",
                "Livraison à domicile"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-6 glass rounded-xl border border-white/5">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CarDetailPage;
