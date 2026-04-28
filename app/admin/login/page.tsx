"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Exchange ID Token for a session cookie
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
        await auth.signOut();
      }
    } catch (err: any) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <span className="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Secure Access</span>
          <h1 className="text-4xl font-display font-bold uppercase italic tracking-tighter">
            ADMIN <span className="text-white/20">PORTAL</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="glass p-10 rounded-2xl space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-white/30 font-bold ml-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-primary transition-all text-white font-medium"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase font-bold text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Lock size={14} /> Connexion</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
