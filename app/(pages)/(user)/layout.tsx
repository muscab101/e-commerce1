// app/layout.tsx ama app/(pages)/(user)/layout.tsx

import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Navbar from "../_components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* HALKAN KA SAX: Isku dar font variables iyo antialiased */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}