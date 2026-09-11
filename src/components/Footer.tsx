"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { fetchProfilDesa, defaultProfilDesa } from "@/services/profilService";
import { recordWebsiteVisit, VisitorStats } from "@/services/visitorService";
import { ProfilDesaData } from "@/types/profil";
import { Separator } from "@/components/ui/separator";

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

  // State untuk accordion di tampilan mobile (default tertutup semua, baru terbuka saat diklik)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Initial fetch profil desa & pencatatan kunjungan saat mount
  useEffect(() => {
    fetchProfilDesa()
      .then((data) => {
        if (data) setProfil(data);
      })
      .catch(() => {});

    recordWebsiteVisit().then((realStats) => {
      if (realStats) {
        setStats(realStats);
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

  return (
    <footer className="bg-[#05281a] text-emerald-100/90 border-t border-emerald-900/60 pb-28 md:pb-8 pt-8 sm:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================== TAMPILAN LAPTOP & DESKTOP (>= md) ===================== */}
        <div className="hidden md:grid grid-cols-4 gap-8 mb-10 items-start">
          {/* Kolom 1: Info Identitas Desa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-11 h-14 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo-magetan.png"
                  alt="Logo Kabupaten Magetan"
                  width={44}
                  height={56}
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
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {profil.alamat_kantor || "Jl. Bakti Mulya No. 241, Desa Bogem, Kec. Kawedanan, Kab. Magetan"}
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition">
                  {rawPhone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${profil.email_kantor || "desabogemjaya@gmail.com"}`} className="hover:text-white transition">
                  {profil.email_kantor || "desabogemjaya@gmail.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Jam Pelayanan */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
              Jam Pelayanan Kantor
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-200/90">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
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

          {/* Kolom 4: Kunjungan Website */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
                Kunjungan Website
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
              <div>
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Hari Ini</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.hariIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Kemarin</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.kemarin.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Minggu Ini</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.mingguIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Minggu Lalu</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.mingguLalu.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Bulan Ini</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.bulanIni.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Bulan Lalu</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.bulanLalu.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Total Kunjungan</div>
                <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {stats.totalKunjungan.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== TAMPILAN MOBILE (< md) ACCORDION ===================== */}
        <div className="md:hidden space-y-4 mb-8">
          {/* Header Mobile */}
          <div className="flex items-center space-x-3 pb-3 border-b border-emerald-900/60">
            <div className="w-12 h-14 shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo-magetan.png"
                alt="Logo Kabupaten Magetan"
                width={48}
                height={56}
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

          {/* List Accordion Mobile */}
          <div className="space-y-2 text-sm">
            {/* 1. Accordion: Kunjungan Website */}
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
                <div className="pt-3 pb-3 px-1 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Hari Ini</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.hariIni.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Kemarin</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.kemarin.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Minggu Ini</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.mingguIni.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Minggu Lalu</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.mingguLalu.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Bulan Ini</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.bulanIni.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Bulan Lalu</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.bulanLalu.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs sm:text-sm font-medium text-emerald-100/90">Total Kunjungan</div>
                      <div className="text-2xl font-bold text-white tracking-tight mt-0.5">
                        {stats.totalKunjungan.toLocaleString("id-ID")}
                      </div>
                    </div>
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

            {/* 4. Accordion: Jelajahi */}
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
                  <Link href="/profil?tab=bagan" className="hover:text-white py-1">Pemerintah & SOTK</Link>
                  <Link href="/infografis" className="hover:text-white py-1">Infografis & IDM</Link>
                  <Link href="/berita" className="hover:text-white py-1">Kabar Berita</Link>
                  <Link href="/potensi" className="hover:text-white py-1 text-emerald-300 font-semibold">Produk UMKM</Link>
                  <Link href="/layanan-surat" className="hover:text-white py-1 text-emerald-300 font-semibold col-span-2">Layanan Surat Online</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <Separator className="bg-emerald-900/60 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-emerald-400/80 gap-2 text-center md:text-left">
          <p>© {new Date().getFullYear()} Pemerintah Desa Bogem, Kec. Kawedanan, Kab. Magetan. Hak Cipta Dilindungi.</p>
          <span>Portal Pelayanan & Informasi Publik Desa Bogem</span>
        </div>
      </div>
    </footer>
  );
}
