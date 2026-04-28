"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Send, Loader2, User, Mail, Phone, Car, MapPin, X } from "lucide-react";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone requis"),
  carDetails: z.string().min(5, "Détails du véhicule requis"),
  location: z.string().min(2, "Ville requise"),
});

type FormData = z.infer<typeof schema>;

const EstimationForm = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      
      // Upload up to 3 images to Cloudinary
      const imagesToUpload = images.slice(0, 3);
      
      for (const file of imagesToUpload) {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        
        const uploadData = await res.json();
        if (uploadData.secure_url) {
          uploadedUrls.push(uploadData.secure_url);
        }
      }
      
      await addDoc(collection(db, "estimations"), {
        ...data,
        images: uploadedUrls,
        status: "NEW",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      reset();
      setImages([]);
      setPreviews([]);
    } catch (error) {
      console.error("Estimation Error:", error);
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
          <Send className="text-primary animate-bounce-slow" size={40} />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-display uppercase tracking-widest font-bold italic">Demande Envoyée</h3>
          <p className="text-white/40 max-w-sm mx-auto uppercase tracking-widest text-[9px] leading-relaxed font-bold">
            Votre demande a été transmise avec succès.<br />Un expert Proxy Car vous contactera sous 24h.
          </p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="px-10 py-5 border border-white/10 text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] rounded-xl hover:bg-white/5 transition-all"
        >
          Nouvelle estimation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nom */}
        <div className="space-y-4 relative group">
          <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within:text-primary transition-colors">
            <User size={12} />
            <label className="text-[9px] uppercase tracking-[0.4em] font-bold">Nom complet</label>
          </div>
          <input
            {...register("name")}
            placeholder="Ex: Jean Dupont"
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
          />
          {errors.name && <p className="text-red-500 text-[8px] uppercase font-bold absolute -bottom-5 left-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-4 relative group">
          <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within:text-primary transition-colors">
            <Mail size={12} />
            <label className="text-[9px] uppercase tracking-[0.4em] font-bold">Email</label>
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="Ex: jean@email.com"
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
          />
          {errors.email && <p className="text-red-500 text-[8px] uppercase font-bold absolute -bottom-5 left-1">{errors.email.message}</p>}
        </div>

        {/* Téléphone */}
        <div className="space-y-4 relative group">
          <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within:text-primary transition-colors">
            <Phone size={12} />
            <label className="text-[9px] uppercase tracking-[0.4em] font-bold">Téléphone</label>
          </div>
          <input
            {...register("phone")}
            placeholder="Ex: 06 00 00 00 00"
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
          />
          {errors.phone && <p className="text-red-500 text-[8px] uppercase font-bold absolute -bottom-5 left-1">{errors.phone.message}</p>}
        </div>

        {/* Ville */}
        <div className="space-y-4 relative group">
          <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within:text-primary transition-colors">
            <MapPin size={12} />
            <label className="text-[9px] uppercase tracking-[0.4em] font-bold">Ville</label>
          </div>
          <input
            {...register("location")}
            placeholder="Ex: Paris"
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10"
          />
          {errors.location && <p className="text-red-500 text-[8px] uppercase font-bold absolute -bottom-5 left-1">{errors.location.message}</p>}
        </div>
      </div>

      {/* Véhicule Details */}
      <div className="space-y-4 group">
        <div className="flex items-center gap-3 ml-1 text-white/40 group-focus-within:text-primary transition-colors">
          <Car size={12} />
          <label className="text-[9px] uppercase tracking-[0.4em] font-bold">Détails du véhicule (Marque, Modèle, Année, KM)</label>
        </div>
        <textarea
          {...register("carDetails")}
          rows={3}
          placeholder="Ex: Audi A3, 2021, 45 000 KM, Boîte automatique..."
          className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-5 px-6 outline-none focus:border-primary/50 transition-all text-white text-xs placeholder:text-white/10 resize-none"
        />
        {errors.carDetails && <p className="text-red-500 text-[8px] uppercase font-bold">{errors.carDetails.message}</p>}
      </div>

      {/* Photos Grid */}
      <div className="space-y-6">
        <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold ml-1">Photos (Optionnel)</label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {previews.map((preview, i) => (
            <div key={i} className="aspect-square relative rounded-xl overflow-hidden group/img">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/5 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-white/[0.04] transition-all group">
            <Camera className="text-white/10 group-hover:text-primary transition-colors" size={20} />
            <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold">Ajouter</span>
            <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-6 bg-primary text-white rounded-xl transition-all duration-500 disabled:opacity-50 shadow-xl shadow-primary/10 hover:shadow-primary/20"
      >
        <span className="flex items-center justify-center gap-4 text-white font-display font-bold uppercase tracking-[0.4em] text-[10px]">
          {loading ? (
            <>
              Traitement...
              <Loader2 size={14} className="animate-spin" />
            </>
          ) : (
            <>
              Estimer mon véhicule
              <Send size={14} className="group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </span>
      </button>
    </form>
  );
};

export default EstimationForm;
