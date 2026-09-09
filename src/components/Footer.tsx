"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Globe,
  ChevronDown,
  Share2,
  Compass,
  DoorOpen,
} from "lucide-react";
import { fetchProfilDesa, defaultProfilDesa } from "@/services/profilService";
import { recordWebsiteVisit, VisitorStats } from "@/services/visitorService";
import { ProfilDesaData } from "@/types/profil";

export default function Footer() {
  const pathname = usePathname();
  const [profil, setProfil] = useState<ProfilDesaData>(defaultProfilDesa);
  const [stats, setStats] = useState<VisitorStats>({
    hariIni: 1,
    kemarin: 0,
    mingguIni: 1,
    mingguLalu: 0,
    bulanIni: 1,
    bulanLalu: 0,
    totalKunjungan: 1,
  });

  // State untuk expand ringkasan kunjungan (Desktop)
  const [isExpanded, setIsExpanded] = useState(false);
  // State timestamp pembaruan terakhir (WIB)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // State untuk accordion di tampilan mobile (default tersembunyi / tertutup, baru terbuka saat diklik)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // 1. Initial fetch profil desa & pencatatan kunjungan saat mount
  useEffect(() => {
    fetchProfilDesa().then((data) => {
      if (data) setProfil(data);
    }).catch(() => {});

    // Rekam kunjungan nyata (100% real data) dan perbarui statistik
    recordWebsiteVisit().then((realStats) => {
      if (realStats) {
        setStats(realStats);
        setLastUpdated(new Date());
      }
    });
  }, []);

  // Sembunyikan footer saat berada di panel admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const rawPhone = profil.telepon_kantor || "0851-3655-8975";
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const formatWIBTime = (date: Date | null) => {
    if (!date) return "-";
    try {
      return (
        new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(date) + " WIB"
      );
    } catch {
      return date.toLocaleTimeString("id-ID") + " WIB";
    }
  };

  return (
    <footer className="bg-[#05281a] text-emerald-100/90 border-t border-emerald-900/60 pb-28 md:pb-8 pt-8 sm:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================== TAMPILAN LAPTOP & DESKTOP (>= md) ===================== */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-10 items-start">
          
          {/* Kolom 1: Info Identitas Desa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-11 h-14 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/images/logo-magetan.png"
                  alt="Logo Kabupaten Magetan"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">Desa Bogem</h3>
                <p className="text-xs text-emerald-300 font-medium">Kecamatan Kawedanan</p>
                <p className="text-xs text-emerald-400/80">Kabupaten Magetan, Jawa Timur</p>
              </div>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Website Resmi Layanan Informasi Publik, Administrasi Persuratan & Promosi Produk UMKM Warga Desa Bogem.
            </p>
          </div>

          {/* Kolom 2: Kontak Kantor Desa */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
              Kontak Kantor Desa
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/90">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {profil.alamat_kantor || "Jl. Bakti Mulya No. 241, Desa Bogem, Kec. Kawedanan, Kab. Magetan"}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition">
                  {rawPhone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${profil.email_kantor || "desabogemjaya@gmail.com"}`} className="hover:text-white transition">
                  {profil.email_kantor || "desabogemjaya@gmail.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Jam Pelayanan (Kontak Darurat Dihapus sesuai permintaan user) */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
              Jam Pelayanan Kantor
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/90">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-semibold text-white">{profil.jam_pelayanan || "Senin - Jumat: 08.00 - 15.00 WIB"}</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                {profil.jam_pelayanan_note || "*Sabtu & Minggu: Libur Pelayanan Administrasi"}
              </p>
              <div className="pt-2 border-t border-emerald-900/60 text-xs text-emerald-300/80 leading-relaxed">
                Pelayanan persuratan warga dapat diajukan secara online 24 jam melalui menu Layanan Surat.
              </div>
            </div>
          </div>

          {/* Kolom 4: WIDGET KUNJUNGAN WEBSITE (DATA REAL SESUAI LAMPIRAN 1) */}
          <div className="space-y-3">
            <div className="bg-[#3e4548] text-white rounded-2xl p-4 shadow-xl border border-slate-600/60 space-y-2.5">
              <h4 className="text-sm font-extrabold tracking-wide text-white border-b border-slate-600/80 pb-2">
                Jumlah Kunjungan
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-600/50">
                  <span className="text-slate-200">Hari Ini</span>
                  <span className="font-bold text-white text-sm">{stats.hariIni.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-600/50">
                  <span className="text-slate-200">Kemarin</span>
                  <span className="font-bold text-white">{stats.kemarin.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-600/50">
                  <span className="text-slate-200">Minggu Ini</span>
                  <span className="font-bold text-white">{stats.mingguIni.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-600/50">
                  <span className="text-slate-200">Minggu Lalu</span>
                  <span className="font-bold text-white">{stats.mingguLalu.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-600/50">
                  <span className="text-slate-200">Bulan Ini</span>
                  <span className="font-bold text-white">{stats.bulanIni.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-600/50">
                  <span className="text-slate-200">Bulan Lalu</span>
                  <span className="font-bold text-white">{stats.bulanLalu.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 font-bold text-emerald-300">
                  <span>Total Kunjungan</span>
                  <span className="text-sm text-emerald-200">{stats.totalKunjungan.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Indikator Pill Button Sesuai Lampiran 1 (Interactive Expand) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full bg-[#3aa37e] hover:bg-[#349271] text-white px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-md transition active:scale-95 cursor-pointer text-left"
                aria-expanded={isExpanded}
                aria-label="Toggle ringkasan kunjungan hari ini"
              >
                <div className="flex items-center space-x-2.5">
                  <DoorOpen className="w-5 h-5 flex-shrink-0" />
                  <div className="leading-tight">
                    <div className="text-[11px] font-medium opacity-90">Kunjungan</div>
                    <div className="text-xs font-bold">{stats.hariIni} Hari Ini</div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 opacity-80 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Panel Ringkasan Realtime saat Expanded */}
              {isExpanded && (
                <div className="bg-[#2d3336] text-white rounded-2xl p-3.5 shadow-lg border border-slate-600/60 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-600/60">
                    <span className="text-slate-300">Kunjungan Unik Hari Ini:</span>
                    <span className="font-extrabold text-emerald-300 text-sm">
                      {stats.hariIni.toLocaleString("id-ID")} orang
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[11px] text-emerald-300 font-medium">
                        Statistik Kunjungan Aktif
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 text-right">
                    Terakhir diperbarui: {formatWIBTime(lastUpdated)}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ===================== TAMPILAN MOBILE (< md) ACCORDION SESUAI LAMPIRAN 2 ===================== */}
        <div className="md:hidden space-y-4 mb-8">
          
          {/* Header Mobile: Logo & Nama Desa Sesuai Lampiran 2 */}
          <div className="flex items-center space-x-3 pb-3 border-b border-emerald-900/60">
            <div className="w-12 h-14 flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/logo-magetan.png"
                alt="Logo Kabupaten Magetan"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">Desa Bogem</h3>
              <p className="text-xs text-emerald-300 font-medium">Kecamatan Kawedanan</p>
              <p className="text-xs text-emerald-400/90">Kabupaten Magetan</p>
              <p className="text-[11px] text-emerald-500">Provinsi Jawa Timur</p>
            </div>
          </div>

          {/* List Accordion Mobile (Kontak Darurat Dihapus sesuai permintaan user) */}
          <div className="space-y-2 text-sm">
            
            {/* 1. Accordion: Kunjungan Website (Data Real) */}
            <div className="border-b border-emerald-900/50 pb-2">
              <button
                type="button"
                onClick={() => toggleAccordion("kunjungan")}
                className="w-full flex items-center justify-between py-2.5 font-bold text-white text-left active:opacity-80 cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Kunjungan Website</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${
                    openAccordion === "kunjungan" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "kunjungan" && (
                <div className="mt-2 bg-[#3e4548] text-white rounded-2xl p-4 shadow-xl border border-slate-600/60 space-y-2 animate-in fade-in duration-200">
                  <h5 className="text-xs font-bold text-emerald-300 border-b border-slate-600 pb-1 mb-2">
                    Statistik Kunjungan Real
                  </h5>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/50 text-xs">
                    <span className="text-slate-200">Hari Ini</span>
                    <span className="font-bold">{stats.hariIni.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/50 text-xs">
                    <span className="text-slate-200">Kemarin</span>
                    <span className="font-bold">{stats.kemarin.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/50 text-xs">
                    <span className="text-slate-200">Minggu Ini</span>
                    <span className="font-bold">{stats.mingguIni.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/50 text-xs">
                    <span className="text-slate-200">Minggu Lalu</span>
                    <span className="font-bold">{stats.mingguLalu.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/50 text-xs">
                    <span className="text-slate-200">Bulan Ini</span>
                    <span className="font-bold">{stats.bulanIni.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-600/50 text-xs">
                    <span className="text-slate-200">Bulan Lalu</span>
                    <span className="font-bold">{stats.bulanLalu.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 font-bold text-emerald-300 text-xs">
                    <span>Total Kunjungan</span>
                    <span>{stats.totalKunjungan.toLocaleString("id-ID")}</span>
                  </div>

                  {/* Indikator Status Real-time Mobile */}
                  <div className="pt-2 mt-2 border-t border-slate-600/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-300 font-medium text-[10px]">
                        Statistik Kunjungan Aktif
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Update: {formatWIBTime(lastUpdated)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Accordion: Kontak Desa */}
            <div className="border-b border-emerald-900/50 pb-2">
              <button
                type="button"
                onClick={() => toggleAccordion("kontak")}
                className="w-full flex items-center justify-between py-2.5 font-bold text-white text-left active:opacity-80 cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Kontak Desa</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${
                    openAccordion === "kontak" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "kontak" && (
                <div className="mt-2 text-xs text-emerald-200/90 space-y-2.5 pl-6 animate-in fade-in duration-200">
                  <p className="leading-relaxed">
                    📍 {profil.alamat_kantor || "Jl. Bakti Mulya No. 241, Desa Bogem, Kec. Kawedanan, Kab. Magetan"}
                  </p>
                  <p>
                    📞 Telp/WA:{" "}
                    <a href={`tel:${cleanPhone}`} className="text-white underline font-semibold">
                      {rawPhone}
                    </a>
                  </p>
                  <p>
                    ✉️ Email:{" "}
                    <a href={`mailto:${profil.email_kantor || "desabogemjaya@gmail.com"}`} className="text-white underline">
                      {profil.email_kantor || "desabogemjaya@gmail.com"}
                    </a>
                  </p>
                  <p>
                    ⏰ Jam Pelayanan:{" "}
                    <span className="text-white font-medium">
                      {profil.jam_pelayanan || "Senin - Jumat 08.00 - 15.00 WIB"}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* 3. Accordion: Sosial Media */}
            <div className="border-b border-emerald-900/50 pb-2">
              <button
                type="button"
                onClick={() => toggleAccordion("sosmed")}
                className="w-full flex items-center justify-between py-2.5 font-bold text-white text-left active:opacity-80 cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Sosial Media</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${
                    openAccordion === "sosmed" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "sosmed" && (
                <div className="mt-2 text-xs text-emerald-200/90 space-y-2 pl-6 animate-in fade-in duration-200">
                  <div>Facebook: <span className="text-white font-medium">Pemerintah Desa Bogem Magetan</span></div>
                  <div>Instagram: <span className="text-white font-medium">@desabogem_magetan</span></div>
                  <div>YouTube: <span className="text-white font-medium">Desa Bogem Official</span></div>
                  <div>WhatsApp Warga: <span className="text-white font-medium">{rawPhone}</span></div>
                </div>
              )}
            </div>

            {/* 4. Accordion: Jelajahi Sesuai Konten Website */}
            <div className="border-b border-emerald-900/50 pb-2">
              <button
                type="button"
                onClick={() => toggleAccordion("jelajahi")}
                className="w-full flex items-center justify-between py-2.5 font-bold text-white text-left active:opacity-80 cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Jelajahi</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${
                    openAccordion === "jelajahi" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openAccordion === "jelajahi" && (
                <div className="mt-2 grid grid-cols-2 gap-2.5 text-xs text-emerald-200 pl-6 animate-in fade-in duration-200">
                  <Link href="/" className="hover:text-white py-1">Beranda</Link>
                  <Link href="/profil" className="hover:text-white py-1">Profil Desa</Link>
                  <Link href="/pemerintah" className="hover:text-white py-1">Pemerintah & SOTK</Link>
                  <Link href="/infografis" className="hover:text-white py-1">Infografis & IDM</Link>
                  <Link href="/berita" className="hover:text-white py-1">Kabar Berita</Link>
                  <Link href="/potensi" className="hover:text-white py-1 text-emerald-300 font-semibold">Produk UMKM</Link>
                  <Link href="/layanan-surat" className="hover:text-white py-1 text-emerald-300 font-semibold col-span-2">Layanan Surat Online</Link>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ===================== BOTTOM COPYRIGHT ===================== */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-400/80 gap-2 text-center md:text-left">
          <p>© {new Date().getFullYear()} Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan. Hak Cipta Dilindungi.</p>
          <span>Portal Pelayanan & Informasi Publik Desa Bogem</span>
        </div>

      </div>
    </footer>
  );
}
