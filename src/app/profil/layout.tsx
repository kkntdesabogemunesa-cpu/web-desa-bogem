import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Profil Desa, Visi Misi & Sejarah",
  description:
    "Profil resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan. Meliputi visi & misi desa, sejarah asal-usul, peta tapal batas wilayah geospasial BIG, dan bagan struktur organisasi.",
  alternates: {
    canonical: "/profil",
  },
  openGraph: {
    title: "Profil Desa, Visi Misi & Sejarah | Desa Bogem, Magetan",
    description:
      "Profil resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan. Visi & misi desa, sejarah asal-usul, peta batas wilayah, dan bagan struktur organisasi.",
    url: "/profil",
  },
  twitter: {
    title: "Profil Desa, Visi Misi & Sejarah | Desa Bogem, Magetan",
    description:
      "Profil resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan.",
  },
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Profil Desa", path: "/profil" },
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
