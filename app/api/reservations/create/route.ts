import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rentalId, name, phone, email, location, startDate, endDate, carDetails } = body;

    // 1. Basic Validation
    if (!rentalId || !name || !phone || !startDate || !endDate) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const startTs = new Date(startDate);
    const endTs = new Date(endDate);
    
    if (startTs >= endTs || startTs < new Date()) {
      return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
    }

    // 2. Fetch Existing Reservations for Conflict Detection
    const existingSnap = await adminDb.collection("reservations")
      .where("rentalId", "==", rentalId)
      .where("status", "in", ["PENDING", "CONFIRMED", "CONTACTED"])
      .get();

    const existingBookings = existingSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // 3. Conflict Detection
    let hasConflict = false;
    for (const booking of existingBookings) {
      const bStart = booking.startDate.toDate();
      const bEnd = booking.endDate.toDate();

      if (startTs <= bEnd && endTs >= bStart) {
        hasConflict = true;
        break;
      }
    }

    // 4. Handle Conflict & Generate Alternatives
    let alternativeStart = null;
    let alternativeEnd = null;

    if (hasConflict) {
      // Logic: Find the first gap after the requested start date
      // For simplicity, find the end of the last booking
      const sortedBookings = [...existingBookings].sort((a, b) => a.endDate.seconds - b.endDate.seconds);
      const lastBooking = sortedBookings[sortedBookings.length - 1];
      
      const duration = endTs.getTime() - startTs.getTime();
      const nextAvailable = lastBooking ? new Date(lastBooking.endDate.toDate().getTime() + 86400000) : new Date(); // Next day
      
      alternativeStart = nextAvailable;
      alternativeEnd = new Date(nextAvailable.getTime() + duration);
    }

    // 5. Save Reservation
    const reservationData = {
      rentalId,
      carDetails,
      name,
      phone,
      email,
      location,
      startDate: Timestamp.fromDate(startTs),
      endDate: Timestamp.fromDate(endTs),
      status: hasConflict ? "PENDING_CONFLICT" : "PENDING",
      conflict: hasConflict,
      alternativeStartDate: alternativeStart ? Timestamp.fromDate(alternativeStart) : null,
      alternativeEndDate: alternativeEnd ? Timestamp.fromDate(alternativeEnd) : null,
      createdAt: Timestamp.now(),
    };

    const docRef = await adminDb.collection("reservations").add(reservationData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      conflict: hasConflict,
      alternative: hasConflict ? {
        start: alternativeStart,
        end: alternativeEnd
      } : null
    });

  } catch (error) {
    console.error("Reservation API Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
