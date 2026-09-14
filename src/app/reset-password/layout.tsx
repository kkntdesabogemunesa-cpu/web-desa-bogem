import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setel Ulang Kata Sandi",
  description: "Formulir pembaruan kata sandi baru akun warga Desa Bogem.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
