import type { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Pelayanan Administrasi Surat Online Mandiri",
  description:
    "Layanan mandiri pengajuan dan pelacakan surat administrasi kependudukan online Desa Bogem, Kec. Kawedanan, Kab. Magetan. Cepat, transparan, dan dapat dipantau langsung 24 jam.",
  alternates: {
    canonical: "/layanan-surat",
  },
  openGraph: {
    title: "Pelayanan Administrasi Surat Online | Desa Bogem, Magetan",
    description:
      "Layanan surat online mandiri warga Desa Bogem, Kec. Kawedanan, Kab. Magetan. Ajukan SKU, SKTM, Surat Domisili, SKCK tanpa antre di kantor desa.",
    url: "/layanan-surat",
  },
  twitter: {
    title: "Pelayanan Administrasi Surat Online | Desa Bogem, Magetan",
    description:
      "Pengajuan dan pelacakan surat administrasi kependudukan Desa Bogem secara online.",
  },
};

export default function LayananSuratLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Layanan Surat Online", path: "/layanan-surat" },
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
