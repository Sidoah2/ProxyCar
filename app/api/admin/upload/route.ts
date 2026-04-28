import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 for a more stable upload
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary using the direct upload method (more stable than streams for small/medium files)
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: "proxycar_listings",
      resource_type: "auto",
      timeout: 60000, // Increase timeout to 60 seconds
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
