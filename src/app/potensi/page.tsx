"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUMKM } from "@/hooks/useUMKM";
import { UMKMItem } from "@/types/umkm";
import { formatWhatsAppLink } from "@/utils/formatters";
import {
  Search,
  ShoppingBag,
  Phone,
  Store,
  User,
  X,
  Tag,
  MapPin,
  ArrowLeft,
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

interface UMKMCategoryItem {
  label: string;
  slug: string;
}

const POTENSI_CATEGORIES: UMKMCategoryItem[] = [
  { label: "Semua", slug: "semua" },
  { label: "Makanan & Minuman", slug: "kuliner" },
  { label: "Kerajinan Tangan", slug: "kerajinan" },
  { label: "Jasa", slug: "jasa" },
  { label: "Pertanian / Peternakan", slug: "pertanian" },
  { label: "Lainnya", slug: "lainnya" },
];

function resolveUMKMCategoryFromSlug(slug: string | null): string {
  if (!slug || slug.toLowerCase() === "semua") return "Semua";
  const s = slug.toLowerCase();
  if (
    s === "kuliner" ||
    s === "makanan" ||
    s === "minuman" ||
    s === "makanan-dan-minuman" ||
    s === "makanan-minuman"
  ) {
    return "Makanan & Minuman";
  }
  if (s === "kerajinan" || s === "kerajinan-tangan") {
    return "Kerajinan Tangan";
  }
  if (s === "jasa") {
    return "Jasa";
  }
  if (s === "pertanian" || s === "peternakan" || s === "pertanian-peternakan") {
    return "Pertanian / Peternakan";
  }
  if (s === "lainnya" || s === "lain") {
    return "Lainnya";
  }
  const found = POTENSI_CATEGORIES.find((c) => c.label.toLowerCase() === s);
  return found ? found.label : "Semua";
}

export default function PotensiDesa() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-20 text-center text-muted-foreground text-sm">
            Memuat Produk UMKM Desa...
          </div>
        </main>
      }
    >
      <PotensiContent />
    </Suspense>
  );
}

