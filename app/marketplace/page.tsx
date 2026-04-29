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
      <section className="pt-32 pb-12 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary"></span>
                <span className="text-primary font-bold uppercase tracking-[0.4em] text-[9px]">Catalogue Digital</span>
              </div>
              <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-bold uppercase tracking-tighter leading-none italic">
                NOTRE <span className="text-white/20 text-stroke">COLLECTION</span>
              </h1>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">
                {filteredListings.length} VÉHICULES DISPONIBLES
              </p>
            </div>
            
            <div className="flex flex-col gap-6 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative group w-full lg:w-[380px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder="Rechercher par modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-14 pr-6 outline-none focus:border-primary transition-all text-[10px] font-bold uppercase tracking-widest placeholder:text-white/20"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "ALL", label: "Tout" },
                  { id: "SALE", label: "Achat" },
                  { id: "RENT", label: "Location" },
                  { id: "DAMAGED", label: "Accidentés" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilter(t.id as any)}
                    className={`px-6 py-3 rounded-lg text-[8px] uppercase tracking-[0.2em] font-bold transition-all border ${
                      filter === t.id ? "bg-primary border-primary text-white" : "bg-white/[0.02] border-white/10 text-white/40 hover:border-white/30"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[16/10] bg-white/5 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredListings.map((listing) => (
                <Link
                  href={`/marketplace/${listing.id}`}
                  key={listing.id}
                  className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.04]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={listing.mainImage}
                      alt={listing.description}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                        listing.type === 'SALE' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {listing.type === 'SALE' ? 'À Vendre' : 'Location'}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6">
                      <span className="text-2xl font-bold text-white">{listing.price.toLocaleString()} €</span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{listing.description}</h3>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      <div className="flex flex-col gap-1">
                        <Gauge size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium truncate uppercase tracking-widest">Certifié</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Shield size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium truncate uppercase tracking-widest">Garantie</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Fuel size={14} className="text-white/20" />
                        <span className="text-[10px] text-white/60 font-medium truncate uppercase tracking-widest">Premium</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {filteredListings.length === 0 && (
                <div className="col-span-full py-32 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Search className="text-white/20" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-widest">Aucun véhicule trouvé</h3>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
                  <button 
                    onClick={() => { setSearchTerm(""); setFilter("ALL"); }}
                    className="mt-8 px-8 py-4 border border-white/10 rounded-xl text-primary font-bold uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all"
                  >
                    Réinitialiser tout
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
