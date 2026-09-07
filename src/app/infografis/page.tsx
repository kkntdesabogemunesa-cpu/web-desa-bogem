"use client";

import { useState, useEffect } from "react";
import {
  Users,
  PieChart,
  Wallet,
  MapPin,
  Building2,
  User,
  ArrowUpRight,
  TrendingUp,
  ArrowLeft,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import {
  fetchInfografisData,
  defaultInfografisData,
} from "@/services/infografisService";
import { InfografisData } from "@/types/infografis";

export default function InfografisPage() {
  const [activeTab, setActiveTab] = useState<"penduduk" | "organisasi" | "apbd">("penduduk");
  
  // Safe initial state matches SSR
  const [data, setData] = useState<InfografisData>(defaultInfografisData);

  useEffect(() => {
    async function loadData() {
      try {
        const remote = await fetchInfografisData();
        setData(remote);
      } catch (err) {
        console.error("Error loading infografis:", err);
      }
    }
    loadData();
  }, []);

  const { demografi, apbdes } = data;
  const organisasi = data.organisasi || [];

  // Calculate sex ratio percentages
  const totalWarga = demografi.total_penduduk || (demografi.pria + demografi.wanita) || 1;
  const persenPria = ((demografi.pria / totalWarga) * 100).toFixed(1);
  const persenWanita = ((demografi.wanita / totalWarga) * 100).toFixed(1);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Banner Section */}
        <div className="bg-[#073623] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white px-3 py-1 rounded-full text-xs font-semibold transition border border-white/10 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
              <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-500/40 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <PieChart className="w-3.5 h-3.5 text-emerald-300" />
                <span>Statistik & Visualisasi Data</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Infografis Desa Bogem
            </h1>
            <p className="text-emerald-100/85 text-xs sm:text-sm lg:text-base leading-relaxed">
              Sajian statistik transparan mengenai demografi kependudukan, kelembagaan & organisasi desa, dan struktur keuangan APBDes Pemerintah Desa Bogem.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/infografis/idm"
                className="inline-flex items-center space-x-2 bg-white text-[#063321] hover:bg-emerald-50 font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
              >
                <span>Lihat Status IDM Desa</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-700" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs with horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("penduduk")}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 shadow-sm ${
              activeTab === "penduduk"
                ? "bg-[#063321] text-white"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Demografi Penduduk</span>
          </button>
          <button
            onClick={() => setActiveTab("organisasi")}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 shadow-sm ${
              activeTab === "organisasi"
                ? "bg-[#063321] text-white"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Kelembagaan & Organisasi</span>
          </button>
          <button
            onClick={() => setActiveTab("apbd")}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 shadow-sm ${
              activeTab === "apbd"
                ? "bg-[#063321] text-white"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>APBDes & Transparansi Anggaran</span>
          </button>
        </div>

        {/* Tab 1: Demografi Penduduk */}
        {activeTab === "penduduk" && (
          <div className="space-y-6">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 space-y-1.5 sm:space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {demografi.total_penduduk.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">Total Penduduk (Jiwa)</div>
              </div>

              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 space-y-1.5 sm:space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <span className="font-bold text-xs sm:text-sm">♂</span>
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {demografi.pria.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">
                  Laki-Laki ({persenPria}%)
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 space-y-1.5 sm:space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <span className="font-bold text-xs sm:text-sm">♀</span>
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {demografi.wanita.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">
                  Perempuan ({persenWanita}%)
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 space-y-1.5 sm:space-y-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {demografi.kepala_keluarga.toLocaleString("id-ID")}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500">Kepala Keluarga (KK)</div>
              </div>
            </div>

            {/* Visual Progress Ratio */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                <span>Rasio Komposisi Jenis Kelamin</span>
              </h3>
              <div className="w-full bg-slate-100 rounded-2xl h-9 overflow-hidden flex p-1 border border-slate-200/60">
                <div
                  style={{ width: `${persenPria}%` }}
                  className="bg-blue-600 h-full rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-sm transition-all duration-700"
                >
                  Laki-Laki {persenPria}%
                </div>
                <div
                  style={{ width: `${persenWanita}%` }}
                  className="bg-rose-500 h-full rounded-xl flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white shadow-sm ml-1 transition-all duration-700"
                >
                  Perempuan {persenWanita}%
                </div>
              </div>
            </div>

            {/* Wilayah Rincian */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80">
                <span className="text-xs text-slate-500 block font-semibold">Luas Wilayah</span>
                <span className="text-base sm:text-lg font-extrabold text-[#00321F]">{demografi.luas_wilayah} Ha</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80">
                <span className="text-xs text-slate-500 block font-semibold">Jumlah Dusun</span>
                <span className="text-base sm:text-lg font-extrabold text-[#00321F]">{demografi.jumlah_dusun} Dusun</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80">
                <span className="text-xs text-slate-500 block font-semibold">Jumlah Rukun Warga</span>
                <span className="text-base sm:text-lg font-extrabold text-[#00321F]">{demografi.jumlah_rw} RW</span>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80">
                <span className="text-xs text-slate-500 block font-semibold">Jumlah Rukun Tetangga</span>
                <span className="text-base sm:text-lg font-extrabold text-[#00321F]">{demografi.jumlah_rt} RT</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kelembagaan & Organisasi Desa */}
        {activeTab === "organisasi" && (
          <div className="space-y-6">
            {/* Header info & Stats banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="inline-flex items-center space-x-2 text-emerald-800 text-xs font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Lembaga Kemasyarakatan Desa (LKD)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Organisasi & Kelembagaan Desa Bogem
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Wadah partisipasi aktif masyarakat desa dalam permusyawaratan, perencanaan pembangunan, pemberdayaan wanita, kepemudaan, ketertiban umum, dan pelayanan sosial.
                </p>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl px-4 py-3 text-center min-w-[110px]">
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-900">
                    {organisasi.length}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700">Lembaga Aktif</div>
                </div>
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {organisasi.map((org) => (
                <div
                  key={org.id || org.nama}
                  className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Singkatan Badge & Kategori */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl bg-[#004329] text-white font-extrabold text-xs shadow-sm">
                        {org.singkatan || "Lembaga"}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg truncate max-w-[160px]">
                        {org.kategori}
                      </span>
                    </div>

                    {/* Nama Organisasi */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition">
                        {org.nama}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5 line-clamp-3">
                        {org.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Footer Meta: Ketua & Anggota */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Ketua / Pimpinan:</span>
                      </span>
                      <strong className="text-slate-800 font-bold truncate max-w-[140px]">{org.ketua}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pengurus/Kader:</span>
                      </span>
                      <strong className="text-slate-800 font-bold">{org.jumlah_anggota || "-"}</strong>
                    </div>

                    {org.kontak && org.kontak !== "-" && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400 font-medium">Kontak/Sekretariat:</span>
                        <strong className="text-emerald-800 font-bold truncate max-w-[140px]">{org.kontak}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: APBDes Transparansi */}
        {activeTab === "apbd" && (
          <div className="space-y-6">
            {/* 3 Top Financial Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-2">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Pendapatan Desa</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    TA {apbdes.tahun_anggaran}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
                  Rp {apbdes.pendapatan_total.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-slate-500">Dana Desa, ADD, PADes, Bagi Hasil Pajak</p>
              </div>

              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-2">
                <div className="text-xs font-bold text-[#004329] uppercase tracking-wider flex items-center justify-between">
                  <span>Belanja Desa</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                    TA {apbdes.tahun_anggaran}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Rp {apbdes.belanja_total.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-slate-500">Infrastruktur, Penyelenggaraan & Pemberdayaan</p>
              </div>

              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-2 sm:col-span-2 md:col-span-1">
                <div className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Surplus / SiLPA</span>
                  <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                    TA {apbdes.tahun_anggaran}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-teal-700">
                  Rp {apbdes.surplus_defisit.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-slate-500">Sisa Lebih Perhitungan Anggaran Tahun Berjalan</p>
              </div>
            </div>

            {/* Rincian Pendapatan & Belanja 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Rincian Pendapatan */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-emerald-900">
                    Rincian Sumber Pendapatan Desa
                  </h3>
                  <span className="text-xs font-extrabold text-emerald-700">
                    Rp {apbdes.pendapatan_total.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {apbdes.pendapatan_rincian.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 last:border-0">
                      <span className="font-semibold text-slate-700">{item.nama}</span>
                      <span className="font-bold text-emerald-800">
                        Rp {item.nominal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rincian Belanja */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Rincian Bidang Belanja Desa
                  </h3>
                  <span className="text-xs font-extrabold text-slate-900">
                    Rp {apbdes.belanja_total.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {apbdes.belanja_rincian.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50 last:border-0">
                      <span className="font-semibold text-slate-700">{item.nama}</span>
                      <span className="font-bold text-slate-900">
                        Rp {item.nominal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Banner Transparansi */}
            <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Transparansi Keuangan Publik</span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold">Laporan Realisasi APBDes Tahun {apbdes.tahun_anggaran}</h4>
                <p className="text-xs text-emerald-200/80">
                  Seluruh penerimaan dan belanja keuangan desa dikelola secara akuntabel, transparan, dan dapat dipertanggungjawabkan kepada seluruh warga Desa Bogem.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
