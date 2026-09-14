import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemerintah & Aparatur Desa",
  description:
    "Struktur organisasi tata kerja (SOTK) dan jajaran aparatur Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan.",
  alternates: {
    canonical: "/pemerintah",
  },
};

export default function PemerintahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
