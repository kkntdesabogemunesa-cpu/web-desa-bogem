import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lengkapi Profil Warga",
  description: "Lengkapi data identitas NIK dan nomor kontak warga Desa Bogem.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LengkapiProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
