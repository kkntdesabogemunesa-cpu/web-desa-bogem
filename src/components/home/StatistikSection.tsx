"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { defaultInfografisData, fetchInfografisData } from "@/services/infografisService";
import { InfografisData } from "@/types/infografis";
import PendudukCards from "@/components/home/PendudukCards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const luasFormatted = Number(demografi.luas_wilayah || 101.03).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const TERRITORIAL_STATS = [
    { label: "Luas Wilayah", value: luasFormatted, sub: "Hektar (Ha)", href: "/infografis" },
    { label: "Status IDM", value: idmStatus.replace(/^DESA\s+/i, ""), sub: `Skor ${idmSkor}`, isSpecial: true, href: "/infografis/idm" },
    { label: "Jumlah Dusun", value: `${demografi.jumlah_dusun || 2}`, sub: "Wilayah Dusun", href: "/infografis" },
    { label: "Rukun Warga", value: `${demografi.jumlah_rw || 2}`, sub: "Rukun Warga (RW)", href: "/infografis" },
    { label: "Rukun Tetangga", value: `${demografi.jumlah_rt || 9}`, sub: "Rukun Tetangga (RT)", href: "/infografis" },
    { label: "Tipologi", value: "Dataran", sub: "Pertanian & Pemukiman", href: "/profil?tab=geografis" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 space-y-6">
      {/* 4 Kartu Kependudukan */}
      <PendudukCards
        totalPenduduk={demografi.total_penduduk}
        kepalaKeluarga={demografi.kepala_keluarga}
        perempuan={demografi.wanita}
        lakiLaki={demografi.pria}
      />

      {/* Banner Ringkasan Statistik Wilayah & Kemandirian */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-xs p-6 sm:p-8 lg:p-10 text-white space-y-6">
        {/* Ambient Lighting & Glows */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Grid Dot Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Header - Simple & Clean */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Statistik & Kemandirian Desa
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Capaian status kemandirian IDM, pembagian wilayah administrasi, dan tata kelola lingkungan Desa Bogem.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-white text-[#063321] hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs self-start sm:self-auto"
          >
            <Link href="/infografis">
              <span>Infografis Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
            </Link>
          </Button>
        </div>

        {/* 6 Metrik Kewilayahan */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {TERRITORIAL_STATS.map((stat, idx) => {
            const Content = (
              <div
                className={`rounded-2xl p-3.5 sm:p-4 text-center space-y-1.5 transition-all duration-200 border ${
                  stat.isSpecial
                    ? "bg-emerald-400/15 border-emerald-400/40 hover:bg-emerald-400/25 shadow-xs"
                    : "bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/15 hover:border-white/20"
                }`}
              >
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase tracking-wider font-semibold border-0 py-0 px-1.5 ${
                      stat.isSpecial ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-emerald-200/90"
                    }`}
                  >
                    {stat.label}
                  </Badge>
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight tabular-nums truncate">
                  {stat.value}
                </div>
                <span className="text-[10px] block truncate text-emerald-300/80 font-medium">
                  {stat.sub}
                </span>
              </div>
            );

            return stat.href ? (
              <Link key={idx} href={stat.href} className="block group">
                {Content}
              </Link>
            ) : (
              <div key={idx}>{Content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
