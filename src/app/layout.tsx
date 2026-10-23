import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Review Dashboard",
  description: "Manage student project submissions and reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div aria-hidden='true' className='aqua-aura'>
          <div className='aqua-aura-layer aqua-aura-layer-1' />
          <div className='aqua-aura-layer aqua-aura-layer-2' />
          <div className='aqua-aura-layer aqua-aura-layer-3' />
          <div className='aqua-aura-layer aqua-aura-layer-4' />
        </div>
        <div className='app-content'>
          <Providers>{children}</Providers>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
