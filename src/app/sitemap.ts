import type { MetadataRoute } from "next";
import { fetchBeritaList } from "@/services/beritaService";
import { getSiteUrl } from "@/utils/seo";

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const currentDate = new Date();

  // 1. Rute Statis Publik Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/profil`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/pemerintah`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/infografis`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/infografis/idm`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/berita`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/potensi`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/layanan-surat`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 2. Rute Dinamis: Seluruh Artikel Warta & Berita Desa dari Supabase
  let beritaRoutes: MetadataRoute.Sitemap = [];
  try {
    const beritaList = await fetchBeritaList();
    if (beritaList && beritaList.length > 0) {
      beritaRoutes = beritaList.map((berita) => ({
        url: `${siteUrl}/berita/${encodeURIComponent(String(berita.id))}`,
        lastModified: berita.created_at ? new Date(berita.created_at) : currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Gagal menyusun rute dinamis berita untuk sitemap:", err);
  }

  return [...staticRoutes, ...beritaRoutes];
}
