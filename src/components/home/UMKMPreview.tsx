"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Phone, ArrowRight, MapPin } from "lucide-react";
import { UMKMItem } from "@/types/umkm";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { fetchUMKMList } from "@/services/umkmService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface UMKMPreviewProps {
  listUMKM?: UMKMItem[];
}

export default function UMKMPreview({ listUMKM = [] }: UMKMPreviewProps) {
  const [items, setItems] = useState<UMKMItem[]>(listUMKM);
  const [loading, setLoading] = useState(listUMKM.length === 0);

  useEffect(() => {
    fetchUMKMList()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setItems(data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Error loading UMKM preview:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] dark:text-emerald-400 tracking-tight">
            Potensi & Produk UMKM Warga
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Dukung perekonomian lokal dengan membeli komoditas khas dan produk kreatif langsung dari warga Desa Bogem.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-bold gap-1.5 shadow-xs self-start sm:self-auto shrink-0"
        >
          <Link href="/potensi">
            <span>Semua Produk</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-4 sm:p-5 space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">Belum Ada Produk UMKM</h3>
          <p className="text-xs text-muted-foreground">
            Produk dan karya usaha warga desa akan segera ditampilkan di etalase ini.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-border/80 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between group p-0"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <ImageWithSkeleton
                  src={item.gambar}
                  alt={item.nama_usaha}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackIcon={<ShoppingBag className="w-10 h-10 text-muted-foreground/40" />}
                />
                {item.kategori && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge
                      variant="secondary"
                      className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-lg border-0"
                    >
                      {item.kategori}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition leading-snug line-clamp-1">
                    {item.nama_usaha}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
                    <span>
                      Pemilik: <strong className="text-foreground">{item.pemilik}</strong>
                    </span>
                    {item.alamat && (
                      <span className="flex items-center space-x-1 text-muted-foreground/80">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{item.alamat}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Estimasi Harga</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#063321] dark:text-emerald-400">
                      {item.harga || "Hubungi WA"}
                    </span>
                  </div>
                  {item.kontak && (
                    <Button
                      asChild
                      size="sm"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl gap-1.5 shadow-xs"
                    >
                      <a
                        href={`https://wa.me/${item.kontak.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Halo, saya tertarik dengan produk ${item.nama_usaha} dari web desa.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="size-3.5" />
                        <span>Pesan WA</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
