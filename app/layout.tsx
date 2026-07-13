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
  title: "AI4M Use Case Explorer | AI4M Canada",
  description:
    "Explore AI4M-certified Industrial AI use cases built for Canadian manufacturers. Filter by department, stakeholder role, and strategic goal.",
  openGraph: {
    title: "AI4M Use Case Explorer",
    description: "AI4M-certified Industrial AI use cases for Canadian manufacturers.",
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
      <body className="min-h-full flex flex-col bg-[#F2F6FF]">{children}</body>
    </html>
  );
}
