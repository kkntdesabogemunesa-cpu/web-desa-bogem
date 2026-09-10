"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Phone, ArrowRight, MapPin } from "lucide-react";
import { UMKMItem } from "@/types/umkm";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { fetchUMKMList } from "@/services/umkmService";

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
          <h2 className="text-xl sm:text-2xl font-bold text-[#004329] tracking-tight">
            Potensi & Produk UMKM Warga
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Dukung perekonomian lokal dengan membeli komoditas khas dan produk kreatif langsung dari warga Desa Bogem.
          </p>
        </div>
        <Link
          href="/potensi"
          className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto active:scale-95 flex-shrink-0"
        >
          <span>Semua Produk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl sm:rounded-3xl p-5 shadow-xs border border-slate-100 animate-pulse space-y-4">
              <div className="aspect-[4/3] bg-slate-200/70 rounded-xl w-full" />
              <div className="h-5 bg-slate-200/70 rounded w-3/4" />
              <div className="h-4 bg-slate-200/70 rounded w-1/2" />
              <div className="h-3 bg-slate-200/70 rounded w-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Belum Ada Produk UMKM</h3>
          <p className="text-xs text-slate-500">
            Produk dan karya usaha warga desa akan segera ditampilkan di etalase ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <ImageWithSkeleton
                  src={item.gambar}
                  alt={item.nama_usaha}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackIcon={<ShoppingBag className="w-10 h-10 text-emerald-600/40" />}
                />
                {item.kategori && (
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-xs z-10">
                    {item.kategori}
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-800 transition leading-snug line-clamp-1">
                    {item.nama_usaha}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>
                      Pemilik: <strong className="text-slate-700">{item.pemilik}</strong>
                    </span>
                    {item.alamat && (
                      <span className="flex items-center space-x-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{item.alamat}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {item.deskripsi}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Estimasi Harga</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#063321]">
                      {item.harga || "Hubungi WA"}
                    </span>
                  </div>
                  {item.kontak && (
                    <a
                      href={`https://wa.me/${item.kontak.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Halo, saya tertarik dengan produk ${item.nama_usaha} dari web desa.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3 sm:px-3.5 rounded-xl transition flex items-center space-x-1.5 shadow-xs active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Pesan WA</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
