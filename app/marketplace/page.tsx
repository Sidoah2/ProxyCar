"use client";

import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Listing } from "@/app/lib/types";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import { Filter, Search, ArrowUpRight, Gauge, Fuel, Shield } from "lucide-react";
import Link from "next/link";

const MarketplacePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "SALE" | "RENT" | "DAMAGED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, "listings"), where("status", "==", "APPROVED"), orderBy("createdAt", "desc"));
        
        if (filter !== "ALL") {
          q = query(collection(db, "listings"), where("type", "==", filter), where("status", "==", "APPROVED"), orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);
        const fetchedListings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
        setListings(fetchedListings);
      } catch (error) {
        console.error("Marketplace Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filter]);

  const filteredListings = listings.filter(listing => 
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      {/* Header */}
      <section className="pt-40 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-6">
              <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Showroom Digital</span>
              <h1 className="text-[clamp(3rem,8vw,8rem)] font-display font-bold uppercase tracking-tighter leading-[0.85] italic">
                NOTRE <br /> <span className="text-white/20 text-stroke">COLLECTION</span>
              </h1>
            </div>
            
            <div className="flex flex-col gap-8 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative group w-full lg:w-[400px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="RECHERCHER UN MODÈLE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-primary transition-all text-[10px] font-bold uppercase tracking-widest placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                {["ALL", "SALE", "RENT", "DAMAGED"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t as any)}
                    className={`px-8 py-4 rounded-xl text-[9px] uppercase tracking-widest font-bold transition-all border ${
                      filter === t ? "bg-primary border-primary text-white" : "border-white/10 text-white/40 hover:border-white/30"
                    }`}
                  >
                    {t === "ALL" ? "Tout" : t === "SALE" ? "Vente" : t === "RENT" ? "Location" : "Accidentés"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {filteredListings.map((listing) => (
                <Link
                  href={`/marketplace/${listing.id}`}
                  key={listing.id}
                  className="group relative flex flex-col glass rounded-2xl overflow-hidden transition-all duration-700 hover:border-primary/30"
                >
                  <div className="relative h-[400px] overflow-hidden">
                    <img
                      src={listing.mainImage}
                      alt={listing.description}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute top-6 right-6 glass px-6 py-2 rounded-full border-white/10">
                      <span className="text-white font-bold text-lg">{listing.price.toLocaleString()} €</span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex flex-col flex-grow">
                    <div className="space-y-4">
                      <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] block">
                        {listing.type === "RENT" ? "Location Premium" : "Vente Exclusive"}
                      </span>
                      <h3 className="text-2xl font-display uppercase tracking-widest group-hover:text-primary transition-colors duration-500 italic font-bold leading-tight">
                        {listing.description}
                      </h3>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-white/30">
                          <Gauge size={14} />
                          <span className="text-[10px] uppercase font-bold tracking-widest">CERTIFIÉ</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/30">
                          <Fuel size={14} />
                          <span className="text-[10px] uppercase font-bold tracking-widest">PREMIUM</span>
                        </div>
                      </div>
                      <ArrowUpRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
              {filteredListings.length === 0 && (
                <div className="col-span-full py-40 text-center space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                    <Search className="text-white/20" size={32} />
                  </div>
                  <h3 className="text-2xl font-display font-bold uppercase italic tracking-widest">Aucun résultat</h3>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Nous n'avons trouvé aucun véhicule correspondant à "{searchTerm}".</p>
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="text-primary font-bold uppercase tracking-widest text-[9px] hover:text-white transition-colors pt-4"
                  >
                    Réinitialiser la recherche
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default MarketplacePage;
