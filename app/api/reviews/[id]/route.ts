import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

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
    const action = body.action ?? "DELETE";

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
