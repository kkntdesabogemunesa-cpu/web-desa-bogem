import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Potensi Desa & Produk UMKM 'Beli Dari Desa'",
  description:
    "Etalase produk unggulan dan usaha mikro kecil menengah (UMKM) warga Desa Bogem, Kec. Kawedanan, Kab. Magetan. Belanja produk kuliner, kerajinan, dan pertanian langsung dari produsen desa.",
  alternates: {
    canonical: "/potensi",
  },
  openGraph: {
    title: "Potensi Desa & Produk UMKM 'Beli Dari Desa' | Desa Bogem, Magetan",
    description:
      "Etalase produk UMKM dan potensi ekonomi warga Desa Bogem, Kec. Kawedanan, Kab. Magetan. Hubungi langsung penjual via WhatsApp.",
    url: "/potensi",
  },
  twitter: {
    title: "Potensi Desa & Produk UMKM 'Beli Dari Desa' | Desa Bogem, Magetan",
    description:
      "Katalog produk unggulan dan potensi desa warga Desa Bogem, Magetan.",
  },
};

export default function PotensiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Potensi Desa & UMKM", path: "/potensi" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