function PotensiContent() {
  const router = useRouter();
  const { data: dataUMKM, loading } = useUMKM();
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get("kategori");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() =>
    resolveUMKMCategoryFromSlug(kategoriParam)
  );
  const [selectedItem, setSelectedItem] = useState<UMKMItem | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Sinkronisasi otomatis saat URL berubah (misal tombol Back/Forward browser)
  useEffect(() => {
    setSelectedCategory(resolveUMKMCategoryFromSlug(kategoriParam));
  }, [kategoriParam]);

  // Lock body scroll when bottom sheet is open on mobile
  useEffect(() => {
    if (isBottomSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBottomSheetOpen]);

  // Dynamic counter per kategori
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: dataUMKM.length };
    dataUMKM.forEach((item) => {
      if (item.kategori) {
        counts[item.kategori] = (counts[item.kategori] || 0) + 1;
      }
    });
    return counts;
  }, [dataUMKM]);

  const handleCategorySelect = (catLabel: string, slug: string) => {
    setSelectedCategory(catLabel);
    setIsBottomSheetOpen(false);
    const targetHref = slug === "semua" ? "/potensi" : `/potensi?kategori=${slug}`;
    router.replace(targetHref, { scroll: false });
  };

  // Filter products by category & search term
  const filteredUMKM = dataUMKM.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.kategori === selectedCategory;
    const matchesSearch =
      item.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Hero Header Section */}
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
              <span className="text-white font-medium">Potensi & Belanja</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Potensi & Belanja Desa
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                Etalase promosi produk UMKM dan komoditas unggulan masyarakat Desa Bogem untuk mendorong perekonomian mandiri secara berkelanjutan.
              </p>
            </div>

            {/* Clean Stats Pill */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/15 px-3 py-1 rounded-xl text-xs font-medium text-emerald-100 gap-1.5">
                <Store className="size-3.5 text-emerald-300" />
                <span>{dataUMKM.length} Usaha Terdaftar</span>
              </Badge>
              <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/15 px-3 py-1 rounded-xl text-xs font-medium text-emerald-100 gap-1.5">
                <Tag className="size-3.5 text-emerald-300" />
                <span>Pesan Langsung via WhatsApp</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          {/* Mobile Search & Filter */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama usaha, produk..."
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
              aria-label="Filter Kategori UMKM"
              className="bg-card/90 backdrop-blur-sm p-1 rounded-2xl border border-border/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-none"
            >
              {POTENSI_CATEGORIES.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.label.toLowerCase();
                const count = categoryCounts[cat.label] ?? (cat.slug === "semua" ? dataUMKM.length : 0);
                const targetHref = cat.slug === "semua" ? "/potensi" : `/potensi?kategori=${cat.slug}`;

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama usaha, produk..."
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
                  <h3 className="text-sm font-bold text-foreground">Kategori UMKM</h3>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    ({POTENSI_CATEGORIES.length})
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
                {POTENSI_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.label.toLowerCase();
                  const count = categoryCounts[cat.label] ?? (cat.slug === "semua" ? dataUMKM.length : 0);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="p-4 sm:p-5 space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            {filteredUMKM.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredUMKM.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-border/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between group p-0"
                  >
                    {/* Image Banner */}
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      <ImageWithSkeleton
                        src={item.gambar}
                        alt={item.nama_usaha}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        fallbackIcon={<Store className="w-12 h-12 stroke-[1.5] text-muted-foreground/40" />}
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border-0 z-10"
                      >
                        {item.kategori}
                      </Badge>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center space-x-1.5 text-xs text-muted-foreground font-medium mb-1">
                          <User className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">Pemilik: <strong className="text-foreground">{item.pemilik}</strong></span>
                        </div>
                        {item.alamat && (
                          <div className="flex items-center space-x-1.5 text-[11px] text-muted-foreground/80 font-medium mb-1.5">
                            <MapPin className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{item.alamat}</span>
                          </div>
                        )}
                        <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition line-clamp-1 mb-1">
                          {item.nama_usaha}
                        </h2>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {item.deskripsi}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3.5 border-t border-border/60 space-y-3">
                        {item.harga && (
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-medium">Estimasi Harga</span>
                            <div className="text-xs sm:text-sm font-extrabold text-[#063321] dark:text-emerald-400">
                              {item.harga}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                            className="flex-1 rounded-xl text-xs font-semibold"
                          >
                            Detail
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl gap-1.5 shadow-xs"
                          >
                            <a
                              href={formatWhatsAppLink(item.kontak, item.nama_usaha)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Phone className="size-3.5" />
                              <span>Pesan WA</span>
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
              <Card className="p-8 sm:p-12 text-center max-w-md mx-auto my-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 dark:text-emerald-300 border border-emerald-100/80 dark:border-emerald-800/40">
                  <ShoppingBag className="size-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-muted-foreground">
                  Tidak ada UMKM yang cocok dengan pencarian &quot;{searchTerm}&quot; atau kategori &quot;{selectedCategory}&quot;.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua");
                  }}
                  className="bg-[#063321] hover:bg-[#073d28] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Reset Filter
                </Button>
              </Card>
            )}
          </>
        )}

        {/* Modal Detail View */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-border p-0 bg-card">
              {/* Modal Header Image */}
              <div className="relative aspect-[16/9] bg-muted">
                {selectedItem.gambar && (
                  <ImageWithSkeleton
                    src={selectedItem.gambar}
                    alt={selectedItem.nama_usaha}
                    priority={true}
                    sizes="(max-width: 640px) 100vw, 512px"
                    className="w-full h-full object-cover"
                    fallbackIcon={<ShoppingBag className="w-12 h-12 text-muted-foreground/40" />}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-xs"
                  aria-label="Tutup Detail"
                >
                  <X className="size-4" />
                </Button>
                <Badge className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg border-0 shadow-xs">
                  {selectedItem.kategori}
                </Badge>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground mb-0.5">
                    {selectedItem.nama_usaha}
                  </h2>
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    Pemilik Usaha: {selectedItem.pemilik}
                  </p>
                </div>

                {selectedItem.alamat && (
                  <div className="flex items-start space-x-2 bg-muted/40 p-3 rounded-xl border border-border/80 text-xs text-muted-foreground">
                    <MapPin className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">Alamat / Lokasi:</span>
                      <span>{selectedItem.alamat}</span>
                    </div>
                  </div>
                )}

                <div className="bg-muted/40 p-3.5 rounded-xl border border-border/80 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Deskripsi Usaha / Produk</span>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {selectedItem.deskripsi}
                  </p>
                </div>

                {selectedItem.harga && (
                  <div className="flex justify-between items-center bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-100/80 dark:border-emerald-800/40">
                    <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Estimasi Harga</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#063321] dark:text-emerald-400">{selectedItem.harga}</span>
                  </div>
                )}

                {/* Modal CTA */}
                <div className="pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl gap-2 shadow-xs"
                  >
                    <a
                      href={formatWhatsAppLink(selectedItem.kontak, selectedItem.nama_usaha)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="size-4" />
                      <span>Hubungi Pemilik via WhatsApp ({selectedItem.kontak})</span>
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}