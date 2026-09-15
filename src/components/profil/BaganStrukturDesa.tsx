"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  UserCheck,
  ZoomIn,
  Download,
  X,
  Network,
  LayoutGrid,
  ListTree,
  FileImage,
  Search,
  Users,
  Landmark,
} from "lucide-react";
import { PerangkatItem } from "@/types/perangkat";
import { fetchPerangkatList } from "@/services/perangkatService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BaganStrukturDesaProps {
  kadesName?: string;
  kadesFoto?: string;
  baganDesaImage?: string;
  baganBpdImage?: string;
}

export default function BaganStrukturDesa({
  kadesName = "TUT WARIYANI, S.KM",
  kadesFoto = "",
  baganDesaImage = "",
  baganBpdImage = "",
}: BaganStrukturDesaProps) {
  const [perangkatList, setPerangkatList] = useState<PerangkatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"tree" | "list" | "doc">("tree");
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("semua");

  useEffect(() => {
    let isMounted = true;
    fetchPerangkatList()
      .then((data) => {
        if (isMounted && data && Array.isArray(data)) {
          setPerangkatList(data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat perangkat desa:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter aparatur berdasarkan kategori SOTK dari data database panel admin
  const kadesFromList = perangkatList.find(
    (p) =>
      p.jabatan.toLowerCase().includes("kepala desa") &&
      !p.jabatan.toLowerCase().includes("dusun")
  );

  const activeKadesName = kadesFromList?.nama || kadesName || "TUT WARIYANI, S.KM";
  const activeKadesFoto = kadesFromList?.foto || kadesFoto || "";

  // 1. Sekretaris Desa (Sesuai database panel admin SOTK; jika belum terisi, berstatus 'Dalam Proses Pengisian')
  const sekdesFromList = perangkatList.find((p) => {
    const j = (p.jabatan || "").toLowerCase();
    return j.includes("sekretaris") || j.includes("sekdes");
  });

  const sekdes: PerangkatItem = sekdesFromList || {
    id: "sekdes-vacant",
    nama: "Dalam Proses Pengisian",
    jabatan: "Sekretaris Desa",
    foto: "",
    urutan: 2,
  };

  // 2. BPD (Mitra Koordinasi: SUWARNO)
  const bpdItem: PerangkatItem = perangkatList.find((p) => (p.jabatan || "").toLowerCase().includes("bpd")) || {
    id: "bpd-main",
    nama: "SUWARNO",
    jabatan: "Badan Permusyawaratan (BPD)",
    foto: "",
    urutan: 0,
  };

  // 3. Unsur Staf (Lengkap 3 Kaur: Kaur TU, Kaur Keuangan, Kaur Perencanaan)
  // DARNO murni terdaftar di database sebagai Kaur Tata Usaha & Umum
  const kaurTu = perangkatList.find((p) => p.jabatan.toLowerCase().includes("tata usaha") || p.jabatan.toLowerCase().includes("tu")) || {
    id: "k-1",
    nama: "DARNO",
    jabatan: "Kaur Tata Usaha & Umum",
    foto: "",
  };

  const kaurKeu = perangkatList.find((p) => p.jabatan.toLowerCase().includes("keuangan")) || {
    id: "k-2",
    nama: "EKO YOYOK HARIANTO",
    jabatan: "Kaur Keuangan",
    foto: "",
  };

  const kaurRen = perangkatList.find((p) => p.jabatan.toLowerCase().includes("perencanaan")) || {
    id: "k-3",
    nama: "Dalam Proses Pengisian",
    jabatan: "Kaur Perencanaan",
    foto: "",
  };

  const displayKaurs: PerangkatItem[] = [kaurTu, kaurKeu, kaurRen];

  // 4. Pelaksana Teknis (Lengkap 3 Kasi: Kasi Pemerintahan, Kasi Kesejahteraan, Kasi Pelayanan)
  const kasiPem = perangkatList.find((p) => p.jabatan.toLowerCase().includes("pemerintahan")) || {
    id: "s-1",
    nama: "YATENI",
    jabatan: "Kasi Pemerintahan",
    foto: "",
  };

  const kasiKesra = perangkatList.find((p) => p.jabatan.toLowerCase().includes("kesejahteraan") || p.jabatan.toLowerCase().includes("kesra")) || {
    id: "s-2",
    nama: "HERU PRAMONO",
    jabatan: "Kasi Kesejahteraan",
    foto: "",
  };

  const kasiPel = perangkatList.find((p) => p.jabatan.toLowerCase().includes("pelayanan")) || {
    id: "s-3",
    nama: "BUDI UTOMO",
    jabatan: "Kasi Pelayanan",
    foto: "",
  };

  const displayKasis: PerangkatItem[] = [kasiPem, kasiKesra, kasiPel];

  // 5. Pelaksana Kewilayahan (Lengkap 2 Kasun: Kasun 1 / Sumiran, Kasun 2 / Dinna Fitri)
  const kasun1 = perangkatList.find((p) => (p.jabatan.toLowerCase().includes("dusun") || p.jabatan.toLowerCase().includes("kamituwo") || p.jabatan.toLowerCase().includes("kasun")) && (p.jabatan.includes("1") || p.jabatan.toLowerCase().includes(" i") || p.nama.toUpperCase().includes("SUMIRAN"))) || {
    id: "d-1",
    nama: "SUMIRAN",
    jabatan: "Kamituwo 1 (Dusun I)",
    foto: "",
  };

  const kasun2 = perangkatList.find((p) => (p.jabatan.toLowerCase().includes("dusun") || p.jabatan.toLowerCase().includes("kamituwo") || p.jabatan.toLowerCase().includes("kasun")) && (p.jabatan.includes("2") || p.jabatan.toLowerCase().includes(" ii") || p.nama.toUpperCase().includes("DINNA"))) || {
    id: "d-2",
    nama: "DINNA FITRI N.J",
    jabatan: "Kamituwo 2 (Dusun II)",
    foto: "",
  };

  const displayKasuns: PerangkatItem[] = [kasun1, kasun2];

  // Data gabungan untuk direktori aparatur (termasuk Kepala Desa)
  const activeKadesItem: PerangkatItem = {
    id: "kades-main",
    nama: activeKadesName,
    jabatan: "Kepala Desa",
    foto: activeKadesFoto,
    urutan: 0,
  };

  const hasKadesInList = Boolean(kadesFromList);
  const directoryList = hasKadesInList ? perangkatList : [activeKadesItem, ...perangkatList];

  const filteredDirectory = directoryList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;

    const j = (item.jabatan || "").toLowerCase();
    if (filterKategori === "pimpinan") {
      return (
        (j.includes("kepala desa") && !j.includes("dusun")) ||
        j.includes("sekretaris") ||
        j.includes("sekdes")
      );
    }
    if (filterKategori === "kaur") {
      return j.includes("kaur") || j.includes("urusan");
    }
    if (filterKategori === "kasi") {
      return j.includes("kasi") || j.includes("seksi");
    }
    if (filterKategori === "kasun") {
      return j.includes("dusun") || j.includes("kasun") || j.includes("kamituwo");
    }
    return true;
  });

  const hasDocImage = Boolean(baganDesaImage || baganBpdImage);

  if (loading && perangkatList.length === 0) {
    return (
      <Card className="p-8 sm:p-12 text-center space-y-3">
        <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto border border-emerald-200/60 dark:border-emerald-800/40 animate-pulse">
          <Network className="size-6 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div className="text-xs font-semibold text-muted-foreground">
          Menghubungkan bagan struktur organisasi...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center space-x-2">
            <Network className="size-5 text-emerald-700 dark:text-emerald-400" />
            <span>Struktur Organisasi & Tata Kerja (SOTK)</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Bagan garis hierarki kepemimpinan Pemerintah Desa Bogem.
          </p>
        </div>

        {/* View Toggle Buttons - Responsif di HP & Laptop */}
        <div className="bg-muted p-1 rounded-xl border border-border inline-flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={viewMode === "tree" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("tree")}
            className="flex-1 sm:flex-initial rounded-lg text-xs font-bold gap-1.5 whitespace-nowrap"
          >
            <LayoutGrid className="size-3.5" />
            <span>Bagan Pohon</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex-1 sm:flex-initial rounded-lg text-xs font-bold gap-1.5 whitespace-nowrap"
          >
            <ListTree className="size-3.5" />
            <span>Daftar Hierarki</span>
          </Button>
          {hasDocImage && (
            <Button
              variant={viewMode === "doc" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("doc")}
              className="flex-1 sm:flex-initial rounded-lg text-xs font-bold gap-1.5 whitespace-nowrap"
            >
              <FileImage className="size-3.5" />
              <span>Dokumen Bagan</span>
            </Button>
          )}
        </div>
      </div>

      {/* VIEW 1: ORGANIZATIONAL TREE WITH CONNECTING LINES (PERSIS PAPAN SOTK BALAI DESA BOGEM) */}
      {viewMode === "tree" && (
        <div className="space-y-3">
          <Card className="p-4 sm:p-8 overflow-x-auto touch-pan-x bg-card border-border/80 shadow-xs">
            <div className="min-w-[960px] max-w-5xl mx-auto py-3">
              {/* Header Papan SOTK Resmi */}
              <div className="text-center mb-6 space-y-1">
                <div className="w-12 h-12 mx-auto mb-2 relative flex items-center justify-center">
                  <Image
                    src="/images/logo-magetan.png"
                    alt="Logo Kabupaten Magetan"
                    width={44}
                    height={44}
                    className="object-contain mx-auto"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-foreground">
                  Susunan Organisasi Tata Kerja Pemerintah Desa
                </h3>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
                  Desa Bogem Kec. Kawedanan Kab. Magetan
                </p>

                {/* Legend Garis Hierarki */}
                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-muted-foreground font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-0.5 bg-slate-400 dark:bg-slate-600" />
                    <span>Garis Komando / Instruksi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 border-t-2 border-dashed border-emerald-600 dark:border-emerald-400" />
                    <span>Garis Koordinasi (BPD)</span>
                  </div>
                </div>
              </div>

              {/* TINGKAT 1: KEPALA DESA & BPD */}
              <div className="relative flex items-center justify-center min-h-[110px]">
                {/* Node Utama: KEPALA DESA (Pusat Pimpinan di 50%) */}
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-[#063321] to-[#0A4D33] text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-emerald-800/60 flex items-center space-x-4 w-72 sm:w-80 hover:shadow-md transition-all">
                    <div className="size-14 rounded-full overflow-hidden bg-emerald-900 border-2 border-emerald-400/50 shrink-0 flex items-center justify-center relative">
                      {activeKadesFoto ? (
                        <Image
                          src={activeKadesFoto}
                          alt={activeKadesName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <UserCheck className="size-7 text-emerald-300" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                        Kepala Desa Bogem
                      </span>
                      <h3 className="text-sm font-extrabold text-white leading-tight truncate">
                        {activeKadesName}
                      </h3>
                      <span className="text-[10px] text-emerald-100/70 block truncate">
                        Pimpinan Penyelenggara Desa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Node BPD (Mitra Koordinasi di sisi kanan) */}
                <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10">
                  <div className="bg-card hover:bg-muted/50 border border-border rounded-2xl p-3.5 shadow-xs w-56 text-left transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="size-10 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center relative">
                        {bpdItem?.foto ? (
                          <Image
                            src={bpdItem.foto}
                            alt={bpdItem.nama}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <Landmark className="size-5 text-emerald-700 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                          Mitra Koordinasi
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug truncate">
                          {bpdItem?.nama || "BPD"}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-medium truncate">
                          {bpdItem?.jabatan || "Badan Permusyawaratan Desa"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Garis Horizontal Putus-Putus Koordinasi antara Kades dan BPD */}
                <div className="absolute left-[calc(50%+160px)] right-[245px] top-1/2 -translate-y-1/2 border-t-2 border-dashed border-emerald-600 dark:border-emerald-400 flex items-center justify-center">
                  <span className="bg-card px-2 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider -translate-y-1/2 whitespace-nowrap shadow-2xs rounded-full border border-emerald-300/60 dark:border-emerald-700/60">
                    Koordinasi
                  </span>
                </div>
              </div>

              {/* GARIS VERTIKAL DARI KEPALA DESA KE CROSSBAR KOMANDO */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600 relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    Garis Komando
                  </span>
                </div>
              </div>

              {/* TINGKAT 2 & 3: CROSSBAR DISTRIBUSI & 3 PILAR HIERARKI */}
              <div className="relative">
                {/* Crossbar Horizontal membentang dari pusat Pilar 1 (16.67%) ke pusat Pilar 3 (83.33%) */}
                <div className="grid grid-cols-3 gap-6 relative">
                  <div className="absolute top-0 left-[16.67%] right-[16.67%] border-t-2 border-slate-400 dark:border-slate-600" />

                  {/* Drop line dari crossbar ke Kolom 1 (Sekretariat Desa) dengan panah turun */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-600 relative">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-400 dark:border-t-slate-600" />
                    </div>
                  </div>

                  {/* Drop line dari crossbar ke Kolom 2 (Pelaksana Teknis) */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-600" />
                  </div>

                  {/* Drop line dari crossbar ke Kolom 3 (Pelaksana Kewilayahan) */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-600" />
                  </div>
                </div>

                {/* 3 PILAR STRUKTUR HIERARKI */}
                <div className="grid grid-cols-3 gap-6 pt-0">
                  
                  {/* === PILAR 1: SEKRETARIS DESA & UNSUR STAF (KAUR) === */}
                  <div className="space-y-3">
                    {/* Kartu Sekretaris Desa (Menyambung langsung ke Unsur Staf di bawahnya) */}
                    <div className="relative flex flex-col items-center">
                      <Card className="w-full h-[72px] p-3 sm:p-3.5 hover:shadow-xs transition-all flex items-center space-x-3 bg-card border-emerald-300 dark:border-emerald-700/80 shadow-2xs">
                        <div className="size-11 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center relative">
                          {sekdes?.foto ? (
                            <Image
                              src={sekdes.foto}
                              alt={sekdes.nama}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <UserCheck className="size-5 text-emerald-700 dark:text-emerald-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                            Sekretaris Desa
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {sekdes?.nama}
                          </h4>
                          <span className="text-[9.5px] text-muted-foreground block truncate">
                            {sekdesFromList ? sekdes.jabatan : "Pimpinan Kesekretariatan"}
                          </span>
                        </div>
                      </Card>

                      {/* Garis Vertikal Turun dari Sekdes ke Unsur Staf */}
                      <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-600 relative">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-400 dark:border-t-slate-600" />
                      </div>
                    </div>

                    {/* Header Unsur Staf */}
                    <div className="bg-muted text-foreground text-center py-2 px-3 rounded-xl border border-border">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                        Unsur Staf (Kaur)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Membantu Pelayanan Administrasi Sekretaris Desa
                      </span>
                    </div>

                    {/* Daftar 3 Kaur */}
                    <div className="relative pl-3 space-y-3 border-l-2 border-slate-400 dark:border-slate-600 ml-4">
                      {displayKaurs.map((kaur) => (
                        <div key={kaur.id} className="relative group">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-400 dark:bg-slate-600" />
                          <Card className="p-3 hover:shadow-xs transition-all flex items-center space-x-3 bg-card border-border/80">
                            <div className="size-10 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center relative">
                              {kaur.foto ? (
                                <Image
                                  src={kaur.foto}
                                  alt={kaur.nama}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <UserCheck className="size-5 text-muted-foreground/60" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block truncate">
                                {kaur.jabatan}
                              </span>
                              <h5 className="text-xs font-bold text-foreground truncate">
                                {kaur.nama}
                              </h5>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* === PILAR 2: PELAKSANA TEKNIS (KASI) === */}
                  <div className="space-y-3">
                    {/* Garis Komando Langsung dari Kepala Desa ke Pelaksana Teknis (Sejajar dengan tinggi Sekdes) */}
                    <div className="h-[96px] flex flex-col items-center justify-center relative">
                      <div className="w-0.5 h-full bg-slate-400 dark:bg-slate-600 relative">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-400 dark:border-t-slate-600" />
                      </div>
                      <span className="absolute bg-card px-2 py-0.5 text-[8.5px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider rounded-full border border-emerald-300/70 dark:border-emerald-700/70 shadow-2xs whitespace-nowrap">
                        Komando Langsung
                      </span>
                    </div>

                    {/* Header Pelaksana Teknis */}
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 text-center py-2 px-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                        Pelaksana Teknis (Kasi)
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                        Kepala Seksi (Komando Langsung Kades)
                      </span>
                    </div>

                    {/* Daftar 3 Kasi */}
                    <div className="relative pl-3 space-y-3 border-l-2 border-slate-400 dark:border-slate-600 ml-4">
                      {displayKasis.map((kasi) => (
                        <div key={kasi.id} className="relative group">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-400 dark:bg-slate-600" />
                          <Card className="p-3 hover:shadow-xs transition-all flex items-center space-x-3 bg-card border-border/80">
                            <div className="size-10 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center relative">
                              {kasi.foto ? (
                                <Image
                                  src={kasi.foto}
                                  alt={kasi.nama}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <UserCheck className="size-5 text-emerald-700 dark:text-emerald-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block truncate">
                                {kasi.jabatan}
                              </span>
                              <h5 className="text-xs font-bold text-foreground truncate">
                                {kasi.nama}
                              </h5>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* === PILAR 3: PELAKSANA KEWILAYAHAN (KASUN / KAMITUWO) === */}
                  <div className="space-y-3">
                    {/* Garis Komando Langsung dari Kepala Desa ke Pelaksana Kewilayahan (Sejajar dengan tinggi Sekdes) */}
                    <div className="h-[96px] flex flex-col items-center justify-center relative">
                      <div className="w-0.5 h-full bg-slate-400 dark:bg-slate-600 relative">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-slate-400 dark:border-t-slate-600" />
                      </div>
                      <span className="absolute bg-card px-2 py-0.5 text-[8.5px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider rounded-full border border-emerald-300/70 dark:border-emerald-700/70 shadow-2xs whitespace-nowrap">
                        Komando Langsung
                      </span>
                    </div>

                    {/* Header Pelaksana Kewilayahan */}
                    <div className="bg-muted text-foreground text-center py-2 px-3 rounded-xl border border-border">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                        Pelaksana Kewilayahan (Kasun)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Kamituwo / Kepala Dusun (Komando Langsung Kades)
                      </span>
                    </div>

                    {/* Daftar Kasun */}
                    <div className="relative pl-3 space-y-3 border-l-2 border-slate-400 dark:border-slate-600 ml-4">
                      {displayKasuns.map((kasun, idx) => (
                        <div key={kasun.id} className="relative group">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-400 dark:bg-slate-600" />
                          <Card className="p-3 hover:shadow-xs transition-all flex items-center space-x-3 bg-card border-border/80">
                            <div className="size-10 rounded-full overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center relative">
                              {kasun.foto ? (
                                <Image
                                  src={kasun.foto}
                                  alt={kasun.nama}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <UserCheck className="size-5 text-emerald-700 dark:text-emerald-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block truncate">
                                {kasun.jabatan || `Kasun ${idx + 1}`}
                              </span>
                              <h5 className="text-xs font-bold text-foreground truncate">
                                {kasun.nama}
                              </h5>
                              <span className="text-[9px] text-muted-foreground block truncate">
                                Wilayah Dusun {idx === 0 ? "I" : "II"}
                              </span>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </Card>
        </div>
      )}

      {/* VIEW 2: DIRECTORY LIST HIERARCHY (UNTUK MOBILE) */}
      {viewMode === "list" && (
        <Card className="p-5 sm:p-7 space-y-4 bg-card">
          {/* 1. Pimpinan Tertinggi & Mitra Konsultasi */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              1. Pimpinan Pemerintah Desa & Badan Permusyawaratan
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kades */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 rounded-2xl p-3.5 flex items-center space-x-3">
                <div className="size-11 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900 shrink-0 relative flex items-center justify-center">
                  {activeKadesFoto ? (
                    <Image src={activeKadesFoto} alt={activeKadesName} fill sizes="44px" className="object-cover" />
                  ) : (
                    <UserCheck className="size-6 text-emerald-700 dark:text-emerald-300" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">Kepala Desa Bogem</span>
                  <h4 className="text-sm font-extrabold text-foreground">{activeKadesName}</h4>
                </div>
              </div>

              {/* BPD */}
              <div className="bg-muted/40 border border-border rounded-2xl p-3.5 flex items-center space-x-3">
                <div className="size-11 rounded-full overflow-hidden bg-muted border border-border shrink-0 relative flex items-center justify-center">
                  {bpdItem?.foto ? (
                    <Image src={bpdItem.foto} alt={bpdItem.nama} fill sizes="44px" className="object-cover" />
                  ) : (
                    <Landmark className="size-5 text-emerald-700 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Mitra Koordinasi (BPD)</span>
                  <h4 className="text-sm font-extrabold text-foreground">{bpdItem?.nama || "Badan Permusyawaratan Desa (BPD)"}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sekretariat Desa */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              2. Unsur Staf Kesekretariatan (Membantu Sekretaris Desa)
            </span>
            
            <div className="border-l-2 border-border ml-4 pl-4 space-y-2.5">
              {/* Sekdes */}
              <div className="bg-muted/50 border border-border rounded-xl p-3 flex items-center space-x-3">
                <div className="size-9 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center relative">
                  {sekdes?.foto ? (
                    <Image src={sekdes.foto} alt={sekdes.nama} fill sizes="36px" className="object-cover" />
                  ) : (
                    <UserCheck className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase block">
                    {sekdes?.jabatan || "Sekretaris Desa"}
                  </span>
                  <h5 className="text-xs font-bold text-foreground">{sekdes?.nama}</h5>
                </div>
              </div>

              {/* Kaurs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {displayKaurs.map((kaur) => (
                  <div key={kaur.id} className="bg-card border border-border/80 rounded-xl p-2.5 flex items-center space-x-3">
                    <div className="size-8 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center relative">
                      {kaur.foto ? (
                        <Image src={kaur.foto} alt={kaur.nama} fill sizes="32px" className="object-cover" />
                      ) : (
                        <UserCheck className="size-4 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase block truncate">{kaur.jabatan}</span>
                      <h5 className="text-xs font-bold text-foreground truncate">{kaur.nama}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Pelaksana Teknis */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              3. Unsur Pelaksana Teknis (Kepala Seksi - Langsung Di Bawah Kades)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {displayKasis.map((kasi) => (
                <div key={kasi.id} className="bg-card border border-border/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="size-9 rounded-full overflow-hidden bg-emerald-50 dark:bg-emerald-950/50 shrink-0 flex items-center justify-center relative">
                    {kasi.foto ? (
                      <Image src={kasi.foto} alt={kasi.nama} fill sizes="36px" className="object-cover" />
                    ) : (
                      <UserCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase block truncate">{kasi.jabatan}</span>
                    <h5 className="text-xs font-bold text-foreground truncate">{kasi.nama}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Pelaksana Kewilayahan */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              4. Unsur Pelaksana Kewilayahan (Kepala Dusun - Langsung Di Bawah Kades)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayKasuns.map((kasun) => (
                <div key={kasun.id} className="bg-card border border-border/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="size-9 rounded-full overflow-hidden bg-muted shrink-0 flex items-center justify-center relative">
                    {kasun.foto ? (
                      <Image src={kasun.foto} alt={kasun.nama} fill sizes="36px" className="object-cover" />
                    ) : (
                      <UserCheck className="size-4 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase block truncate">{kasun.jabatan}</span>
                    <h5 className="text-xs font-bold text-foreground truncate">{kasun.nama}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* VIEW 3: DOKUMEN BAGAN ASLI */}
      {viewMode === "doc" && hasDocImage && (
        <Card className="p-5 sm:p-7 space-y-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {baganDesaImage && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Bagan Dokumen SOTK Pemerintah Desa
                </h4>
                <div
                  onClick={() => setZoomImage({ src: baganDesaImage, title: "Dokumen Bagan SOTK Desa" })}
                  className="relative rounded-2xl overflow-hidden border border-border bg-muted/40 cursor-pointer group flex items-center justify-center p-2 min-h-48"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={baganDesaImage}
                      alt="Bagan SOTK Desa"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white font-bold text-xs">
                    <ZoomIn className="size-4" />
                    <span>Perbesar</span>
                  </div>
                </div>
              </div>
            )}

            {baganBpdImage && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Bagan Dokumen BPD Desa
                </h4>
                <div
                  onClick={() => setZoomImage({ src: baganBpdImage, title: "Dokumen Bagan BPD Desa" })}
                  className="relative rounded-2xl overflow-hidden border border-border bg-muted/40 cursor-pointer group flex items-center justify-center p-2 min-h-48"
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={baganBpdImage}
                      alt="Bagan BPD Desa"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white font-bold text-xs">
                    <ZoomIn className="size-4" />
                    <span>Perbesar</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* DIREKTORI LENGKAP APARATUR DESA */}
      <Card id="direktori-aparatur" className="p-5 sm:p-8 space-y-5 sm:space-y-6 bg-card">
        {/* Header Direktori */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight flex items-center space-x-2">
              <Users className="size-5 text-emerald-700 dark:text-emerald-400" />
              <span>Direktori Lengkap Aparatur Desa</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pejabat dan staf penyelenggara pemerintahan & pelayanan masyarakat Desa Bogem.
            </p>
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {directoryList.length} Personel Aktif
          </Badge>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills using shadcn Button */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "semua", label: "Semua" },
              { id: "pimpinan", label: "Pimpinan" },
              { id: "kaur", label: "Kaur" },
              { id: "kasi", label: "Kasi" },
              { id: "kasun", label: "Kamituwo" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={filterKategori === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterKategori(tab.id)}
                className={`rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                  filterKategori === tab.id
                    ? "bg-[#063321] text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search Input using shadcn Input */}
          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari nama atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs bg-muted/30 h-9 rounded-xl"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredDirectory.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs space-y-1">
            <Users className="size-8 text-muted-foreground/40 mx-auto" />
            <p className="font-semibold text-foreground">Tidak ada aparatur yang sesuai</p>
            <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter kategori di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredDirectory.map((p) => {
              const isKades =
                p.jabatan.toLowerCase().includes("kepala desa") &&
                !p.jabatan.toLowerCase().includes("dusun");
              const isSekdes =
                p.jabatan.toLowerCase().includes("sekretaris") ||
                p.jabatan.toLowerCase().includes("sekdes");

              return (
                <Card
                  key={p.id}
                  className={`p-3 transition-all duration-200 flex flex-col justify-between space-y-2.5 group hover:shadow-md bg-card ${
                    isKades
                      ? "border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-500/20"
                      : isSekdes
                      ? "border-emerald-200 dark:border-emerald-800"
                      : "border-border/80 hover:border-border"
                  }`}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted border border-border/80 flex items-center justify-center">
                    {p.foto ? (
                      <Image
                        src={p.foto}
                        alt={p.nama}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <UserCheck className="size-10 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <Badge
                      variant={isKades ? "default" : "secondary"}
                      className={`text-[9px] sm:text-[10px] font-bold truncate max-w-full ${
                        isKades
                          ? "bg-[#063321] text-white"
                          : isSekdes
                          ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200"
                          : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {p.jabatan}
                    </Badge>
                    <h4 className="text-xs font-bold text-foreground line-clamp-1 leading-snug">
                      {p.nama}
                    </h4>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* LIGHTBOX MODAL PERBESAR GAMBAR */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs p-4 sm:p-8 flex items-center justify-center animate-in fade-in duration-200">
          <Card className="max-w-4xl w-full p-4 sm:p-6 shadow-2xl border-border flex flex-col max-h-[90vh] bg-card">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <h3 className="text-sm font-bold text-foreground">{zoomImage.title}</h3>
              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl gap-1.5"
                >
                  <a href={zoomImage.src} download="Bagan_Desa.png">
                    <Download className="size-3.5" />
                    <span>Unduh</span>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setZoomImage(null)}
                  className="rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>
            <div className="overflow-auto flex-grow flex items-center justify-center bg-muted/40 rounded-2xl p-2 relative min-h-[50vh]">
              <Image
                src={zoomImage.src}
                alt={zoomImage.title}
                fill
                sizes="80vw"
                className="object-contain rounded-xl"
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
