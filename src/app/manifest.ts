import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Website Resmi Desa Bogem",
    short_name: "Desa Bogem",
    description:
      "Portal Resmi Informasi Publik & Layanan Administrasi Warga Desa Bogem, Kec. Kawedanan, Kab. Magetan, Jawa Timur",
    start_url: "/",
    display: "standalone",
    background_color: "#063321",
    theme_color: "#063321",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/logo-magetan.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
