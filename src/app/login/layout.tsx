import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk Akun Warga",
  description: "Masuk ke portal layanan mandiri warga Desa Bogem, Kec. Kawedanan, Kab. Magetan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
