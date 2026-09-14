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
import {
  getSiteUrl,
  SEO_KEYWORDS,
  DESA_INFO,
  generateGovernmentOrgSchema,
  generateWebSiteSchema,
} from "@/utils/seo";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Website Resmi Desa Bogem | Kec. Kawedanan, Kab. Magetan",
    template: "%s | Desa Bogem, Magetan",
  },
  description: DESA_INFO.description,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Pemerintah Desa Bogem", url: siteUrl }],
  creator: "Pemerintah Desa Bogem",
  publisher: "Pemerintah Desa Bogem",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Website Resmi Desa Bogem",
    title: "Website Resmi Desa Bogem | Kec. Kawedanan, Kab. Magetan",
    description: DESA_INFO.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Website Resmi Pemerintah Desa Bogem, Kabupaten Magetan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Resmi Desa Bogem | Kec. Kawedanan, Kab. Magetan",
    description: DESA_INFO.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/images/logo-magetan.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/images/logo-magetan.png",
    apple: "/images/logo-magetan.png",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "0NA_1DSJ_xoYqTfqaDS31nk4X8V0NVMplGsGmYA9QRs",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
    },
  },
  category: "Government",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateGovernmentOrgSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.className} bg-background text-foreground min-h-screen flex flex-col antialiased`}
      >
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