"use client";

import { useEffect, useState } from "react";
import { Navigation, ExternalLink, Building2, Phone } from "lucide-react";
import VillageMap from "@/components/VillageMap";
import { fetchProfilDesa, defaultProfilDesa, defaultBatasWilayah } from "@/services/profilService";
import { ProfilDesaData } from "@/types/profil";
import { BOGEM_LOCATION } from "@/data/bogemGeoJson";

export default function PetaSection() {
  const [profil, setProfil] = useState<ProfilDesaData>(defaultProfilDesa);

  useEffect(() => {
    fetchProfilDesa().then((data) => {
      if (data) setProfil(data);
    }).catch(() => {});
  }, []);

  const batas = profil.batas_wilayah || defaultBatasWilayah;
  const rawPhone = profil.telepon_kantor || "+62 812-3456-7890";
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");

  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Bogem+Kawedanan+Magetan";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
      <div className="space-y-4 sm:space-y-6">
        
        {/* Title Section Sesuai Lampiran 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004329] tracking-tight">
              Peta Lokasi Desa
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Wilayah administratif dan batas wilayah Desa Bogem, Kec. Kawedanan, Kab. Magetan
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-[#004329] hover:bg-[#00321F] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-300" />
            <span>Petunjuk Arah Google Maps</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
        </div>

        {/* Layout 2 Kolom Sesuai Lampiran 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Kolom Kiri: Detail Batas Wilayah & Info Statistik Sesuai Lampiran 3 */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Batas Desa */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-3">
                  Batas Desa:
                </h3>
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Utara</span>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {batas.utara || BOGEM_LOCATION.batas.utara}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Timur</span>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {batas.timur || BOGEM_LOCATION.batas.timur}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Selatan</span>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {batas.selatan || BOGEM_LOCATION.batas.selatan}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Barat</span>
                    <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                      {batas.barat || BOGEM_LOCATION.batas.barat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Garis Pembatas */}
              <div className="border-t border-slate-100" />

              {/* Luas Desa */}
              <div className="flex items-center justify-between text-xs sm:text-sm py-1">
                <span className="font-bold text-slate-900">Luas Desa:</span>
                <span className="font-extrabold text-[#004329] text-sm sm:text-base">
                  {profil.luas_wilayah || BOGEM_LOCATION.luasWilayah} ({BOGEM_LOCATION.luasMeterPersegi})
                </span>
              </div>

              {/* Garis Pembatas */}
              <div className="border-t border-slate-100" />

              {/* Jumlah Penduduk */}
              <div className="flex items-center justify-between text-xs sm:text-sm py-1">
                <span className="font-bold text-slate-900">Jumlah Penduduk</span>
                <span className="font-extrabold text-[#004329] text-sm sm:text-base">
                  {profil.jumlah_penduduk || BOGEM_LOCATION.jumlahPenduduk}
                </span>
              </div>

            </div>

            {/* Info Alamat Kantor Desa di Bawah */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100/90 text-xs space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                <Building2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Pusat Pemerintahan: Kantor Desa Bogem</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pl-6">
                {profil.alamat_kantor || "Jl. Bakti Mulya No. 241, Desa Bogem, Kec. Kawedanan, Kab. Magetan, Jawa Timur 63382"}
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-slate-700 pl-6 pt-0.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>Kontak Layanan:</span>
                <a href={`tel:${cleanPhone}`} className="font-semibold text-emerald-900 hover:underline">
                  {rawPhone}
                </a>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Peta Interaktif dengan Highlight Polygon & Animasi Zoom Sesuai Lampiran 3 */}
          <div className="lg:col-span-7 flex">
            <VillageMap />
          </div>

        </div>

      </div>
    </section>
  );
}
