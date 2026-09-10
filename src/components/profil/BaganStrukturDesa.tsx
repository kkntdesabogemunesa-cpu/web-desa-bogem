"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { PerangkatItem } from "@/types/perangkat";
import { fetchPerangkatList } from "@/services/perangkatService";

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
    async function loadPerangkat() {
      try {
        const data = await fetchPerangkatList();
        if (data && Array.isArray(data)) {
          setPerangkatList(data);
        }
      } catch (err) {
        console.error("Gagal memuat perangkat desa:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPerangkat();
  }, []);

  // Filter aparatur berdasarkan kategori SOTK - otomatis mendeteksi Sekretaris Desa
  const sekdes = perangkatList.find((p) => {
    const j = (p.jabatan || "").toLowerCase();
    return j.includes("sekretaris") || j.includes("sekdes");
  });

  const kaurList = perangkatList.filter(
    (p) =>
      p.jabatan.toLowerCase().includes("kaur") ||
      p.jabatan.toLowerCase().includes("urusan")
  );

  const kasiList = perangkatList.filter(
    (p) =>
      p.jabatan.toLowerCase().includes("kasi") ||
      p.jabatan.toLowerCase().includes("seksi")
  );

  const kasunList = perangkatList.filter(
    (p) =>
      p.jabatan.toLowerCase().includes("kamituwo") ||
      p.jabatan.toLowerCase().includes("kasun") ||
      p.jabatan.toLowerCase().includes("dusun")
  );

  // Fallback data jika belum lengkap di database
  const displayKaurs = kaurList.length > 0 ? kaurList : [
    { id: "k-1", nama: "DARNO", jabatan: "Kaur Tata Usaha & Umum", foto: "" },
    { id: "k-2", nama: "EKO YOYOK HARIANTO", jabatan: "Kaur Keuangan", foto: "" },
    { id: "k-3", nama: "Dalam Proses Pengisian", jabatan: "Kaur Perencanaan", foto: "" },
  ];

  const displayKasis = kasiList.length > 0 ? kasiList : [
    { id: "s-1", nama: "YATENI", jabatan: "Kasi Pemerintahan", foto: "" },
    { id: "s-2", nama: "HERU PRAMONO", jabatan: "Kasi Kesejahteraan", foto: "" },
    { id: "s-3", nama: "BUDI UTOMO", jabatan: "Kasi Pelayanan", foto: "" },
  ];

  const displayKasuns = kasunList.length > 0 ? kasunList : [
    { id: "d-1", nama: "SUMIRAN", jabatan: "Kamituwo 1", foto: "" },
    { id: "d-2", nama: "DINNA FITRI N.J", jabatan: "Kamituwo 2", foto: "" },
  ];

  // Data gabungan untuk direktori aparatur (termasuk Kepala Desa)
  const kadesItem: PerangkatItem = {
    id: "kades-main",
    nama: kadesName,
    jabatan: "Kepala Desa",
    foto: kadesFoto,
    urutan: 0,
  };

  const hasKadesInList = perangkatList.some(
    (p) =>
      p.jabatan.toLowerCase().includes("kepala desa") &&
      !p.jabatan.toLowerCase().includes("dusun")
  );

  const directoryList = hasKadesInList ? perangkatList : [kadesItem, ...perangkatList];

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
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-100 animate-pulse">
          <Network className="w-6 h-6 text-emerald-700" />
        </div>
        <div className="text-xs font-semibold text-slate-600">
          Menghubungkan bagan struktur organisasi...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Network className="w-5 h-5 text-emerald-700" />
            <span>Struktur Organisasi & Tata Kerja (SOTK)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bagan garis hierarki kepemimpinan Pemerintah Desa Bogem.
          </p>
        </div>

        {/* View Toggle Buttons - Responsif di HP & Laptop */}
        <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 inline-flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setViewMode("tree")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              viewMode === "tree"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Bagan Pohon</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Daftar Hierarki</span>
          </button>
          {hasDocImage && (
            <button
              onClick={() => setViewMode("doc")}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 whitespace-nowrap ${
                viewMode === "doc"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>Dokumen Bagan</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: ORGANIZATIONAL TREE WITH CONNECTING LINES */}
      {viewMode === "tree" && (
        <div className="space-y-3">
          {/* Petunjuk Geser Khusus HP agar user tahu bagan bisa digeser */}
          <div className="sm:hidden flex items-center justify-between bg-emerald-50/90 text-emerald-900 border border-emerald-200/80 px-3.5 py-2 rounded-2xl text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span>👉</span>
              <span>Geser ke samping untuk bagan penuh</span>
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-lg font-bold">
              Geser Horisontal
            </span>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-8 overflow-x-auto touch-pan-x">
            <div className="min-w-[920px] max-w-5xl mx-auto py-2">
              
              {/* TINGKAT 1: KEPALA DESA & BPD (DENGAN GARIS KOORDINASI PRESISI TANPA OVERLAP) */}
              <div className="relative flex items-center justify-center min-h-[110px]">
                {/* Node BPD (Mitra Konsultasi) di sisi kiri */}
                <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-10">
                  <div className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl p-3.5 shadow-xs w-52 text-left transition-all">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Mitra Kemitraan
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                      BPD
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Badan Permusyawaratan Desa
                    </p>
                  </div>
                </div>

                {/* Garis Horizontal Putus-Putus Koordinasi antara Kades dan BPD (Tidak menabrak kartu) */}
                <div className="absolute left-[232px] right-[calc(50%+145px)] top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-300 flex items-center justify-center">
                  <span className="bg-white px-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider -translate-y-1/2 whitespace-nowrap">
                    Koordinasi
                  </span>
                </div>

                {/* Node Utama: KEPALA DESA (Pusat Pimpinan) */}
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-[#063321] to-[#0A4D33] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-emerald-800/60 flex items-center space-x-4 w-72 sm:w-80 hover:shadow-md transition-all">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-900 border-2 border-emerald-400/50 flex-shrink-0 flex items-center justify-center">
                      {kadesFoto ? (
                        <img
                          src={kadesFoto}
                          alt={kadesName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCheck className="w-7 h-7 text-emerald-300" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                        Kepala Desa
                      </span>
                      <h3 className="text-sm font-extrabold text-white leading-tight truncate">
                        {kadesName}
                      </h3>
                      <span className="text-[10px] text-emerald-100/70 block">
                        Pimpinan Penyelenggara Desa
                      </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GARIS VERTIKAL DARI KADES KE SEKDES */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-10 bg-slate-300 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Komando
                </span>
              </div>
            </div>

            {/* TINGKAT 2: SEKRETARIS DESA */}
            <div className="flex justify-center">
              <div className="bg-white hover:bg-emerald-50/40 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex items-center space-x-3.5 w-72 transition-all">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  {sekdes?.foto ? (
                    <img
                      src={sekdes.foto}
                      alt={sekdes.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-6 h-6 text-emerald-700" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Sekretaris Desa
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {sekdes?.nama || "Sekretariat Desa"}
                  </h4>
                  <span className="text-[10px] text-slate-500 block">
                    Pimpinan Kesekretariatan
                  </span>
                </div>
              </div>
            </div>

            {/* GARIS VERTIKAL DARI SEKDES KE CROSSBAR */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-slate-300" />
            </div>

            {/* GARIS HORIZONTAL DISTRIBUSI (CROSSBAR 3 PILAR) */}
            <div className="relative px-12 sm:px-16">
              {/* Garis Horizontal penghubung 3 pilar */}
              <div className="border-t-2 border-slate-300 w-full" />

              {/* Titik sambung vertikal ke masing-masing pilar */}
              <div className="grid grid-cols-3 gap-6">
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-slate-300" />
                </div>
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-slate-300" />
                </div>
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-slate-300" />
                </div>
              </div>
            </div>

            {/* TINGKAT 3: 3 PILAR (SEKRETARIAT, TEKNIS, KEWILAYAHAN) */}
            <div className="grid grid-cols-3 gap-6 pt-1">
              
              {/* PILAR 1: KEPALA URUSAN (KAUR) */}
              <div className="space-y-3">
                <div className="bg-slate-100/90 text-slate-800 text-center py-2 px-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                    Unsur Staf (Kaur)
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Membantu Sekretaris Desa
                  </span>
                </div>

                {/* Daftar Kaur dengan Garis Cabang Vertikal */}
                <div className="relative pl-3 space-y-3 border-l-2 border-slate-200 ml-4">
                  {displayKaurs.map((kaur) => (
                    <div key={kaur.id} className="relative group">
                      {/* Cabang Garis Horizontal Menusuk ke Kartu */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-300" />

                      <div className="bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {kaur.foto ? (
                            <img
                              src={kaur.foto}
                              alt={kaur.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCheck className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                            {kaur.jabatan}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {kaur.nama}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PILAR 2: KEPALA SEKSI (KASI) */}
              <div className="space-y-3">
                <div className="bg-emerald-50/80 text-emerald-950 text-center py-2 px-3 rounded-xl border border-emerald-200/80">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                    Pelaksana Teknis (Kasi)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Operasional Kebijakan Desa
                  </span>
                </div>

                {/* Daftar Kasi dengan Garis Cabang Vertikal */}
                <div className="relative pl-3 space-y-3 border-l-2 border-slate-200 ml-4">
                  {displayKasis.map((kasi) => (
                    <div key={kasi.id} className="relative group">
                      {/* Cabang Garis Horizontal Menusuk ke Kartu */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-300" />

                      <div className="bg-white hover:bg-emerald-50/40 border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {kasi.foto ? (
                            <img
                              src={kasi.foto}
                              alt={kasi.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCheck className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                            {kasi.jabatan}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {kasi.nama}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PILAR 3: PELAKSANA KEWILAYAHAN (KAMITUWO / KASUN) */}
              <div className="space-y-3">
                <div className="bg-slate-100/90 text-slate-800 text-center py-2 px-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider block">
                    Pelaksana Kewilayahan
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Kepala Dusun / Kamituwo
                  </span>
                </div>

                {/* Daftar Kamituwo dengan Garis Cabang Vertikal */}
                <div className="relative pl-3 space-y-3 border-l-2 border-slate-200 ml-4">
                  {displayKasuns.map((kasun) => (
                    <div key={kasun.id} className="relative group">
                      {/* Cabang Garis Horizontal Menusuk ke Kartu */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-slate-300" />

                      <div className="bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {kasun.foto ? (
                            <img
                              src={kasun.foto}
                              alt={kasun.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCheck className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                            {kasun.jabatan}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {kasun.nama}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      )}

      {/* VIEW 2: DIRECTORY LIST HIERARCHY (SEMPURNA UNTUK MOBILE) */}
      {viewMode === "list" && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          
          {/* 1. Pimpinan Tertinggi */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1. Pimpinan Pemerintah Desa
            </span>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0">
                  {kadesFoto ? (
                    <img src={kadesFoto} alt={kadesName} className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="w-6 h-6 text-emerald-700 m-auto mt-2" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Kepala Desa</span>
                  <h4 className="text-sm font-extrabold text-slate-900">{kadesName}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sekretariat Desa */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              2. Kesekretariatan & Staf Urusan
            </span>
            
            <div className="border-l-2 border-slate-200 ml-4 pl-4 space-y-2.5">
              {/* Sekdes */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center">
                  {sekdes?.foto ? (
                    <img src={sekdes.foto} alt={sekdes.nama} className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Sekretaris Desa</span>
                  <h5 className="text-xs font-bold text-slate-800">{sekdes?.nama || "Sekretariat Desa"}</h5>
                </div>
              </div>

              {/* Kaurs */}
              {displayKaurs.map((kaur) => (
                <div key={kaur.id} className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    {kaur.foto ? (
                      <img src={kaur.foto} alt={kaur.nama} className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">{kaur.jabatan}</span>
                    <h5 className="text-xs font-bold text-slate-800">{kaur.nama}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Pelaksana Teknis */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              3. Pelaksana Teknis (Kepala Seksi)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {displayKasis.map((kasi) => (
                <div key={kasi.id} className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-50 flex-shrink-0 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-emerald-800 uppercase block truncate">{kasi.jabatan}</span>
                    <h5 className="text-xs font-bold text-slate-800 truncate">{kasi.nama}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Pelaksana Kewilayahan */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              4. Pelaksana Kewilayahan (Kepala Dusun / Kamituwo)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {displayKasuns.map((kasun) => (
                <div key={kasun.id} className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-emerald-800 uppercase block truncate">{kasun.jabatan}</span>
                    <h5 className="text-xs font-bold text-slate-800 truncate">{kasun.nama}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: DOKUMEN BAGAN ASLI (JIKA DIUNGGAH DI ADMIN) */}
      {viewMode === "doc" && hasDocImage && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {baganDesaImage && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bagan Dokumen SOTK Pemerintah Desa
                </h4>
                <div
                  onClick={() => setZoomImage({ src: baganDesaImage, title: "Dokumen Bagan SOTK Desa" })}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer group flex items-center justify-center p-2"
                >
                  <img
                    src={baganDesaImage}
                    alt="Bagan SOTK Desa"
                    className="w-full h-auto max-h-72 object-contain rounded-xl group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white font-bold text-xs">
                    <ZoomIn className="w-4 h-4" />
                    <span>Perbesar</span>
                  </div>
                </div>
              </div>
            )}

            {baganBpdImage && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bagan Dokumen BPD Desa
                </h4>
                <div
                  onClick={() => setZoomImage({ src: baganBpdImage, title: "Dokumen Bagan BPD Desa" })}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer group flex items-center justify-center p-2"
                >
                  <img
                    src={baganBpdImage}
                    alt="Bagan BPD Desa"
                    className="w-full h-auto max-h-72 object-contain rounded-xl group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white font-bold text-xs">
                    <ZoomIn className="w-4 h-4" />
                    <span>Perbesar</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIREKTORI LENGKAP APARATUR DESA (PENCARIAN & FILTER KATEGORI) */}
      <div id="direktori-aparatur" className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 sm:space-y-6">
        
        {/* Header Direktori */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>Direktori Lengkap Aparatur Desa</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pejabat dan staf penyelenggara pemerintahan & pelayanan masyarakat Desa Bogem.
            </p>
          </div>
          <div className="self-start sm:self-auto bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-xl text-xs font-bold shadow-2xs">
            {directoryList.length} Personel Aktif
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "semua", label: "Semua" },
              { id: "pimpinan", label: "Pimpinan" },
              { id: "kaur", label: "Kaur" },
              { id: "kasi", label: "Kasi" },
              { id: "kasun", label: "Kamituwo" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterKategori(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                  filterKategori === tab.id
                    ? "bg-[#063321] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredDirectory.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-1">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">Tidak ada aparatur yang sesuai</p>
            <p className="text-slate-400">Coba ubah kata kunci pencarian atau filter kategori di atas.</p>
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
                <div
                  key={p.id}
                  className={`bg-slate-50/50 hover:bg-white rounded-2xl p-3 border transition-all duration-200 flex flex-col justify-between space-y-2.5 group hover:shadow-sm ${
                    isKades
                      ? "border-emerald-300 ring-1 ring-emerald-500/20"
                      : isSekdes
                      ? "border-emerald-200"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                    {p.foto ? (
                      <img
                        src={p.foto}
                        alt={p.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <UserCheck className="w-10 h-10 text-slate-300" />
                    )}
                  </div>

                  <div className="text-center space-y-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold truncate max-w-full ${
                        isKades
                          ? "bg-[#063321] text-white"
                          : isSekdes
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                      }`}
                    >
                      {p.jabatan}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                      {p.nama}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* LIGHTBOX MODAL PERBESAR GAMBAR */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">{zoomImage.title}</h3>
              <div className="flex items-center space-x-2">
                <a
                  href={zoomImage.src}
                  download="Bagan_Desa.png"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
                <button
                  onClick={() => setZoomImage(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-auto flex-grow flex items-center justify-center bg-slate-50 rounded-2xl p-2">
              <img
                src={zoomImage.src}
                alt={zoomImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
