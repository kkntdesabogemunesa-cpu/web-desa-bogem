import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import PageTransitionBar from "@/components/PageTransitionBar";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Desa Bogem | Kec. Kawedanan, Kab. Magetan",
  description: "Website Resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan - Layanan Informasi Publik & UMKM",
  icons: {
    icon: [
      { url: "/images/logo-magetan.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/images/logo-magetan.png",
    apple: "/images/logo-magetan.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body className={`${plusJakartaSans.className} bg-background text-foreground min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <PageTransitionBar />
          </Suspense>
          <Navbar />
          <div className="flex-grow animate-in fade-in duration-200">
            {children}
          </div>
          <Footer />
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}