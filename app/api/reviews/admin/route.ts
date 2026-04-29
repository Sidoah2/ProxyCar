import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

// Admin: Get all reviews (including HIDDEN)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");

    let query: FirebaseFirestore.Query = adminDb
      .collection("reviews")
      .orderBy("createdAt", "desc");

    if (serviceType && ["RENT", "SALE", "GLOBAL"].includes(serviceType)) {
      query = adminDb
        .collection("reviews")
        .where("serviceType", "==", serviceType)
        .orderBy("createdAt", "desc");
    }

    const snapshot = await query.limit(100).get();
    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    console.error("Admin review fetch error:", err);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}

