"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Target,
  Compass,
  History,
  Network,
  MapPin,
  ArrowLeft,
  LucideIcon,
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type TabType = "visi-misi" | "bagan" | "sejarah" | "geografis";

interface TabConfig {
  id: TabType;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
}

const TABS: TabConfig[] = [
  { id: "visi-misi", label: "Visi & Misi", mobileLabel: "Visi & Misi", icon: Target },
  { id: "bagan", label: "Struktur Organisasi (SOTK)", mobileLabel: "Struktur (SOTK)", icon: Network },
  { id: "sejarah", label: "Sejarah Desa", mobileLabel: "Sejarah Desa", icon: History },
  { id: "geografis", label: "Wilayah & Geografis", mobileLabel: "Wilayah & Geografis", icon: Compass },
];

function getValidTab(t: string | null): TabType {
  if (t === "bagan" || t === "sotk" || t === "perangkat") return "bagan";
  if (t === "sejarah") return "sejarah";
  if (t === "geografis") return "geografis";
  return "visi-misi";
}

export default function ProfilPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-20 text-center text-muted-foreground text-sm">
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

  const [activeTab, setActiveTab] = useState<TabType>(() => getValidTab(tabParam));

  // Sinkronisasi otomatis saat URL berubah (misal: tombol Back/Forward browser)
  useEffect(() => {
    setActiveTab(getValidTab(tabParam));
  }, [tabParam]);

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
    <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-xs p-6 sm:p-8 lg:p-10 text-white">
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
                <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Beranda</span>
              </Link>
              <span className="text-emerald-500/60">/</span>
              <span className="text-white font-medium">Profil Desa</span>
            </div>

            {/* Title & Ringkasan */}
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

        {/* Mobile Navigation Tabs (HP): Tampilan 2x2 Grid */}
        <div
          role="tablist"
          aria-label="Kategori Profil Desa Mobile"
          className="grid grid-cols-2 gap-2 sm:hidden w-full bg-card/90 backdrop-blur-sm p-2 rounded-2xl border border-border/80 shadow-xs"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/profil?tab=${tab.id}`}
                replace
                scroll={false}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isActive
                    ? "bg-[#063321] text-white shadow-xs"
                    : "bg-muted/50 text-foreground/80 hover:bg-muted border border-border/60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-white/15 text-emerald-300"
                      : "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  }`}
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  {tab.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop / Laptop Segmented Control */}
        <div
          role="tablist"
          aria-label="Kategori Profil Desa"
          className="hidden sm:inline-flex bg-card/80 backdrop-blur-sm p-1.5 rounded-2xl border border-border/80 shadow-xs items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/profil?tab=${tab.id}`}
                replace
                scroll={false}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 shrink-0 ${
                  isActive
                    ? "bg-[#063321] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* 1. SECTION: VISI & MISI */}
        {activeTab === "visi-misi" && (
          <Card id="visi-misi" className="p-6 sm:p-8 border-border/80 shadow-xs space-y-6 bg-card">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center space-x-2">
                <Target className="size-5 text-emerald-700" />
                <span>Visi & Misi</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Arah kebijakan dan komitmen pembangunan Pemerintah Desa Bogem.
              </p>
            </div>

            {/* Visi */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-5 sm:p-6 border border-emerald-100/80 dark:border-emerald-800/40 space-y-2">
              <Badge variant="secondary" className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                VISI DESA
              </Badge>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#063321] dark:text-emerald-100 italic leading-relaxed">
                &ldquo;{profilData.visi || defaultProfilDesa.visi}&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                MISI PEMBANGUNAN
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {(profilData.misi && profilData.misi.length > 0 ? profilData.misi : defaultProfilDesa.misi).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-muted/40 hover:bg-muted/70 border border-border/80 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 transition group hover:border-emerald-200"
                  >
                    <Badge variant="secondary" className="text-sm font-extrabold text-emerald-700 bg-emerald-100/80 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-lg shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </Badge>
                    <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed font-normal">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* 2. SECTION: BAGAN STRUKTUR ORGANISASI (SOTK) */}
        {activeTab === "bagan" && (
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
        {activeTab === "sejarah" && (
          <Card id="sejarah" className="p-6 sm:p-8 border-border/80 shadow-xs space-y-5 bg-card">
            <div className="pb-3 border-b border-border/60">
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center space-x-2">
                <History className="size-5 text-emerald-700" />
                <span>Sejarah Desa Bogem</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Asal-usul, nilai kearifan lokal, dan perjalanan sejarah masyarakat desa.
              </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line space-y-3">
              {profilData.sejarah || defaultSejarahDesa}
            </div>
          </Card>
        )}

        {/* 4. SECTION: WILAYAH & GEOGRAFIS */}
        {activeTab === "geografis" && (
          <section id="geografis" className="space-y-6">
            <Card className="p-6 sm:p-8 border-border/80 shadow-xs space-y-6 bg-card">
              <div className="pb-3 border-b border-border/60">
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center space-x-2">
                  <Compass className="size-5 text-emerald-700" />
                  <span>Kondisi Geografis & Wilayah</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Luas wilayah, batas tapal administratif, dan peta kawasan Desa Bogem.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="bg-muted/40 rounded-2xl p-4 sm:p-5 border border-border/60">
                  <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
                    Luas Wilayah
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight">
                    {profilData.luas_wilayah || "101,03 Ha"}
                  </div>
                </div>

                <div className="bg-muted/40 rounded-2xl p-4 sm:p-5 border border-border/60">
                  <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
                    Jumlah Penduduk
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight">
                    {profilData.jumlah_penduduk || "1.615 Jiwa"}
                  </div>
                </div>

                <div className="bg-muted/40 rounded-2xl p-4 sm:p-5 border border-border/60">
                  <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
                    Ketinggian Wilayah
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight">
                    {profilData.ketinggian || "± 78 mdpl"}
                  </div>
                </div>

                <div className="bg-muted/40 rounded-2xl p-4 sm:p-5 border border-border/60">
                  <span className="text-xs text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
                    Pembagian Wilayah
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight">
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
                  <div className="bg-muted/40 p-5 sm:p-6 rounded-2xl border border-border/60 space-y-3">
                    <h4 className="text-xs font-bold text-foreground/80 uppercase tracking-wider flex items-center space-x-1.5">
                      <MapPin className="size-3.5 text-emerald-700" />
                      <span>Batas Wilayah Administratif</span>
                    </h4>

                    <div className="divide-y divide-border/60 text-xs">
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-muted-foreground">Sebelah Utara</span>
                        <span className="font-bold text-foreground">{batas.utara}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-muted-foreground">Sebelah Timur</span>
                        <span className="font-bold text-foreground">{batas.timur}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-muted-foreground">Sebelah Selatan</span>
                        <span className="font-bold text-foreground">{batas.selatan}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="font-semibold text-muted-foreground">Sebelah Barat</span>
                        <span className="font-bold text-foreground">{batas.barat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tipologi Lahan */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-5 sm:p-6 rounded-2xl border border-emerald-100/80 dark:border-emerald-800/40 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                      Tipologi & Penggunaan Lahan
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Didominasi oleh lahan pertanian sawah teknis yang subur, perkebunan palawija, serta permukiman warga yang tertata asri di kawasan timur lereng Gunung Lawu, Kabupaten Magetan.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}