"use client";

import { useEffect, useState, useRef } from "react";

interface PendudukCardsProps {
  totalPenduduk?: number;
  kepalaKeluarga?: number;
  perempuan?: number;
  lakiLaki?: number;
}

// Hook count-up number animation yang halus dan natural
function useCountUp(targetNumber: number, durationMs: number = 1400, startNow: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startNow || targetNumber <= 0) {
      setCount(targetNumber);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      
      // Easing out cubic agar pergerakan angka natural dan elegan
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * targetNumber));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(targetNumber);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetNumber, durationMs, startNow]);

  return count;
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

      {/* Grid 4 Kartu Kependudukan Sesuai Desain Lampiran 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        
        {/* ================= 1. TOTAL PENDUDUK ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5">
          {/* Avatar Lingkaran Hijau Pastel (Keluarga) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-[#dcfce7] border border-emerald-100 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16">
              {/* Karakter Kiri (Ibu Rambut Pendek) */}
              <circle cx="28" cy="42" r="12" fill="#fed7aa" />
              <path d="M16 38 C16 26, 40 26, 40 38 C40 40, 38 43, 38 43 C38 43, 28 34, 16 38 Z" fill="#64748b" />
              <circle cx="24" cy="42" r="1.6" fill="#334155" />
              <circle cx="32" cy="42" r="1.6" fill="#334155" />
              <path d="M26 47 Q28 49 30 47" fill="none" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M16 62 C16 54, 40 54, 40 62 L40 76 L16 76 Z" fill="#f43f5e" />

              {/* Karakter Tengah (Nenek / Ibu Bersahaja) */}
              <circle cx="50" cy="36" r="14" fill="#fde68a" />
              <path d="M36 32 C36 20, 64 20, 64 32 C64 36, 60 38, 60 38 C60 38, 50 28, 36 32 Z" fill="#b45309" />
              <circle cx="45" cy="37" r="1.8" fill="#1e293b" />
              <circle cx="55" cy="37" r="1.8" fill="#1e293b" />
              <circle cx="42" cy="40" r="1.8" fill="#fb7185" opacity="0.6" />
              <circle cx="58" cy="40" r="1.8" fill="#fb7185" opacity="0.6" />
              <path d="M47 43 Q50 46 53 43" fill="none" stroke="#991b1b" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M34 56 C34 46, 66 46, 66 56 L66 76 L34 76 Z" fill="#ef4444" />

              {/* Karakter Kanan (Anak Cilik) */}
              <circle cx="72" cy="46" r="11" fill="#fed7aa" />
              <path d="M62 42 C62 34, 82 34, 82 42 C82 44, 72 38, 62 42 Z" fill="#78350f" />
              <circle cx="68" cy="46" r="1.5" fill="#1e293b" />
              <circle cx="76" cy="46" r="1.5" fill="#1e293b" />
              <path d="M70 50 Q72 52 74 50" fill="none" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M62 64 C62 57, 82 57, 82 64 L82 76 L62 76 Z" fill="#3b82f6" />
            </svg>
          </div>

          {/* Teks Informasi */}
          <div className="space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              TOTAL PENDUDUK
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
              {animatedTotal.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold text-slate-600">Jiwa</span>
            </div>
          </div>
        </div>

        {/* ================= 2. KEPALA KELUARGA ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5">
          {/* Avatar Lingkaran Kuning/Beige Pastel (Ayah Menggendong Anak) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-[#fef3c7] border border-amber-100 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16">
              {/* Wajah Ayah */}
              <circle cx="45" cy="40" r="15" fill="#fed7aa" />
              <path d="M30 34 C30 20, 60 20, 60 34 C60 36, 45 28, 30 34 Z" fill="#334155" />
              <circle cx="40" cy="39" r="1.8" fill="#0f172a" />
              <circle cx="50" cy="39" r="1.8" fill="#0f172a" />
              <path d="M42 45 Q45 48 48 45" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M26 60 C26 49, 64 49, 64 60 L64 76 L26 76 Z" fill="#f59e0b" />

              {/* Anak di Bahu Ayah */}
              <circle cx="68" cy="44" r="10" fill="#fde68a" />
              <path d="M60 40 C60 32, 78 32, 78 40 Z" fill="#2563eb" />
              <circle cx="65" cy="44" r="1.4" fill="#1e293b" />
              <circle cx="71" cy="44" r="1.4" fill="#1e293b" />
              <path d="M66 48 Q68 50 70 48" fill="none" stroke="#991b1b" strokeWidth="1" strokeLinecap="round" />
              <path d="M60 58 C60 53, 76 53, 76 58 L76 72 L60 72 Z" fill="#60a5fa" />
            </svg>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              KEPALA KELUARGA
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
              {animatedKk.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold text-slate-600">Jiwa</span>
            </div>
          </div>
        </div>

        {/* ================= 3. PEREMPUAN ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-pink-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5">
          {/* Avatar Lingkaran Pink/Rose Pastel (Muslimah Berhijab & Kacamata) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-[#ffe4e6] border border-pink-100 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16">
              {/* Kerudung Hijab Pink */}
              <path d="M28 38 C28 18, 72 18, 72 38 C72 58, 66 74, 50 76 C34 74, 28 58, 28 38 Z" fill="#f43f5e" />
              {/* Wajah */}
              <circle cx="50" cy="42" r="15" fill="#fde68a" />
              {/* Kacamata Bulat Rapi */}
              <circle cx="43.5" cy="41.5" r="4.5" fill="none" stroke="#881337" strokeWidth="1.6" />
              <circle cx="56.5" cy="41.5" r="4.5" fill="none" stroke="#881337" strokeWidth="1.6" />
              <line x1="48" y1="41.5" x2="52" y2="41.5" stroke="#881337" strokeWidth="1.6" />
              {/* Mata di Balik Lensa */}
              <circle cx="43.5" cy="41.5" r="1.8" fill="#1e293b" />
              <circle cx="56.5" cy="41.5" r="1.8" fill="#1e293b" />
              {/* Pipi & Senyum */}
              <circle cx="38" cy="46" r="2" fill="#fb7185" opacity="0.6" />
              <circle cx="62" cy="46" r="2" fill="#fb7185" opacity="0.6" />
              <path d="M46.5 47 Q50 50 53.5 47" fill="none" stroke="#9f1239" strokeWidth="1.6" strokeLinecap="round" />
              {/* Baju / Gamis */}
              <path d="M30 64 C30 55, 70 55, 70 64 L74 78 L26 78 Z" fill="#e11d48" />
            </svg>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              PEREMPUAN
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
              {animatedPerempuan.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold text-slate-600">Jiwa</span>
            </div>
          </div>
        </div>

        {/* ================= 4. LAKI-LAKI ================= */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-4 sm:space-x-5">
          {/* Avatar Lingkaran Biru Pastel (Pemuda Ceria) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center rounded-full bg-[#dbeafe] border border-blue-100 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16">
              {/* Wajah Pemuda */}
              <circle cx="50" cy="40" r="15" fill="#fed7aa" />
              {/* Rambut Rapi Pemuda */}
              <path d="M34 35 C34 20, 66 20, 66 35 C66 37, 50 28, 34 35 Z" fill="#334155" />
              <circle cx="44" cy="40" r="1.8" fill="#0f172a" />
              <circle cx="56" cy="40" r="1.8" fill="#0f172a" />
              <circle cx="40" cy="44" r="1.8" fill="#fb923c" opacity="0.6" />
              <circle cx="60" cy="44" r="1.8" fill="#fb923c" opacity="0.6" />
              <path d="M46 46 Q50 49 54 46" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
              {/* Jaket / Kaos Biru */}
              <path d="M28 62 C28 52, 72 52, 72 62 L72 76 L28 76 Z" fill="#2563eb" />
              <path d="M44 54 L50 64 L56 54 Z" fill="#ffffff" />
            </svg>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              LAKI-LAKI
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
              {animatedLaki.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold text-slate-600">Jiwa</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
