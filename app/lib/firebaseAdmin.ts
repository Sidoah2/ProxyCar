import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/"/g, "").trim()
      : undefined;

    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
      console.error("Firebase Admin: Missing environment variables", {
        projectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: !!privateKey
      });
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
