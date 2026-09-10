"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, TrendingUp, CheckCircle, ArrowLeft, TreePine, Store } from "lucide-react";
import Link from "next/link";
import { defaultInfografisData, fetchInfografisData } from "@/services/infografisService";
import { StatIDM } from "@/types/infografis";

export default function IDMPage() {
  const [idmData, setIdmData] = useState<StatIDM>(defaultInfografisData.idm);

  useEffect(() => {
    async function load() {
      try {
        const remote = await fetchInfografisData();
        if (remote?.idm) {
          setIdmData(remote.idm);
        }
      } catch (err) {
        console.error("Failed to load IDM data:", err);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Hero IDM Banner - Clean, Minimalist & Glowing */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-sm p-6 sm:p-8 lg:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
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

          <div className="relative z-10 space-y-3 sm:space-y-4 max-w-2xl text-center md:text-left">
            {/* Clean Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs text-emerald-200/80 font-medium justify-center md:justify-start">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Beranda</span>
              </Link>
              <span className="text-emerald-500/60">/</span>
              <Link href="/infografis" className="hover:text-white transition-colors">
                Infografis
              </Link>
              <span className="text-emerald-500/60">/</span>
              <span className="text-white font-medium">Status IDM</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Indeks Desa Membangun
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                Tolak ukur kemandirian Desa Bogem berdasarkan ketahanan sosial (IKS), ketahanan ekonomi (IKE), dan ketahanan lingkungan hidup (IKL).
              </p>
            </div>
          </div>

          {/* Minimalist Glassmorphic IDM Score Box */}
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-center w-full sm:w-auto min-w-[240px] sm:min-w-[260px] shadow-sm space-y-2.5 flex-shrink-0">
            <span className="inline-block px-3 py-1 bg-emerald-400 text-[#063321] font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-xs">
              {idmData.status}
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
              {Number(idmData.skorTotal || 0).toFixed(4)}
            </div>
            <div className="text-xs text-emerald-200/90 font-medium">
              Skor IDM Tahun {idmData.tahun}
            </div>
          </div>
        </div>

        {/* 3 Constituent Sub-Index Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* IKS */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-lg">
                  {idmData.iks?.label || "Sangat Baik"}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IKS (Ketahanan Sosial)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums mt-1">
                  {Number(idmData.iks?.skor || 0).toFixed(4)}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pelayanan kesehatan, akses pendidikan dasar, pemukiman layak, dan modal sosial kebersamaan warga.
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (idmData.iks?.skor || 0) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* IKE */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
                  <Store className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-lg">
                  {idmData.ike?.label || "Baik (Berkembang)"}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IKE (Ketahanan Ekonomi)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums mt-1">
                  {Number(idmData.ike?.skor || 0).toFixed(4)}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keragaman produksi ekonomi warga, sentra perdagangan lokal, akses perbankan, dan logistik desa.
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-700 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (idmData.ike?.skor || 0) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* IKL */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
                  <TreePine className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-lg">
                  {idmData.ikl?.label || "Sangat Baik"}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IKL (Ketahanan Lingkungan)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums mt-1">
                  {Number(idmData.ikl?.skor || 0).toFixed(4)}
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kualitas kelestarian lingkungan hidup, kesiapsiagaan mitigasi bencana, dan keteraturan ruang desa.
              </p>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-800 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, (idmData.ikl?.skor || 0) * 100))}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Yearly Growth Timeline */}
        {idmData.riwayat && idmData.riwayat.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-100/80">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Perkembangan Status IDM Pertahun
                </h2>
                <p className="text-xs text-slate-500">Rekam jejak capaian kemandirian desa secara berkala.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {idmData.riwayat.map((item) => {
                const isMandiri = item.status.toLowerCase().includes("mandiri");
                const badgeClass = isMandiri
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                  : "bg-slate-100 text-slate-700 border border-slate-200/60";

                return (
                  <div
                    key={item.tahun}
                    className="bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-100/80 space-y-3 hover:border-emerald-200/80 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tahun {item.tahun}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${badgeClass}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                      {Number(item.skor || 0).toFixed(4)}
                    </div>
                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, (item.skor || 0) * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Indicators Checklist */}
        {idmData.faktor_pendukung && idmData.faktor_pendukung.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Faktor Pendukung Status Kemandirian Desa</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 font-medium">
              {idmData.faktor_pendukung.map((point, idx) => (
                <li key={idx} className="flex items-center space-x-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </main>
  );
}
