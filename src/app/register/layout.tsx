import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Akun Warga Baru",
  description: "Daftar akun warga Desa Bogem untuk menikmati kemudahan pengajuan surat online mandiri.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
