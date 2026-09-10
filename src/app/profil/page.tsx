"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Target,
  Compass,
  History,
  Network,
  Layers,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import VillageMap from "@/components/VillageMap";
import BaganStrukturDesa from "@/components/profil/BaganStrukturDesa";
import {
  fetchProfilDesa,
  defaultProfilDesa,
  defaultSejarahDesa,
  defaultBatasWilayah,
} from "@/services/profilService";
import { ProfilDesaData } from "@/types/profil";

export default function ProfilPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-20 text-center text-slate-400 text-sm">
            Memuat Profil Desa...
          </div>
        </main>
      }
    >
      <ProfilContent />
    </Suspense>
  );
}

function ProfilContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const getValidTab = (t: string | null): "visi-misi" | "bagan" | "sejarah" | "geografis" | "semua" => {
    if (t === "bagan" || t === "sotk" || t === "perangkat") return "bagan";
    if (t === "sejarah") return "sejarah";
    if (t === "geografis") return "geografis";
    if (t === "semua") return "semua";
    return "visi-misi";
  };

  const [selectedTab, setSelectedTab] = useState<"visi-misi" | "bagan" | "sejarah" | "geografis" | "semua" | null>(null);
  const activeTab = selectedTab ?? getValidTab(tabParam);

  const [profilData, setProfilData] = useState<ProfilDesaData>(defaultProfilDesa);

  useEffect(() => {
    async function loadData() {
      try {
        const profil = await fetchProfilDesa();
        if (profil) setProfilData(profil);
      } catch (err) {
        console.error("Gagal memuat profil desa:", err);
      }
    }
    loadData();
  }, []);

  const batas = profilData.batas_wilayah || defaultBatasWilayah;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Banner Section - Bersih, Simpel & Serasi dengan Infografis */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-sm p-6 sm:p-8 lg:p-10 text-white">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle Grid Dot Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
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
              <span className="text-white font-medium">Profil Desa</span>
            </div>

            {/* Title & Ringkasan Singkat Tanpa Badge Berlebih */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Profil Desa Bogem
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                Visi misi pembangunan, struktur organisasi tata kerja kepemimpinan, sejarah asal-usul, serta kondisi geografis Desa Bogem.
              </p>
            </div>
          </div>
        </div>

        {/* Segmented Control Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 shadow-xs inline-flex items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedTab("visi-misi")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
              activeTab === "visi-misi"
                ? "bg-[#063321] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Visi & Misi</span>
          </button>
          <button
            onClick={() => setSelectedTab("bagan")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
              activeTab === "bagan"
                ? "bg-[#063321] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Struktur Organisasi (SOTK)</span>
          </button>
          <button
            onClick={() => setSelectedTab("sejarah")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
              activeTab === "sejarah"
                ? "bg-[#063321] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Sejarah Desa</span>
          </button>
          <button
            onClick={() => setSelectedTab("geografis")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
              activeTab === "geografis"
                ? "bg-[#063321] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Wilayah & Geografis</span>
          </button>
          <button
            onClick={() => setSelectedTab("semua")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
              activeTab === "semua"
                ? "bg-[#063321] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Semua</span>
          </button>
        </div>

        {/* 1. SECTION: VISI & MISI */}
        {(activeTab === "semua" || activeTab === "visi-misi") && (
          <section id="visi-misi" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <Target className="w-5 h-5 text-emerald-700" />
                <span>Visi & Misi</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Arah kebijakan dan komitmen pembangunan Pemerintah Desa Bogem.
              </p>
            </div>

            {/* Visi */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 sm:p-6 border border-emerald-100/80 space-y-2">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                VISI DESA
              </span>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#063321] italic leading-relaxed">
                &ldquo;{profilData.visi || defaultProfilDesa.visi}&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                MISI PEMBANGUNAN
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {(profilData.misi && profilData.misi.length > 0 ? profilData.misi : defaultProfilDesa.misi).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 transition group hover:border-emerald-200"
                  >
                    <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-lg flex-shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2. SECTION: BAGAN STRUKTUR ORGANISASI (SOTK) DENGAN GARIS-GARIS */}
        {(activeTab === "semua" || activeTab === "bagan") && (
          <section id="bagan">
            <BaganStrukturDesa
              kadesName={profilData.nama_kades}
              kadesFoto={profilData.foto_kades}
              baganDesaImage={profilData.bagan_desa_image}
              baganBpdImage={profilData.bagan_bpd_image}
            />
          </section>
        )}

        {/* 3. SECTION: SEJARAH DESA */}
        {(activeTab === "semua" || activeTab === "sejarah") && (
          <section id="sejarah" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <History className="w-5 h-5 text-emerald-700" />
                <span>Sejarah Desa Bogem</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Asal-usul, nilai kearifan lokal, dan perjalanan sejarah masyarakat desa.
              </p>
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {profilData.sejarah || defaultSejarahDesa}
            </div>
          </section>
        )}

        {/* 4. SECTION: WILAYAH & GEOGRAFIS */}
        {(activeTab === "semua" || activeTab === "geografis") && (
          <section id="geografis" className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-emerald-700" />
                  <span>Kondisi Geografis & Wilayah</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Luas wilayah, batas tapal administratif, dan peta kawasan Desa Bogem.
                </p>
              </div>

              {/* 4 Stat Cards - Identik dengan gaya infografis */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100">
                  <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">
                    Luas Wilayah
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
                    {profilData.luas_wilayah || "101,03 Ha"}
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100">
                  <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">
                    Jumlah Penduduk
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
                    {profilData.jumlah_penduduk || "1.615 Jiwa"}
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100">
                  <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">
                    Ketinggian Wilayah
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
                    {profilData.ketinggian || "± 78 mdpl"}
                  </div>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100">
                  <span className="text-xs text-slate-500 block font-semibold uppercase tracking-wider mb-1">
                    Pembagian Wilayah
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] tracking-tight">
                    2 Dusun / 9 RT
                  </div>
                </div>
              </div>

              {/* Peta & Batas Wilayah */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
                <div className="lg:col-span-7 flex flex-col">
                  <VillageMap />
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  {/* Batas Administratif */}
                  <div className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Batas Wilayah Administratif</span>
                    </h4>

                    <div className="divide-y divide-slate-200/60 text-xs">
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-slate-500">Sebelah Utara</span>
                        <span className="font-bold text-slate-800">{batas.utara}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-slate-500">Sebelah Timur</span>
                        <span className="font-bold text-slate-800">{batas.timur}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-slate-500">Sebelah Selatan</span>
                        <span className="font-bold text-slate-800">{batas.selatan}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-slate-500">Sebelah Barat</span>
                        <span className="font-bold text-slate-800">{batas.barat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tipologi Lahan */}
                  <div className="bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-emerald-100/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Tipologi & Penggunaan Lahan
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Didominasi oleh lahan pertanian sawah teknis yang subur, perkebunan palawija, serta permukiman warga yang tertata asri di kawasan timur lereng Gunung Lawu, Kabupaten Magetan.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>
    </main>
  );
}