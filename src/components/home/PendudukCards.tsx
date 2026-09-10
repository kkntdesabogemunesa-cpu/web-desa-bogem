"use client";

import { useEffect, useState, useRef } from "react";
import { useCountUp } from "@/hooks";

interface PendudukCardsProps {
  totalPenduduk?: number;
  kepalaKeluarga?: number;
  perempuan?: number;
  lakiLaki?: number;
}

export default function PendudukCards({
  totalPenduduk = 1615,
  kepalaKeluarga = 1080,
  perempuan = 815,
  lakiLaki = 800,
}: PendudukCardsProps) {
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const animatedTotal = useCountUp(totalPenduduk, 1400, hasEnteredView);
  const animatedKk = useCountUp(kepalaKeluarga, 1200, hasEnteredView);
  const animatedPerempuan = useCountUp(perempuan, 1300, hasEnteredView);
  const animatedLaki = useCountUp(lakiLaki, 1300, hasEnteredView);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Title Bersih & Elegan Sesuai Lampiran 4 */}
      <h3 className="text-xl sm:text-2xl font-bold text-[#004329] tracking-tight">
        Jumlah Penduduk dan Kepala Keluarga
      </h3>

      {/* Grid 4 Kartu Kependudukan Sesuai Desain Referensi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        
        {/* ================= 1. TOTAL PENDUDUK ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-200/80 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5 group">
          {/* Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/penduduk/total-penduduk.png"
              alt="Total Penduduk"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
              TOTAL PENDUDUK
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D6E4A] tracking-tight">
              {animatedTotal.toLocaleString("id-ID")}{" "}
              <span className="text-base sm:text-lg font-semibold text-slate-700">Jiwa</span>
            </div>
          </div>
        </div>

        {/* ================= 2. KEPALA KELUARGA ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-200/80 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5 group">
          {/* Avatar: Kepala Keluarga */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/penduduk/kepala-keluarga.png"
              alt="Kepala Keluarga"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
              KEPALA KELUARGA
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D6E4A] tracking-tight">
              {animatedKk.toLocaleString("id-ID")}{" "}
              <span className="text-base sm:text-lg font-semibold text-slate-700">Jiwa</span>
            </div>
          </div>
        </div>

        {/* ================= 3. PEREMPUAN ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-200/80 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5 group">
          {/* Avatar: Perempuan */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/penduduk/perempuan.png"
              alt="Perempuan"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
              PEREMPUAN
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D6E4A] tracking-tight">
              {animatedPerempuan.toLocaleString("id-ID")}{" "}
              <span className="text-base sm:text-lg font-semibold text-slate-700">Jiwa</span>
            </div>
          </div>
        </div>

        {/* ================= 4. LAKI-LAKI ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-200/80 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5 group">
          {/* Avatar: Laki-Laki */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/penduduk/laki-laki.png"
              alt="Laki-Laki"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
              LAKI-LAKI
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D6E4A] tracking-tight">
              {animatedLaki.toLocaleString("id-ID")}{" "}
              <span className="text-base sm:text-lg font-semibold text-slate-700">Jiwa</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
