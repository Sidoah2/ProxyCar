"use client";

import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Lead, Listing, Reservation } from "@/app/lib/types";
import { LayoutDashboard, Car, FileText, Settings, LogOut, ChevronRight, Users, Calendar, AlertTriangle, ExternalLink, MessageCircle, Mail, User, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardClient = () => {
  const [view, setView] = useState<"OVERVIEW" | "LISTINGS" | "LEADS" | "RESERVATIONS">("OVERVIEW");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCar, setNewCar] = useState({
    description: "",
    price: "",
    type: "SALE",
    details: "",
    notes: ""
  });
  const router = useRouter();

  const handleAddListing = async () => {
    if (!selectedFile || !newCar.description || !newCar.price) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error("Upload failed");

      await addDoc(collection(db, "listings"), {
        description: newCar.description,
        price: Number(newCar.price),
        type: newCar.type,
        details: newCar.details,
        notes: newCar.notes,
        mainImage: uploadData.secure_url,
        status: "APPROVED",
        createdAt: serverTimestamp()
      });

      setShowAddModal(false);
      setNewCar({ description: "", price: "", type: "SALE", details: "", notes: "" });
      setSelectedFile(null);

      // Refresh local inventory
      const listingsQuery = query(collection(db, "listings"), orderBy("createdAt", "desc"));
      const listingsSnap = await getDocs(listingsQuery);
      setListings(listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing)));

    } catch (error) {
      console.error("Publishing Error:", error);
      alert("Erreur lors de la publication.");
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsQuery = query(collection(db, "estimations"), orderBy("createdAt", "desc"));
        const listingsQuery = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const reservationsQuery = query(collection(db, "reservations"), orderBy("createdAt", "desc"));

        const [leadsSnap, listingsSnap, reservationsSnap] = await Promise.all([
          getDocs(leadsQuery),
          getDocs(listingsQuery),
          getDocs(reservationsQuery)
        ]);

        setLeads(leadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
        setListings(listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing)));
        setReservations(reservationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Annonces Actives", value: listings.length.toString(), color: "text-blue-500" },
          { label: "Nouvelles Estimations", value: leads.length.toString(), color: "text-primary" },
          { label: "Réservations en cours", value: reservations.length.toString(), color: "text-green-500" },
          { label: "Revenu Mensuel", value: "0 €", color: "text-white" },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-2xl space-y-4">
            <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">{stat.label}</p>
            <p className={`text-4xl font-display font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
        <section className="space-y-10">
          <h2 className="text-xl font-display font-bold uppercase tracking-widest italic">Dernières Estimations</h2>
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="glass p-6 rounded-xl flex items-center justify-between hover:border-primary/20 transition-all group">
                <div className="space-y-2">
                  <p className="font-bold text-sm uppercase tracking-wide">{lead.carDetails}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{lead.name}</p>
                </div>
                <span className="text-[8px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest">{lead.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <h2 className="text-xl font-display font-bold uppercase tracking-widest italic">Inventaire Récent</h2>
          <div className="space-y-4">
            {listings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="glass p-6 rounded-xl flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <img src={listing.mainImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-xs uppercase tracking-wide">{listing.description}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest">{listing.price}€</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 p-10 flex flex-col gap-16 sticky top-0 h-screen">
        <div className="flex flex-col group">
          <span className="text-2xl font-display tracking-tighter text-white leading-none uppercase italic font-bold">
            PROXY<span className="text-primary">ADMIN</span>
          </span>
          <span className="text-[8px] uppercase tracking-[0.5em] text-white/20 font-bold mt-1">Management Portal</span>
        </div>

        <nav className="flex-grow space-y-4">
          {[
            { id: "OVERVIEW", name: "Vue d'ensemble", icon: LayoutDashboard },
            { id: "LISTINGS", name: "Annonces", icon: Car },
            { id: "LEADS", name: "Estimations", icon: FileText },
            { id: "RESERVATIONS", name: "Réservations", icon: Calendar },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${view === item.id ? "bg-primary text-white" : "text-white/30 hover:bg-white/5 hover:text-white"
                }`}
            >
              <item.icon size={16} />
              {item.name}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 text-white/20 hover:text-red-500 transition-colors text-[10px] uppercase tracking-widest font-bold"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-20 space-y-12 overflow-y-auto">
        <header className="flex justify-between items-end">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Dashboard</span>
            <h1 className="text-5xl font-display font-bold uppercase italic tracking-tighter">
              {view === "OVERVIEW" ? "VUE D'ENSEMBLE" :
                view === "LISTINGS" ? "GESTION STOCK" :
                  view === "LEADS" ? "ESTIMATIONS" : "RÉSERVATIONS LOC"}
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5"
          >
            Ajouter une annonce
          </button>
        </header>

        {view === "OVERVIEW" && renderOverview()}

        {view === "LISTINGS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {listings.map(listing => (
              <div key={listing.id} className="glass rounded-2xl overflow-hidden border border-white/5 group">
                <div className="aspect-video relative">
                  <img src={listing.mainImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest">{listing.price} €</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm uppercase tracking-widest">{listing.description}</h3>
                    <span className="text-[8px] bg-white/5 px-2 py-1 rounded uppercase">{listing.type}</span>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button className="flex-grow py-3 border border-white/10 rounded-lg text-[9px] uppercase font-bold tracking-widest hover:bg-white/5">Modifier</button>
                    <button className="px-4 py-3 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                      <LogOut size={14} className="rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {view === "LEADS" && (
          <div className="space-y-4">
            {leads.map(lead => (
              <div key={lead.id} className="glass p-10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-primary/20 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold uppercase tracking-widest text-[9px]">Estimation</span>
                    <span className="text-white/20 text-[9px] uppercase tracking-widest">
                      {lead.createdAt?.seconds
                        ? new Date(lead.createdAt.seconds * 1000).toLocaleDateString()
                        : "En attente..."}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold uppercase italic tracking-widest">{lead.carDetails}</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">{lead.name} • {lead.phone} • {lead.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="px-8 py-4 bg-white/5 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-white/10 transition-all border border-white/5"
                  >
                    Détails
                  </button>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/\s/g, '')}?text=Bonjour ${lead.name}, concernant votre demande d'estimation pour la ${lead.carDetails}...`}
                    target="_blank"
                    className="px-8 py-4 bg-primary text-white text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                  >
                    Contacter
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "RESERVATIONS" && (
          <div className="space-y-6">
            {reservations.map(res => {
              const start = new Date(res.startDate.seconds * 1000).toLocaleDateString();
              const end = new Date(res.endDate.seconds * 1000).toLocaleDateString();

              return (
                <div key={res.id} className={`glass p-10 rounded-[2rem] border transition-all ${res.conflict ? "border-red-500/30" : "border-white/5"} group hover:border-primary/20`}>
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full ${res.status === "PENDING_CONFLICT" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                          }`}>
                          {res.status === "PENDING_CONFLICT" ? "Conflit Détecté" : res.status}
                        </span>
                        <span className="text-white/20 text-[9px] uppercase tracking-widest">
                          Reçu le {new Date(res.createdAt.seconds * 1000).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-3xl font-display font-bold uppercase italic tracking-widest">{res.carDetails}</h3>
                        <div className="flex items-center gap-6 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                          <span className="flex items-center gap-2"><User size={12} className="text-primary" /> {res.name}</span>
                          <span className="flex items-center gap-2"><MapPin size={12} className="text-primary" /> {res.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-6 bg-white/[0.02] rounded-2xl border border-white/5 w-fit">
                        <div className="text-center px-4 border-r border-white/10">
                          <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Du</p>
                          <p className="text-sm font-bold tracking-widest">{start}</p>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Au</p>
                          <p className="text-sm font-bold tracking-widest">{end}</p>
                        </div>
                      </div>

                      {res.conflict && res.alternativeStartDate && (
                        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3">
                          <div className="flex items-center gap-3 text-red-500 text-[9px] font-bold uppercase tracking-widest">
                            <AlertTriangle size={14} />
                            Alternative Suggérée
                          </div>
                          <p className="text-white/60 text-xs tracking-wide">
                            Disponible du <span className="text-white font-bold">{new Date(res.alternativeStartDate.seconds * 1000).toLocaleDateString()}</span> au <span className="text-white font-bold">{new Date(res.alternativeEndDate!.seconds * 1000).toLocaleDateString()}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 shrink-0">
                      <a
                        href={`https://wa.me/${res.phone.replace(/\s/g, '')}?text=Bonjour ${res.name}, concernant votre réservation de la ${res.carDetails} du ${start} au ${end}...`}
                        target="_blank"
                        className="px-8 py-4 bg-primary text-white text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-primary/80 transition-all flex items-center gap-3 shadow-lg shadow-primary/20"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                      <a
                        href={`mailto:${res.email}`}
                        className="px-8 py-4 border border-white/10 text-white/60 text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-3"
                      >
                        <Mail size={14} />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Simplified Add Modal (Portal) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAddModal(false)}></div>
          <div className="relative glass w-full max-w-2xl p-8 md:p-12 rounded-[2rem] border border-white/10 flex flex-col max-h-[90vh]">
            <h2 className="text-3xl font-display font-bold uppercase italic tracking-widest mb-10 shrink-0">Nouvelle Annonce</h2>

            <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Marque & Modèle</label>
                  <input
                    value={newCar.description}
                    onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                    placeholder="Ex: Mercedes Classe G"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white text-sm placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Prix (€)</label>
                  <input
                    value={newCar.price}
                    onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                    placeholder="Ex: 85000"
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white text-sm placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Type</label>
                  <select
                    value={newCar.type}
                    onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white text-sm appearance-none cursor-pointer"
                  >
                    <option value="SALE" className="bg-[#111] text-white">Vente</option>
                    <option value="RENT" className="bg-[#111] text-white">Location</option>
                    <option value="DAMAGED" className="bg-[#111] text-white">Accidenté</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Photo du véhicule</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-grow flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-4 px-6 cursor-pointer hover:border-primary transition-all">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                        {selectedFile ? selectedFile.name : "Sélectionner un fichier"}
                      </span>
                      <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} accept="image/*" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Description Détaillée (Optionnel)</label>
                  <textarea
                    value={newCar.details}
                    onChange={(e) => setNewCar({ ...newCar, details: e.target.value })}
                    placeholder="Équipements, historique, état du véhicule..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white text-sm min-h-[120px] resize-none placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Notes Internes (Privé)</label>
                  <textarea
                    value={newCar.notes}
                    onChange={(e) => setNewCar({ ...newCar, notes: e.target.value })}
                    placeholder="Infos pour l'équipe admin..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white text-sm min-h-[80px] resize-none placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-10 shrink-0 border-t border-white/5">
              <button
                onClick={handleAddListing}
                disabled={publishing}
                className="flex-grow py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50"
              >
                {publishing ? "Publication..." : "Publier"}
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-10 py-5 border border-white/10 text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-white/5">Annuler</button>
            </div>
          </div>
        </div>
      )}
      {/* Estimation Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedLead(null)}></div>
          <div className="relative glass w-full max-w-4xl p-10 md:p-16 rounded-[3rem] border border-white/10 flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
            >
              <LogOut size={24} className="rotate-45" />
            </button>

            <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px] bg-primary/10 px-4 py-2 rounded-full font-display">Détails de l'estimation</span>
                  <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
                    Reçu le {selectedLead.createdAt?.seconds ? new Date(selectedLead.createdAt.seconds * 1000).toLocaleString() : "Date inconnue"}
                  </span>
                </div>
                <h2 className="text-5xl font-display font-bold uppercase italic tracking-tighter leading-none">
                  {selectedLead.carDetails}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Client Info */}
                <div className="space-y-8">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20 border-b border-white/5 pb-4 font-display">Informations Client</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Nom</p>
                        <p className="text-sm font-bold tracking-wide">{selectedLead.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Téléphone</p>
                        <p className="text-sm font-bold tracking-wide">{selectedLead.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Email</p>
                        <p className="text-sm font-bold tracking-wide">{selectedLead.email}</p>
                      </div>
                    </div>
                    {selectedLead.location && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Ville</p>
                          <p className="text-sm font-bold tracking-wide">{selectedLead.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="space-y-8">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20 border-b border-white/5 pb-4 font-display">Actions Rapides</h3>
                  <div className="flex flex-col gap-4">
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/\s/g, '')}?text=Bonjour ${selectedLead.name}, concernant votre demande d'estimation pour la ${selectedLead.carDetails}...`}
                      target="_blank"
                      className="w-full py-5 bg-primary text-white text-[10px] uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/80 transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
                    >
                      <MessageCircle size={16} />
                      Répondre sur WhatsApp
                    </a>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="w-full py-5 bg-white/5 text-white text-[10px] uppercase tracking-widest font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-4 border border-white/10"
                    >
                      <Mail size={16} />
                      Envoyer un Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              {selectedLead.images && selectedLead.images.length > 0 && (
                <div className="space-y-8 pt-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20 border-b border-white/5 pb-4 font-display">Galerie Photos ({selectedLead.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedLead.images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className="aspect-square rounded-2xl overflow-hidden border border-white/10 glass group/img cursor-pointer"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Image Lightbox (Zoom & Carousel) */}
      {activeImage && selectedLead && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center p-6 md:p-10 cursor-zoom-out animate-in fade-in zoom-in duration-300 select-none"
          onClick={() => setActiveImage(null)}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl"></div>

          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 md:px-10 z-[410] pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = selectedLead.images.indexOf(activeImage);
                const prevIdx = (idx - 1 + selectedLead.images.length) % selectedLead.images.length;
                setActiveImage(selectedLead.images[prevIdx]);
              }}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all pointer-events-auto backdrop-blur-xl"
            >
              <ChevronRight size={32} className="rotate-180" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = selectedLead.images.indexOf(activeImage);
                const nextIdx = (idx + 1) % selectedLead.images.length;
                setActiveImage(selectedLead.images[nextIdx]);
              }}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all pointer-events-auto backdrop-blur-xl"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="relative max-w-6xl max-h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl z-[405]">
            <img
              src={activeImage}
              alt="Zoomed view"
              className="w-full h-full object-contain max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
              <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-white">
                Photo {selectedLead.images.indexOf(activeImage) + 1} / {selectedLead.images.length}
              </p>
            </div>
          </div>

          <button
            className="absolute top-8 right-8 w-14 h-14 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-red-500 hover:border-red-500 transition-all z-[410]"
            onClick={(e) => { e.stopPropagation(); setActiveImage(null); }}
          >
            <LogOut size={24} className="rotate-45" />
          </button>
        </div>
      )}
    </div>
  );
};


export default DashboardClient;
