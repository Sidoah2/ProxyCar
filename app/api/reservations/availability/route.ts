import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rentalId = searchParams.get("rentalId");

  if (!rentalId) {
    return NextResponse.json({ error: "Rental ID required" }, { status: 400 });
  }

  try {
    const snap = await adminDb.collection("reservations")
      .where("rentalId", "==", rentalId)
      .where("status", "in", ["PENDING", "CONFIRMED", "CONTACTED"])
      .get();

    const bookedRanges = snap.docs.map(doc => {
      const data = doc.data();
      return {
        from: data.startDate.toDate(),
        to: data.endDate.toDate(),
      };
    });

    return NextResponse.json(bookedRanges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
