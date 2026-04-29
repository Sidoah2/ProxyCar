import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const relatedId = searchParams.get("relatedId");

    let query: FirebaseFirestore.Query = adminDb
      .collection("reviews")
      .where("status", "==", "VISIBLE")
      .orderBy("createdAt", "desc");

    if (serviceType && ["RENT", "SALE", "GLOBAL"].includes(serviceType)) {
      query = adminDb
        .collection("reviews")
        .where("status", "==", "VISIBLE")
        .where("serviceType", "==", serviceType)
        .orderBy("createdAt", "desc");
    }

    if (relatedId) {
      query = adminDb
        .collection("reviews")
        .where("status", "==", "VISIBLE")
        .where("relatedId", "==", relatedId)
        .orderBy("createdAt", "desc");
    }

    const snapshot = await query.limit(50).get();
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    console.error("Review fetch error:", err);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
