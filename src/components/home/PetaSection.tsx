"use client";

import { useEffect, useState } from "react";
import { Navigation, ExternalLink, Building2, Phone } from "lucide-react";
import VillageMap from "@/components/VillageMap";
import { fetchProfilDesa, defaultProfilDesa, defaultBatasWilayah } from "@/services/profilService";
import { ProfilDesaData } from "@/types/profil";
import { BOGEM_LOCATION } from "@/data/bogemGeoJson";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PetaSection() {
  const [profil, setProfil] = useState<ProfilDesaData>(defaultProfilDesa);

  useEffect(() => {
    fetchProfilDesa()
      .then((data) => {
        if (data) setProfil(data);
      })
      .catch(() => {});
  }, []);

  const batas = profil.batas_wilayah || defaultBatasWilayah;
  const rawPhone = profil.telepon_kantor || "0851-3655-8975";
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, "");

  const formatLuas = (val?: string) => {
    if (!val) return "101,03 Ha";
    const clean = val.replace("Ha", "").trim().replace(",", ".");
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      return `${num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ha`;
    }
    return val;
  };

  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Bogem+Kawedanan+Magetan";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#004329] dark:text-emerald-400 tracking-tight">
              Peta Lokasi Desa
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Wilayah administratif dan batas teritorial Desa Bogem, Kec. Kawedanan, Kab. Magetan.
            </p>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-[#063321] hover:bg-[#083E28] text-white font-bold text-xs rounded-xl gap-2 shadow-xs self-start sm:self-auto"
          >
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="size-3.5 text-emerald-300" />
              <span>Petunjuk Arah Google Maps</span>
              <ExternalLink className="size-3 opacity-70" />
            </a>
          </Button>
        </div>

        {/* Layout 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Kolom Kiri: Detail Wilayah Ringkas */}
          <Card className="lg:col-span-5 p-5 sm:p-7 shadow-xs border-border/80 flex flex-col justify-between space-y-5 bg-card">
            <div className="space-y-4">
              {/* Batas Desa - 4 Grid Box Rapi */}
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
                  Batas Wilayah Administratif
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/40 rounded-xl p-2.5 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Utara</span>
                    <span className="font-bold text-foreground leading-snug block mt-0.5">
                      {batas.utara || BOGEM_LOCATION.batas.utara}
                    </span>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-2.5 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Timur</span>
                    <span className="font-bold text-foreground leading-snug block mt-0.5">
                      {batas.timur || BOGEM_LOCATION.batas.timur}
                    </span>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-2.5 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Selatan</span>
                    <span className="font-bold text-foreground leading-snug block mt-0.5">
                      {batas.selatan || BOGEM_LOCATION.batas.selatan}
                    </span>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-2.5 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Barat</span>
                    <span className="font-bold text-foreground leading-snug block mt-0.5">
                      {batas.barat || BOGEM_LOCATION.batas.barat}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2 Kartu Metrik */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-muted/40 rounded-2xl p-3 sm:p-3.5 border border-border/60">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Luas Wilayah</span>
                  <div className="text-base sm:text-lg font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight mt-0.5">
                    {formatLuas(profil.luas_wilayah || BOGEM_LOCATION.luasWilayah)}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">1.010.300 m²</span>
                </div>

                <div className="bg-muted/40 rounded-2xl p-3 sm:p-3.5 border border-border/60">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Jumlah Penduduk</span>
                  <div className="text-base sm:text-lg font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight mt-0.5">
                    {profil.jumlah_penduduk || BOGEM_LOCATION.jumlahPenduduk}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">Jiwa Terdaftar</span>
                </div>
              </div>
            </div>

            {/* Info Kantor Desa */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-100/80 dark:border-emerald-800/50 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-emerald-950 dark:text-emerald-300 font-bold">
                <Building2 className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Pusat Pemerintahan: Kantor Desa Bogem</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed pl-6">
                {profil.alamat_kantor || "Jl. Bakti Mulya No. 241, Desa Bogem, Kec. Kawedanan, Kab. Magetan"}
              </p>
              {rawPhone && (
                <div className="flex items-center space-x-2 text-[11px] text-foreground/80 pl-6 pt-0.5">
                  <Phone className="size-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>Kontak Layanan:</span>
                  <a href={`tel:${cleanPhone}`} className="font-bold text-emerald-900 dark:text-emerald-300 hover:underline">
                    {rawPhone}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Kolom Kanan: Peta Interaktif Satelit */}
          <div className="lg:col-span-7 flex">
            <VillageMap />
          </div>
        </div>
      </div>
    </section>
  );
}
