"use client";

import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, isWithinInterval, addDays, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, User, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import "react-day-picker/style.css";

interface BookingFormProps {
  rentalId: string;
  carDetails: string;
}

const BookingForm = ({ rentalId, carDetails }: BookingFormProps) => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [bookedRanges, setBookedRanges] = useState<{ from: Date; to: Date }[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "CONFLICT" | "ERROR">("IDLE");
  const [alternative, setAlternative] = useState<{ start: string; end: string } | null>(null);

  const handleSelect = (newRange: DateRange | undefined) => {
    // If we just selected a complete range, auto-advance to step 2 after a tiny delay
    setRange(newRange);
    if (newRange?.from && newRange?.to) {
      setTimeout(() => setStep(2), 300);
    }
  };

  // Fetch availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`/api/reservations/availability?rentalId=${rentalId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setBookedRanges(data.map(r => ({ from: new Date(r.from), to: new Date(r.to) })));
        }
      } catch (err) {
        console.error("Availability fetch failed", err);
      }
    };
    fetchAvailability();
  }, [rentalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to || !formData.name || !formData.phone) {
      alert("Veuillez remplir tous les champs et sélectionner vos dates.");
      return;
    }

    setLoading(true);
    setStatus("IDLE");

    try {
      const res = await fetch("/api/reservations/create", {
        method: "POST",
        body: JSON.stringify({
          rentalId,
          carDetails,
          ...formData,
          startDate: range.from,
          endDate: range.to,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.conflict) {
          setStatus("CONFLICT");
          setAlternative({
            start: format(new Date(data.alternative.start), "dd MMMM yyyy", { locale: fr }),
            end: format(new Date(data.alternative.end), "dd MMMM yyyy", { locale: fr }),
          });
        } else {
          setStatus("SUCCESS");
        }
      } else {
        setStatus("ERROR");
      }
    } catch (err) {
      setStatus("ERROR");
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (date < today) return true;

    return bookedRanges.some(booked =>
      isWithinInterval(date, { start: startOfDay(booked.from), end: startOfDay(booked.to) })
    );
  };

  if (status === "SUCCESS") {
    return (
      <div className="glass p-12 rounded-[2rem] border border-primary/20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="text-primary" size={40} />
        </div>
        <h2 className="text-3xl font-display font-bold uppercase italic tracking-widest">Demande Envoyée</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] leading-relaxed">
          Votre demande de réservation a été transmise.<br />Un conseiller vous contactera par WhatsApp très prochainement.
        </p>
        <button onClick={() => setStatus("IDLE")} className="text-primary font-bold uppercase tracking-widest text-[9px] pt-4">Nouvelle demande</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-8 md:p-12 rounded-[2rem] border border-white/5 space-y-8 max-w-xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-bold uppercase italic tracking-widest">Réserver</h2>
          <p className="text-white/20 text-[8px] uppercase tracking-widest">Étape {step} sur 2</p>
        </div>
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-[8px] uppercase tracking-widest font-bold text-primary hover:text-white transition-colors"
          >
            Modifier les dates
          </button>
        )}
      </div>

      {step === 1 ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Modern Date Display */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Start Date */}
            <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between group transition-all hover:border-primary/20">
              <div className="space-y-1 text-left">
                <span className="text-[7px] uppercase tracking-[0.4em] text-white/20 font-bold block">Départ</span>
                <span className="text-[8px] uppercase font-bold text-white/40 block">
                  {range?.from ? format(range.from, "MMM yyyy", { locale: fr }) : "Choisir"}
                </span>
              </div>
              <span className="text-3xl font-display font-black text-primary leading-none ml-4">
                {range?.from ? format(range.from, "dd") : "--"}
              </span>
            </div>

            {/* End Date */}
            <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between group transition-all hover:border-white/20">
              <div className="space-y-1 text-left">
                <span className="text-[7px] uppercase tracking-[0.4em] text-white/20 font-bold block">Retour</span>
                <span className="text-[8px] uppercase font-bold text-white/40 block">
                  {range?.to ? format(range.to, "MMM yyyy", { locale: fr }) : "Choisir"}
                </span>
              </div>
              <span className="text-3xl font-display font-black text-white/40 group-focus-within:text-white leading-none ml-4">
                {range?.to ? format(range.to, "dd") : "--"}
              </span>
            </div>
          </div>

          <div className="flex justify-center bg-white/[0.01] rounded-[2rem] p-4 md:p-8 border border-white/5 backdrop-blur-sm">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              disabled={isDateDisabled}
              locale={fr}
              classNames={{
                root: "booking-calendar w-full",
                months: "w-full",
                month: "w-full space-y-6",
                month_caption: "flex justify-center py-4 border-b border-white/5 mb-4",
                caption_label: "text-[11px] uppercase font-black tracking-[0.5em] text-white",
                nav: "flex gap-4",
                month_grid: "w-full border-collapse",
                weekdays: "flex justify-between mb-4",
                weekday: "w-12 text-[8px] uppercase font-black text-white/20 tracking-widest text-center",
                week: "flex justify-between w-full mb-2",
                day: "h-12 w-12 text-[10px] uppercase font-bold text-white/40 hover:bg-primary/20 hover:text-white transition-all rounded-xl flex items-center justify-center cursor-pointer",
                selected: "bg-primary text-white font-black scale-105 shadow-xl shadow-primary/20",
                disabled: "opacity-5 pointer-events-none grayscale",
                range_start: "bg-primary text-white rounded-l-xl",
                range_end: "bg-primary text-white rounded-r-xl",
                range_middle: "bg-primary/10 text-primary rounded-none font-bold",
                today: "text-primary border-b-2 border-primary",
              }}
            />
          </div>

          <button
            type="button"
            disabled={!range?.from || !range?.to}
            onClick={() => setStep(2)}
            className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.4em] text-[9px] rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-20"
          >
            Continuer
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Booking Summary */}
          <div className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-6">
              <div className="space-y-0.5">
                <span className="text-[7px] uppercase tracking-widest text-white/30 font-bold">Du</span>
                <p className="text-sm font-display font-black text-white italic">
                  {range?.from ? format(range.from, "dd MMM", { locale: fr }) : "--"}
                </p>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="space-y-0.5">
                <span className="text-[7px] uppercase tracking-widest text-white/30 font-bold">Au</span>
                <p className="text-sm font-display font-black text-white italic">
                  {range?.to ? format(range.to, "dd MMM", { locale: fr }) : "--"}
                </p>
              </div>
            </div>
            {range?.from && range?.to && (
              <span className="px-4 py-2 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} JOURS
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
              <input
                required
                placeholder="NOM COMPLET"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-xs text-white outline-none focus:border-primary transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="relative group">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
              <input
                required
                placeholder="WHATSAPP"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-xs text-white outline-none focus:border-primary transition-all"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
              <input
                required
                type="email"
                placeholder="EMAIL"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-xs text-white outline-none focus:border-primary transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="relative group">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
              <input
                required
                placeholder="VILLE"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-6 text-xs text-white outline-none focus:border-primary transition-all"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white font-bold uppercase tracking-[0.4em] text-[9px] rounded-xl hover:bg-primary/80 transition-all shadow-xl shadow-primary/20"
          >
            {loading ? "Vérification..." : "Confirmer la réservation"}
          </button>
        </div>
      )}

      <p className="text-center text-[8px] uppercase tracking-widest text-white/10 pt-4">
        Paiement sur place lors de la remise des clés
      </p>
    </form>
  );
};

export default BookingForm;
