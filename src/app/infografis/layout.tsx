import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Infografis Kependudukan & Transparansi APBDes",
  description:
    "Data statistik kependudukan, piramida mata pencaharian warga, struktur kelembagaan desa (LKD), serta transparansi realisasi pendapatan dan belanja APBDes Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan.",
  alternates: {
    canonical: "/infografis",
  },
  openGraph: {
    title: "Infografis Kependudukan & Transparansi APBDes | Desa Bogem, Magetan",
    description:
      "Data statistik demografi, mata pencaharian, LKD, serta laporan realisasi APBDes Desa Bogem secara transparan dan akuntabel.",
    url: "/infografis",
  },
  twitter: {
    title: "Infografis Kependudukan & Transparansi APBDes | Desa Bogem, Magetan",
    description:
      "Data demografi penduduk dan transparansi APBDes Pemerintah Desa Bogem.",
  },
};

export default function InfografisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Infografis & APBDes", path: "/infografis" },
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
