"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBerita } from "@/hooks/useBerita";
import { formatDateIndonesian } from "@/utils/formatters";
import {
  Newspaper,
  Calendar,
  ArrowRight,
  Image as ImageIcon,
  Search,
  ArrowLeft,
  X,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterItem {
  label: string;
  slug: string;
}

const BERITA_CATEGORIES: CategoryFilterItem[] = [
  { label: "Semua", slug: "semua" },
  { label: "Pengumuman Resmi", slug: "pengumuman" },
  { label: "Kegiatan Warga", slug: "kegiatan" },
  { label: "Pembangunan & Infrastruktur", slug: "pembangunan" },
  { label: "Kesehatan & Posyandu", slug: "kesehatan" },
  { label: "Pemberdayaan UMKM & Ekonomi", slug: "ekonomi" },
  { label: "Pertanian & Lingkungan", slug: "pertanian" },
  { label: "Sosial & Budaya", slug: "sosial" },
];

function resolveCategoryFromSlug(slug: string | null): string {
  if (!slug || slug.toLowerCase() === "semua") return "Semua";
  const found = BERITA_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === slug.toLowerCase() ||
      c.label.toLowerCase() === slug.toLowerCase() ||
      c.label.toLowerCase().replace(/[^a-z0-9]/g, "-").includes(slug.toLowerCase())
  );
  return found ? found.label : "Semua";
}

export default function BeritaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-20 text-center text-muted-foreground text-sm">
            Memuat Warta Desa...
          </div>
        </main>
      }
    >
      <BeritaContent />
    </Suspense>
  );
}

