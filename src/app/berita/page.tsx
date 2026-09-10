"use client";

import { useState } from "react";
import Link from "next/link";
import { useBerita } from "@/hooks/useBerita";
import { formatDateIndonesian } from "@/utils/formatters";
import {
  Newspaper,
  Calendar,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  Search,
  ArrowLeft,
} from "lucide-react";
import { KATEGORI_BERITA_PRESETS } from "@/types/berita";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

export default function BeritaPage() {
  const { data: listBerita, loading } = useBerita();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", ...KATEGORI_BERITA_PRESETS];

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
    <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Banner - Clean, Minimalist & Glowing */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-sm p-6 sm:p-8 lg:p-10 text-white">
          {/* Ambient Lighting & Glows */}
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

          <div className="relative z-10 space-y-3 sm:space-y-4 max-w-3xl">
            {/* Clean Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs text-emerald-200/80 font-medium">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Beranda</span>
              </Link>
              <span className="text-emerald-500/60">/</span>
              <span className="text-white font-medium">Kabar Berita</span>
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

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Segmented Control Pill Container */}
          <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 shadow-xs inline-flex items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 flex-shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#063321] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari judul warta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 shadow-xs placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 text-emerald-800 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Memuat warta desa...</p>
          </div>
        ) : filteredBerita.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2">
            <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada berita ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter di atas.</p>
          </div>
        ) : (
          /* Berita Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBerita.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 flex flex-col justify-between group"
              >
                {/* News Banner Photo with Link */}
                <Link href={`/berita/${item.id}`} className="block relative aspect-[16/9] bg-slate-100 overflow-hidden">
                  <ImageWithSkeleton
                    src={item.gambar}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackIcon={<ImageIcon className="w-10 h-10 text-emerald-600/40" />}
                  />
                  {item.created_at && (
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-lg shadow-xs flex items-center space-x-1.5">
                      <Calendar className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                      <span>{formatDateIndonesian(item.created_at)}</span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {item.kategori && (
                      <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                        {item.kategori}
                      </span>
                    )}

                    <h2 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition line-clamp-2 leading-snug break-words">
                      <Link href={`/berita/${item.id}`}>
                        {item.judul}
                      </Link>
                    </h2>
                    
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 break-words">
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

      </div>
    </main>
  );
}