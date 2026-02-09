import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Inflation Impact Simulator",
  description: "Interactive dashboard simulating how AI dissemination affects CPI inflation across consumer spending categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.variable} font-mono antialiased bg-[#0a0a0f] text-[#e4e4ef]`}>
        <Navbar />
        <main className="min-h-screen pt-12">
          {children}
        </main>
      </body>
    </html>
  );
}
