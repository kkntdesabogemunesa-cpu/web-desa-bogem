"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, UserCheck, ArrowRight, Landmark } from "lucide-react";
import { PerangkatItem } from "@/types/perangkat";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { fetchPerangkatList } from "@/services/perangkatService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AparaturPreviewProps {
  listPerangkat?: PerangkatItem[];
}

export default function AparaturPreview({ listPerangkat = [] }: AparaturPreviewProps) {
  const [items, setItems] = useState<PerangkatItem[]>(listPerangkat);
  const [loading, setLoading] = useState(listPerangkat.length === 0);

  useEffect(() => {
    fetchPerangkatList()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch((err) => console.error("Error loading perangkat preview:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="sotk" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] dark:text-emerald-400 tracking-tight">
            Aparatur & Perangkat Desa
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa Bogem yang siap melayani kebutuhan masyarakat.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5 shadow-xs self-start sm:self-auto shrink-0">
          <Link href="/profil?tab=bagan">
            <span>Semua Perangkat</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="p-3.5 sm:p-4 space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-4/5 mx-auto" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center space-y-2">
          <Users className="w-10 h-10 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">Belum Ada Data Aparatur</h3>
          <p className="text-xs text-muted-foreground">
            Data susunan perangkat desa akan segera diperbarui.
          </p>
        </Card>
      ) : (
        /* Perangkat Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {items.map((p) => {
            const isKades =
              p.jabatan.toLowerCase().includes("kepala desa") &&
              !p.jabatan.toLowerCase().includes("dusun");

            return (
              <Card
                key={p.id}
                className={`p-3.5 sm:p-4 flex flex-col justify-between space-y-3 group hover:shadow-md transition-all duration-200 ${
                  isKades
                    ? "border-emerald-300/80 dark:border-emerald-700/80 shadow-xs"
                    : "border-border/80 hover:border-emerald-200/80"
                }`}
              >
                {/* Photo container with fixed aspect ratio */}
                <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-muted border border-border/60">
                  <ImageWithSkeleton
                    src={p.foto}
                    alt={p.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackIcon={<UserCheck className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/40" />}
                  />
                  {isKades && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <Badge className="bg-[#063321] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs gap-1 border-0">
                        <Landmark className="w-2.5 h-2.5 text-emerald-300" />
                        <span>Pimpinan</span>
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="space-y-1.5 text-center">
                  <Badge
                    variant={isKades ? "default" : "secondary"}
                    className={`max-w-full truncate text-[10px] sm:text-[11px] font-semibold ${
                      isKades
                        ? "bg-[#063321] text-white"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {p.jabatan}
                  </Badge>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition leading-snug line-clamp-1">
                    {p.nama}
                  </h3>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
