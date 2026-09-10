"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper, Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import { BeritaItem } from "@/types/berita";
import { formatDateIndonesian } from "@/utils/formatters";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { fetchBeritaList } from "@/services/beritaService";

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
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] tracking-tight">
            Kabar & Berita Desa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Publikasi resmi pemerintah desa, agenda kegiatan masyarakat, dan perkembangan pembangunan Desa Bogem.
          </p>
        </div>
        <Link
          href="/berita"
          className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto active:scale-95 flex-shrink-0"
        >
          <span>Semua Berita</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl sm:rounded-3xl p-5 shadow-xs border border-slate-100 animate-pulse space-y-4">
              <div className="aspect-[16/9] bg-slate-200/70 rounded-xl w-full" />
              <div className="h-4 bg-slate-200/70 rounded w-1/3" />
              <div className="h-5 bg-slate-200/70 rounded w-4/5" />
              <div className="h-3 bg-slate-200/70 rounded w-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Belum Ada Warta Berita</h3>
          <p className="text-xs text-slate-500">
            Berita dan pengumuman terbaru akan segera dipublikasikan di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 flex flex-col justify-between group"
            >
              <Link href={`/berita/${item.id}`} className="block relative aspect-[16/9] bg-slate-100 overflow-hidden">
                <ImageWithSkeleton
                  src={item.gambar}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackIcon={<ImageIcon className="w-10 h-10 text-emerald-600/40" />}
                />
                {item.created_at && (
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-lg shadow-xs flex items-center space-x-1.5 z-10">
                    <Calendar className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                    <span>{formatDateIndonesian(item.created_at)}</span>
                  </div>
                )}
              </Link>

              <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {item.kategori && (
                    <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                      {item.kategori}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition line-clamp-2 leading-snug">
                    <Link href={`/berita/${item.id}`}>
                      {item.judul}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.ringkasan || item.konten}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/berita/${item.id}`}
                    className="text-xs font-bold text-emerald-800 flex items-center space-x-1 hover:text-emerald-950 transition group/link"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
