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

// Admin: Delete or hide a review
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action ?? "DELETE"; // "DELETE" or "HIDE"

    if (action === "HIDE") {
      await adminDb.collection("reviews").doc(id).update({ status: "HIDDEN" });
      return NextResponse.json({ success: true, action: "HIDDEN" });
    }

    await adminDb.collection("reviews").doc(id).delete();
    return NextResponse.json({ success: true, action: "DELETED" });
  } catch (err) {
    console.error("Review delete error:", err);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
