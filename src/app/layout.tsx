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
  title: "CodeSpiral – Journey Through Layers of Logic",
  description: "Follow a spiral-shaped journey of projects and skills in this interactive 3D portfolio powered by Next.js.",
  keywords: ["Spiral Timeline Portfolio","3D Portfolio","3D Portfolio Nextjs", "Next.js 3D Journey", "Interactive Code Portfolio", "Masud Rana Dev Spiral"],
  metadataBase: new URL("https://yourdomain.com"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
