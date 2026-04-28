import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Preloader from "./components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PROXY CAR | Luxury Automotive Resale",
  description: "Discover a premium selection of high-end vehicles at PROXY CAR. Excellence in automotive resale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} font-sans scroll-smooth`}>
      <body className="bg-black text-white font-sans selection:bg-primary selection:text-white overflow-hidden">
        <Preloader />
        {children}
      </body>
    </html>
  );
}

