import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Status Indeks Desa Membangun (IDM) - Desa Mandiri",
  description:
    "Status perkembangan kemandirian Desa Bogem dengan predikat Desa Mandiri berdasarkan penilaian Indeks Desa Membangun (IDM) Kementerian Desa PDTT. Meliputi Indeks Ketahanan Sosial (IKS), Ekonomi (IKE), dan Lingkungan (IKL).",
  alternates: {
    canonical: "/infografis/idm",
  },
  openGraph: {
    title: "Status Indeks Desa Membangun (IDM) | Desa Mandiri Bogem, Magetan",
    description:
      "Penilaian capaian Indeks Desa Membangun (IDM) Desa Bogem, Kec. Kawedanan, Kab. Magetan dengan predikat Desa Mandiri.",
    url: "/infografis/idm",
  },
  twitter: {
    title: "Status Indeks Desa Membangun (IDM) | Desa Bogem, Magetan",
    description:
      "Perkembangan status Desa Mandiri Bogem berdasarkan penilaian IDM Kemendesa.",
  },
};

export default function IDMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Infografis", path: "/infografis" },
    { name: "Status IDM", path: "/infografis/idm" },
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
