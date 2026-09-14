/**
 * Utilitas SEO & Structured Data Schema.org
 * Website Resmi Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan
 */

export function getSiteUrl(): string {
  // 1. Cek environment variable kustom
  const customUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (customUrl) {
    return customUrl.replace(/\/+$/, "");
  }

  // 2. Cek production URL bawaan Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, "");
  }

  // 3. Cek deployment URL Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }

  // 4. Default fallback domain resmi desa
  return "https://desabogem.my.id";
}

export const SEO_KEYWORDS = [
  "Desa Bogem",
  "Pemerintah Desa Bogem",
  "Website Resmi Desa Bogem",
  "Desa Bogem Kawedanan Magetan",
  "Bogem Kawedanan",
  "Bogem Magetan",
  "Kantor Balai Desa Bogem",
  "Layanan Surat Online Desa Bogem",
  "Beli Dari Desa Bogem",
  "UMKM Desa Bogem",
  "Berita Desa Bogem",
  "APBDes Desa Bogem",
  "IDM Desa Bogem",
  "Desa Mandiri Magetan",
  "Kecamatan Kawedanan",
  "Kabupaten Magetan",
  "Jawa Timur",
  "Profil Desa Bogem",
  "Demografi Desa Bogem",
  "Warta Desa Bogem",
];

export const DESA_INFO = {
  name: "Pemerintah Desa Bogem",
  legalName: "Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan",
  shortName: "Desa Bogem",
  description:
    "Website Resmi Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur. Pusat pelayanan administrasi surat online, profil desa, transparansi anggaran APBDes, statistik penduduk, warta berita, dan etalase produk UMKM warga.",
  address: {
    streetAddress: "Jl. Bakti Mulya No. 241, Desa Bogem",
    addressLocality: "Kecamatan Kawedanan",
    addressRegion: "Kabupaten Magetan, Jawa Timur",
    postalCode: "63382",
    addressCountry: "ID",
  },
  geo: {
    latitude: -7.68446,
    longitude: 111.40938,
  },
  telephone: "+6285136558975",
  email: "desabogemjaya@gmail.com",
};

/**
 * Generator JSON-LD untuk Skema Organisasi Pemerintahan (GovernmentOrganization)
 */
export function generateGovernmentOrgSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${siteUrl}/#organization`,
    name: DESA_INFO.name,
    legalName: DESA_INFO.legalName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/logo-magetan.png`,
      width: 512,
      height: 512,
    },
    image: `${siteUrl}/images/logo-magetan.png`,
    description: DESA_INFO.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: DESA_INFO.address.streetAddress,
      addressLocality: DESA_INFO.address.addressLocality,
      addressRegion: DESA_INFO.address.addressRegion,
      postalCode: DESA_INFO.address.postalCode,
      addressCountry: DESA_INFO.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: DESA_INFO.geo.latitude,
      longitude: DESA_INFO.geo.longitude,
    },
    telephone: DESA_INFO.telephone,
    email: DESA_INFO.email,
    openingHours: "Mo-Fr 08:00-15:00",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan",
    },
    sameAs: [
      "https://www.instagram.com/desabogem_magetan",
    ],
  };
}

/**
 * Generator JSON-LD untuk Skema Situs Web (WebSite + SearchAction)
 */
export function generateWebSiteSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Website Resmi Desa Bogem",
    alternateName: ["Desa Bogem", "Portal Desa Bogem", "Desa Bogem Magetan"],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/berita?cari={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generator JSON-LD untuk BreadcrumbList
 */
export function generateBreadcrumbSchema(items: { name: string; path: string }[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${siteUrl}${item.path}`,
    })),
  };
}

/**
 * Generator JSON-LD untuk Artikel Berita (NewsArticle)
 */
export function generateNewsArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
  category?: string;
}) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    headline: article.title,
    description: article.description,
    image: article.image || `${siteUrl}/images/logo-magetan.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author || "Pemerintah Desa Bogem",
    },
    publisher: {
      "@type": "Organization",
      name: "Pemerintah Desa Bogem",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo-magetan.png`,
      },
    },
    inLanguage: "id-ID",
    articleSection: article.category || "Berita Desa",
  };
}
