import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OceanBackground } from "@/components/ui/ocean-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "hackX Jr. 9.0 | Awareness Session Registration",
  description:
    "Secure registration platform for the hackX Jr. 9.0 Awareness Session. Secure your spot in the premier junior hackathon awareness event.",
  keywords: [
    "hackX",
    "hackX Jr",
    "Kelaniya University",
    "Awareness Session",
    "Registration",
    "Junior Hackathon",
  ],
  authors: [{ name: "hackX Jr. Team" }],
  icons: {
    icon: "/Logos/x-logo-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#010E13] text-[#f0f4ff] font-sans antialiased">
        <main className="flex-grow flex flex-col justify-center relative">
          {/* Ocean particles background */}
          <OceanBackground />

          {children}
        </main>
      </body>
    </html>
  );
}
