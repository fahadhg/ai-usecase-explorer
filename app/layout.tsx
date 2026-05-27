import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Use Case Explorer | Industry 4.0 Intelligence Platform",
  description:
    "Explore 100+ proven AI use cases for manufacturers. Filter by department, strategic goal, cost tier, and real-world validation. Built for Industry 4.0 leaders.",
  openGraph: {
    title: "AI Use Case Explorer",
    description: "100+ proven AI use cases for modern manufacturers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050510]">{children}</body>
    </html>
  );
}
