import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Warta & Kabar Berita Desa",
  description:
    "Portal warta berita resmi dan pengumuman kegiatan kemasyarakatan, pembangunan infrastruktur, posyandu, dan agenda Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan.",
  alternates: {
    canonical: "/berita",
  },
  openGraph: {
    title: "Warta & Kabar Berita Desa | Desa Bogem, Magetan",
    description:
      "Portal warta berita resmi dan pengumuman kegiatan kemasyarakatan Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan.",
    url: "/berita",
  },
  twitter: {
    title: "Warta & Kabar Berita Desa | Desa Bogem, Magetan",
    description:
      "Kabar terkini dan pengumuman resmi seputar Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan.",
  },
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Warta Berita", path: "/berita" },
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
