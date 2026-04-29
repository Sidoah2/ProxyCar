import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// Basic in-memory rate limiting (per IP, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, "").trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, rating, comment, serviceType, relatedId } = body;

    // --- Strict Validation ---
    const errors: string[] = [];

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      errors.push("Le nom doit contenir au moins 3 caractères.");
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      errors.push("La note doit être comprise entre 1 et 5.");
    }
    if (!comment || typeof comment !== "string" || comment.trim().length < 10) {
      errors.push("Le commentaire doit contenir au moins 10 caractères.");
    }
    if (comment && comment.trim().length > 500) {
      errors.push("Le commentaire ne peut pas dépasser 500 caractères.");
    }
    if (!["RENT", "SALE", "GLOBAL"].includes(serviceType)) {
      errors.push("Type de service invalide.");
    }
    if (email && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("L'adresse email est invalide.");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // --- Sanitize & Save ---
    const reviewData: Record<string, any> = {
      name: sanitize(name),
      rating: Math.round(rating),
      comment: sanitize(comment),
      serviceType,
      status: "VISIBLE",
      createdAt: FieldValue.serverTimestamp(),
    };

    if (email && email.trim()) reviewData.email = sanitize(email);
    if (phone && phone.trim()) reviewData.phone = sanitize(phone);
    if (relatedId && relatedId.trim()) reviewData.relatedId = sanitize(relatedId);

    const ref = await adminDb.collection("reviews").add(reviewData);

    return NextResponse.json({ success: true, id: ref.id }, { status: 201 });
  } catch (err) {
    console.error("Review create error detail:", err);
    return NextResponse.json({
      error: "Erreur interne du serveur.",
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