function BeritaContent() {
  const router = useRouter();
  const { data: listBerita, loading } = useBerita();
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get("kategori");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() =>
    resolveCategoryFromSlug(kategoriParam)
  );
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Sinkronisasi otomatis saat URL berubah (misal: tombol Back/Forward browser)
  useEffect(() => {
    setSelectedCategory(resolveCategoryFromSlug(kategoriParam));
  }, [kategoriParam]);

  // Lock body scroll saat Bottom Sheet terbuka di HP
  useEffect(() => {
    if (isBottomSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsBottomSheetOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBottomSheetOpen]);

  // Dynamic counter per kategori berita
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: listBerita.length };
    listBerita.forEach((item) => {
      if (item.kategori) {
        counts[item.kategori] = (counts[item.kategori] || 0) + 1;
      }
    });
    return counts;
  }, [listBerita]);

  const handleCategorySelect = (catLabel: string, slug: string) => {
    setSelectedCategory(catLabel);
    setIsBottomSheetOpen(false);
    const targetHref = slug === "semua" ? "/berita" : `/berita?kategori=${slug}`;
    router.replace(targetHref, { scroll: false });
  };

  const filteredBerita = listBerita.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.konten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ringkasan && item.ringkasan.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCategory =
      selectedCategory === "Semua" ||
      (item.kategori && item.kategori.toLowerCase() === selectedCategory.toLowerCase());

    return matchSearch && matchCategory;
  });

  return (
    <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-xs p-6 sm:p-8 lg:p-10 text-white">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle Grid Dot Texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            {/* Clean Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs text-emerald-200/80 font-medium">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Beranda</span>
              </Link>
              <span className="text-emerald-500/60">/</span>
              <span className="text-white font-medium">Warta Desa</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Warta & Kabar Berita
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                Publikasi resmi informasi pemerintah desa, agenda kegiatan masyarakat, pengumuman layanan, dan dokumentasi pembangunan Desa Bogem.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          {/* Mobile Search & Filter Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari judul warta..."
                className="w-full pl-8 pr-7 bg-card text-xs rounded-xl"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant={selectedCategory !== "Semua" ? "default" : "outline"}
              size="sm"
              onClick={() => setIsBottomSheetOpen(true)}
              className="rounded-xl text-xs gap-1.5 shrink-0"
            >
              <Filter className="size-3.5" />
              <span className="max-w-[110px] truncate">
                {selectedCategory === "Semua" ? "Kategori" : selectedCategory}
              </span>
              <ChevronDown className="size-3.5" />
            </Button>
          </div>

          {/* Desktop Filter Bar */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filter Kategori Berita"
              className="bg-card/90 backdrop-blur-sm p-1 rounded-2xl border border-border/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none"
            >
              {BERITA_CATEGORIES.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.label.toLowerCase();
                const count = categoryCounts[cat.label] ?? (cat.slug === "semua" ? listBerita.length : 0);
                const targetHref = cat.slug === "semua" ? "/berita" : `/berita?kategori=${cat.slug}`;

                return (
                  <Link
                    key={cat.slug}
                    href={targetHref}
                    replace
                    scroll={false}
                    onClick={() => setSelectedCategory(cat.label)}
                    role="tab"
                    aria-selected={isActive}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap active:scale-95 shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#063321] text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className={`text-[10px] font-bold px-1.5 py-0 rounded-full h-4 border-0 ${
                        isActive
                          ? "bg-white/15 text-emerald-200"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </Badge>
                  </Link>
                );
              })}
            </div>

            {/* Search Input Bar Desktop */}
            <div className="relative w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Cari judul warta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 bg-card rounded-xl text-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet Drawer */}
        {isBottomSheetOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div
              onClick={() => setIsBottomSheetOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            />

            <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-250 pb-6 border-t border-border">
              <div className="pt-3 pb-1 flex justify-center">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">Kategori Berita</h3>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    ({BERITA_CATEGORIES.length})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="p-3 space-y-1 overflow-y-auto overscroll-contain">
                {BERITA_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.label.toLowerCase();
                  const count = categoryCounts[cat.label] ?? (cat.slug === "semua" ? listBerita.length : 0);

                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => handleCategorySelect(cat.label, cat.slug)}
                      className={`w-full px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between text-left active:scale-[0.99] cursor-pointer ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#063321] dark:text-emerald-300 font-bold"
                          : "text-foreground hover:bg-muted font-medium"
                      }`}
                    >
                      <span className="text-xs sm:text-sm truncate pr-2">
                        {cat.label}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                          {count}
                        </Badge>
                        {isActive && <Check className="size-4 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="p-4 sm:p-5 space-y-4">
                <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-3 w-full" />
              </Card>
            ))}
          </div>
        ) : filteredBerita.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center space-y-2">
            <Newspaper className="w-10 h-10 text-muted-foreground/60 mx-auto" />
            <h3 className="text-base font-bold text-foreground">Tidak ada berita ditemukan</h3>
            <p className="text-xs text-muted-foreground">Coba ubah kata kunci pencarian atau kategori filter di atas.</p>
          </Card>
        ) : (
          /* Berita Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBerita.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border-border/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between group p-0"
              >
                {/* News Banner Photo with Link */}
                <Link href={`/berita/${item.id}`} className="block relative aspect-[16/9] bg-muted overflow-hidden">
                  <ImageWithSkeleton
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackIcon={<ImageIcon className="w-10 h-10 text-muted-foreground/40" />}
                  />
                  {item.created_at && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge
                        variant="secondary"
                        className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-lg border-0 gap-1.5"
                      >
                        <Calendar className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                        <span>{formatDateIndonesian(item.created_at)}</span>
                      </Badge>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {item.kategori && (
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {item.kategori}
                      </Badge>
                    )}

                    <h2 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition line-clamp-2 leading-snug break-words">
                      <Link href={`/berita/${item.id}`}>
                        {item.judul}
                      </Link>
                    </h2>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 break-words">
                      {item.ringkasan || item.konten}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-border/60 flex items-center justify-between">
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="text-xs font-bold text-emerald-800 dark:text-emerald-400 p-0 gap-1 group/btn hover:no-underline"
                    >
                      <Link href={`/berita/${item.id}`}>
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}