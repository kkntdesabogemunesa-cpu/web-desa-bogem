"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { defaultInfografisData, fetchInfografisData } from "@/services/infografisService";
import { InfografisData } from "@/types/infografis";
import PendudukCards from "@/components/home/PendudukCards";

export default function StatistikSection() {
  const [data, setData] = useState<InfografisData>(defaultInfografisData);

  useEffect(() => {
    async function load() {
      try {
        const remote = await fetchInfografisData();
        setData(remote);
      } catch (err) {
        console.error("Failed to load statistics:", err);
      }
    }
    load();
  }, []);

  const { demografi } = data;
  const idmStatus = data.idm?.status || "DESA MANDIRI";
  const idmSkor = Number(data.idm?.skorTotal || 0.8542).toFixed(4);

  const TERRITORIAL_STATS = [
    { label: "Luas Wilayah", value: `${demografi.luas_wilayah || 101.03}`, sub: "Hektar (Ha)" },
    { label: "Status IDM", value: idmStatus.replace(/^DESA\s+/i, ""), sub: `Skor ${idmSkor}`, isSpecial: true },
    { label: "Jumlah Dusun", value: `${demografi.jumlah_dusun || 2}`, sub: "Wilayah Dusun" },
    { label: "Rukun Warga", value: `${demografi.jumlah_rw || 2}`, sub: "Rukun Warga (RW)" },
    { label: "Rukun Tetangga", value: `${demografi.jumlah_rt || 9}`, sub: "Rukun Tetangga (RT)" },
    { label: "Tipologi", value: "Dataran", sub: "Pertanian & Pemukiman" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 space-y-6">
      
      {/* 4 Kartu Kependudukan Sesuai Desain Lampiran 4 */}
      <PendudukCards
        totalPenduduk={demografi.total_penduduk}
        kepalaKeluarga={demografi.kepala_keluarga}
        perempuan={demografi.wanita}
        lakiLaki={demografi.pria}
      />

      {/* Banner Ringkasan Statistik Wilayah & Kemandirian */}
      <div className="bg-[#073623] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-sm space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-500/40 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>Statistik & Kemandirian Desa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Desa Bogem dalam Angka
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Data kewilayahan, kelembagaan RT/RW, dan capaian Indeks Desa Membangun (IDM)
            </p>
          </div>
          <Link
            href="/infografis"
            className="inline-flex items-center space-x-2 bg-white text-[#063321] hover:bg-emerald-50 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto active:scale-95"
          >
            <span>Infografis Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
          </Link>
        </div>

        {/* 6 Metrik Kewilayahan */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {TERRITORIAL_STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-3.5 sm:p-4 text-center space-y-1 border ${
                stat.isSpecial
                  ? "bg-emerald-950/60 border-emerald-400/40"
                  : "bg-white/10 border-white/10"
              }`}
            >
              <span
                className={`text-[9px] sm:text-[10px] uppercase tracking-wider block font-semibold truncate ${
                  stat.isSpecial ? "text-emerald-200" : "text-emerald-200/80"
                }`}
              >
                {stat.label}
              </span>
              <div className="text-lg sm:text-xl font-bold text-white truncate">
                {stat.value}
              </div>
              <span className="text-[10px] block truncate text-emerald-300/80">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
