"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper, Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import { BeritaItem } from "@/types/berita";
import { formatDateIndonesian } from "@/utils/formatters";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { fetchBeritaList } from "@/services/beritaService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BeritaPreviewProps {
  listBerita?: BeritaItem[];
}

export default function BeritaPreview({ listBerita = [] }: BeritaPreviewProps) {
  const [items, setItems] = useState<BeritaItem[]>(listBerita);
  const [loading, setLoading] = useState(listBerita.length === 0);

  useEffect(() => {
    fetchBeritaList()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setItems(data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Error loading berita preview:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] dark:text-emerald-400 tracking-tight">
            Kabar & Berita Desa
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Publikasi resmi pemerintah desa, agenda kegiatan masyarakat, dan perkembangan pembangunan Desa Bogem.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-bold gap-1.5 shadow-xs self-start sm:self-auto shrink-0"
        >
          <Link href="/berita">
            <span>Semua Berita</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-4 sm:p-5 space-y-4">
              <Skeleton className="aspect-[16/9] w-full rounded-xl" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-3 w-full" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center space-y-2">
          <Newspaper className="w-10 h-10 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">Belum Ada Warta Berita</h3>
          <p className="text-xs text-muted-foreground">
            Berita dan pengumuman terbaru akan segera dipublikasikan di sini.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-border/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between group p-0"
            >
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
                  <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition line-clamp-2 leading-snug">
                    <Link href={`/berita/${item.id}`}>
                      {item.judul}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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
    </section>
  );
}
