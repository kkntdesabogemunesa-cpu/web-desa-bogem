"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  PieChart,
  Wallet,
  Building2,
  User,
  TrendingUp,
  ArrowLeft,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  fetchInfografisData,
  defaultInfografisData,
  parseNominal,
  formatRupiah,
} from "@/services/infografisService";
import { InfografisData } from "@/types/infografis";
import PendudukCards from "@/components/home/PendudukCards";
import { useCountUp } from "@/hooks";

function DemografiSection({ demografi }: { demografi: InfografisData["demografi"] }) {
  const totalWarga = demografi.total_penduduk || (demografi.pria + demografi.wanita) || 1;
  const rawPersenPria = Number(((demografi.pria / totalWarga) * 100).toFixed(1));
  const rawPersenWanita = Number(((demografi.wanita / totalWarga) * 100).toFixed(1));

  // Count-up animations when opened
  const animatedPersenPria = useCountUp(rawPersenPria, 1400, true, 1);
  const animatedPersenWanita = useCountUp(rawPersenWanita, 1400, true, 1);

  const animatedLuas = useCountUp(Number(demografi.luas_wilayah) || 245, 1200);
  const animatedDusun = useCountUp(Number(demografi.jumlah_dusun) || 2, 1000);
  const animatedRW = useCountUp(Number(demografi.jumlah_rw) || 2, 1000);
  const animatedRT = useCountUp(Number(demografi.jumlah_rt) || 9, 1100);

  return (
    <div className="space-y-6">
      {/* 4 Kartu Kependudukan Utama (Tetap menggunakan PendudukCards) */}
      <PendudukCards
        totalPenduduk={demografi.total_penduduk}
        kepalaKeluarga={demografi.kepala_keluarga}
        perempuan={demografi.wanita}
        lakiLaki={demografi.pria}
      />

      {/* Komposisi & Rasio Jenis Kelamin */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-emerald-700" />
            <span>Rasio Komposisi Jenis Kelamin</span>
          </h3>
        </div>

        {/* 2 Komparasi Karakter / Gender - Langsung Persen Tanpa Card Tambahan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Laki-Laki */}
          <div className="bg-sky-50/50 hover:bg-sky-50/80 rounded-2xl p-4 sm:p-5 border border-sky-100/80 flex items-center space-x-4 transition-all group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img
                src="/images/penduduk/laki-laki.png"
                alt="Laki-Laki"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                LAKI-LAKI
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-700 tracking-tight tabular-nums">
                {animatedPersenPria.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Perempuan */}
          <div className="bg-rose-50/50 hover:bg-rose-50/80 rounded-2xl p-4 sm:p-5 border border-rose-100/80 flex items-center space-x-4 transition-all group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img
                src="/images/penduduk/perempuan.png"
                alt="Perempuan"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-500 uppercase tracking-wider block">
                PEREMPUAN
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight tabular-nums">
                {animatedPersenWanita.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Proportional Progress Track */}
        <div className="space-y-2 pt-1">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex p-0.5 border border-slate-200/50">
            <div
              style={{ width: `${animatedPersenPria}%` }}
              className="bg-sky-500 h-full rounded-l-full transition-all duration-300"
            />
            <div
              style={{ width: `${animatedPersenWanita}%` }}
              className="bg-rose-400 h-full rounded-r-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1 tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              <span>Laki-Laki ({animatedPersenPria.toFixed(1)}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              <span>Perempuan ({animatedPersenWanita.toFixed(1)}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Wilayah & Administrasi Desa - Desain Simple, Bersih & Modern */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
        {/* 1. Luas Wilayah */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200">
          <span className="text-xs sm:text-[13px] text-slate-500 block font-semibold uppercase tracking-wider mb-1">
            Luas Wilayah
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] tracking-tight tabular-nums">
            {animatedLuas}{" "}
            <span className="text-base sm:text-lg font-semibold text-slate-600">Ha</span>
          </div>
        </div>

        {/* 2. Jumlah Dusun */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200">
          <span className="text-xs sm:text-[13px] text-slate-500 block font-semibold uppercase tracking-wider mb-1">
            Jumlah Dusun
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] tracking-tight tabular-nums">
            {animatedDusun}{" "}
            <span className="text-base sm:text-lg font-semibold text-slate-600">Dusun</span>
          </div>
        </div>

        {/* 3. Jumlah RW */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200">
          <span className="text-xs sm:text-[13px] text-slate-500 block font-semibold uppercase tracking-wider mb-1">
            Jumlah RW
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] tracking-tight tabular-nums">
            {animatedRW}{" "}
            <span className="text-base sm:text-lg font-semibold text-slate-600">RW</span>
          </div>
        </div>

        {/* 4. Jumlah RT */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-200/80 transition-all duration-200">
          <span className="text-xs sm:text-[13px] text-slate-500 block font-semibold uppercase tracking-wider mb-1">
            Jumlah RT
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] tracking-tight tabular-nums">
            {animatedRT}{" "}
            <span className="text-base sm:text-lg font-semibold text-slate-600">RT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function APBDesRincianRow({
  nama,
  nominal,
  total,
  theme = "emerald",
}: {
  nama: string;
  nominal: number | string;
  total: number;
  theme?: "emerald" | "slate";
}) {
  const numNominal = parseNominal(nominal);
  const rawPersen = total > 0 ? (numNominal / total) * 100 : 0;

  const animNominal = useCountUp(numNominal, 1400, true, 0);
  const animPersen = useCountUp(rawPersen, 1400, true, 1);

  return (
    <div className="flex justify-between items-center gap-2 text-xs py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            theme === "emerald" ? "bg-emerald-600" : "bg-slate-600"
          }`}
        />
        <span className="font-semibold text-slate-700 truncate">{nama}</span>
      </div>
      <div className="flex items-center space-x-2.5 flex-shrink-0">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg tabular-nums min-w-[48px] text-center inline-block ${
            theme === "emerald"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {animPersen.toFixed(1)}%
        </span>
        <span
          className={`font-bold text-right whitespace-nowrap tabular-nums min-w-[115px] sm:min-w-[135px] inline-block ${
            theme === "emerald" ? "text-emerald-800" : "text-slate-900"
          }`}
        >
          Rp {formatRupiah(animNominal)}
        </span>
      </div>
    </div>
  );
}

function PembiayaanRow({
  nama,
  nominal,
  textColor = "text-blue-900",
}: {
  nama: string;
  nominal: number | string;
  textColor?: string;
}) {
  const numNominal = parseNominal(nominal);
  const animNominal = useCountUp(numNominal, 1400, true, 0);

  return (
    <div className="flex justify-between items-center text-xs py-1">
      <span className="font-semibold text-slate-700 truncate flex-1 mr-2">{nama}</span>
      <span className={`font-bold whitespace-nowrap tabular-nums text-right min-w-[110px] ${textColor}`}>
        Rp {formatRupiah(animNominal)}
      </span>
    </div>
  );
}

function APBDesSection({ apbdes }: { apbdes: InfografisData["apbdes"] }) {
  const totalPendapatan = apbdes.pendapatan_total || 0;
  const totalBelanja = apbdes.belanja_total || 0;
  const surplusDefisit = apbdes.surplus_defisit !== undefined ? apbdes.surplus_defisit : (totalPendapatan - totalBelanja);
  const penerimaanRincian = apbdes.pembiayaan_penerimaan_rincian || [];
  const pengeluaranRincian = apbdes.pembiayaan_pengeluaran_rincian || [];
  const totalPenerimaanPembiayaan = apbdes.pembiayaan_penerimaan !== undefined
    ? apbdes.pembiayaan_penerimaan
    : penerimaanRincian.reduce((acc, c) => acc + parseNominal(c.nominal), 0);
  const totalPengeluaranPembiayaan = apbdes.pembiayaan_pengeluaran !== undefined
    ? apbdes.pembiayaan_pengeluaran
    : pengeluaranRincian.reduce((acc, c) => acc + parseNominal(c.nominal), 0);
  const pembiayaanNetto = apbdes.pembiayaan_netto !== undefined
    ? apbdes.pembiayaan_netto
    : (totalPenerimaanPembiayaan - totalPengeluaranPembiayaan);
  const silpaTahunBerjalan = apbdes.silpa !== undefined
    ? apbdes.silpa
    : (surplusDefisit + pembiayaanNetto);

  // Animated Count-ups for 5 Top Cards & Section Totals (decimals: 0 prevents decimal comma fluttering)
  const animPendapatan = useCountUp(totalPendapatan, 1400, true, 0);
  const animBelanja = useCountUp(totalBelanja, 1400, true, 0);
  const animSurplusDefisit = useCountUp(Math.abs(surplusDefisit), 1400, true, 0);
  const animPembiayaanNetto = useCountUp(Math.abs(pembiayaanNetto), 1400, true, 0);
  const animSilpa = useCountUp(Math.abs(silpaTahunBerjalan), 1200, true, 0);
  const animPenerimaanPembiayaan = useCountUp(totalPenerimaanPembiayaan, 1400, true, 0);
  const animPengeluaranPembiayaan = useCountUp(totalPengeluaranPembiayaan, 1400, true, 0);

  return (
    <div className="space-y-6">
      {/* 5 Financial Summary Cards - Simple, Stable, Non-Jittering & Tabular Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Pendapatan */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[108px]">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            1. Pendapatan
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-emerald-700 whitespace-nowrap tabular-nums tracking-tight my-1">
            Rp {formatRupiah(animPendapatan)}
          </div>
          <p className="text-[11px] text-slate-500">
            {apbdes.pendapatan_rincian?.length || 0} Pos Penerimaan Desa
          </p>
        </div>

        {/* 2. Belanja */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between min-h-[108px]">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            2. Belanja
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-slate-900 whitespace-nowrap tabular-nums tracking-tight my-1">
            Rp {formatRupiah(animBelanja)}
          </div>
          <p className="text-[11px] text-slate-500">
            {apbdes.belanja_rincian?.length || 0} Bidang Pengeluaran
          </p>
        </div>

        {/* 3. Surplus / Defisit */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border flex flex-col justify-between min-h-[108px] ${
            surplusDefisit >= 0
              ? "bg-white border-teal-100"
              : "bg-white border-rose-100"
          }`}
        >
          <div
            className={`text-[11px] font-bold uppercase tracking-wider ${
              surplusDefisit >= 0 ? "text-teal-800" : "text-rose-800"
            }`}
          >
            3. {surplusDefisit >= 0 ? "Surplus" : "Defisit"}
          </div>
          <div
            className={`text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold whitespace-nowrap tabular-nums tracking-tight my-1 ${
              surplusDefisit >= 0 ? "text-teal-700" : "text-rose-600"
            }`}
          >
            {surplusDefisit < 0 ? "-" : ""}Rp {formatRupiah(animSurplusDefisit)}
          </div>
          <p className="text-[11px] text-slate-500">
            {surplusDefisit >= 0 ? "Pendapatan > Belanja" : "Ditutup dari Pembiayaan"}
          </p>
        </div>

        {/* 4. Pembiayaan Netto */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-blue-100 flex flex-col justify-between min-h-[108px]">
          <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
            4. Pembiayaan Netto
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-blue-800 whitespace-nowrap tabular-nums tracking-tight my-1">
            {pembiayaanNetto < 0 ? "-" : ""}Rp {formatRupiah(animPembiayaanNetto)}
          </div>
          <p className="text-[11px] text-slate-500">Penerimaan - Pengeluaran</p>
        </div>

        {/* 5. SiLPA Tahun Berjalan */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border flex flex-col justify-between min-h-[108px] sm:col-span-2 lg:col-span-1 ${
            Math.abs(silpaTahunBerjalan) < 0.01
              ? "bg-emerald-50/70 border-emerald-300"
              : silpaTahunBerjalan > 0
              ? "bg-white border-teal-100"
              : "bg-white border-amber-200"
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
            5. Sisa (SiLPA)
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-emerald-900 whitespace-nowrap tabular-nums tracking-tight my-1">
            {silpaTahunBerjalan < -0.01 ? "-" : ""}Rp {formatRupiah(animSilpa)}
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold">
            {Math.abs(silpaTahunBerjalan) < 0.01
              ? "✓ Anggaran Berimbang"
              : silpaTahunBerjalan > 0
              ? "Sisa Lebih Anggaran"
              : "Defisit Belum Tertutup"}
          </p>
        </div>
      </div>

      {/* Rincian Pendapatan & Belanja 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Rincian Pendapatan */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-emerald-900">
                Rincian Sumber Pendapatan Desa
              </h3>
              <p className="text-[11px] text-slate-500">Pos penerimaan APBDes</p>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
              Rp {formatRupiah(animPendapatan)}
            </span>
          </div>
          <div className="space-y-2.5">
            {apbdes.pendapatan_rincian.map((item, idx) => (
              <APBDesRincianRow
                key={idx}
                nama={item.nama}
                nominal={item.nominal}
                total={totalPendapatan}
                theme="emerald"
              />
            ))}
          </div>
        </div>

        {/* Rincian Belanja */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-slate-900">
                Rincian Bidang Belanja Desa
              </h3>
              <p className="text-[11px] text-slate-500">Alokasi bidang pengeluaran</p>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
              Rp {formatRupiah(animBelanja)}
            </span>
          </div>
          <div className="space-y-2.5">
            {apbdes.belanja_rincian.map((item, idx) => (
              <APBDesRincianRow
                key={idx}
                nama={item.nama}
                nominal={item.nominal}
                total={totalBelanja}
                theme="slate"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rincian Pembiayaan Desa (Penerimaan & Pengeluaran Pembiayaan) */}
      {(penerimaanRincian.length > 0 || pengeluaranRincian.length > 0) && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-blue-950">
                Pembiayaan Desa (SiLPA Tahun Lalu & Penyertaan Modal)
              </h3>
              <p className="text-[11px] text-slate-500">
                Pos penyeimbang anggaran untuk mencapai anggaran berimbang sesuai Permendagri No. 20/2018
              </p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-slate-600">Pembiayaan Netto:</span>
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-xl tabular-nums whitespace-nowrap">
                {pembiayaanNetto < 0 ? "-" : ""}Rp {formatRupiah(animPembiayaanNetto)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Penerimaan Pembiayaan */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-blue-950">Penerimaan Pembiayaan</span>
                <span className="text-xs font-extrabold text-blue-900 tabular-nums whitespace-nowrap">
                  Rp {formatRupiah(animPenerimaanPembiayaan)}
                </span>
              </div>
              <div className="space-y-2">
                {penerimaanRincian.map((p, idx) => (
                  <PembiayaanRow
                    key={idx}
                    nama={p.nama}
                    nominal={p.nominal}
                    textColor="text-blue-900"
                  />
                ))}
              </div>
            </div>

            {/* Pengeluaran Pembiayaan */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900">Pengeluaran Pembiayaan</span>
                <span className="text-xs font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                  Rp {formatRupiah(animPengeluaranPembiayaan)}
                </span>
              </div>
              <div className="space-y-2">
                {pengeluaranRincian.map((p, idx) => (
                  <PembiayaanRow
                    key={idx}
                    nama={p.nama}
                    nominal={p.nominal}
                    textColor="text-slate-900"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Transparansi */}
      <div className="bg-emerald-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Transparansi Keuangan Publik</span>
          </div>
          <h4 className="text-base sm:text-xl font-bold">Laporan Realisasi APBDes Tahun {apbdes.tahun_anggaran}</h4>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            Seluruh penerimaan, belanja, dan pembiayaan keuangan desa dikelola secara akuntabel, transparan, dan dapat dipertanggungjawabkan kepada seluruh warga Desa Bogem.
          </p>
        </div>
      </div>
    </div>
  );
}

type InfografisTabType = "penduduk" | "organisasi" | "apbd";

interface InfografisTabConfig {
  id: InfografisTabType;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
}

const TABS: InfografisTabConfig[] = [
  {
    id: "penduduk",
    label: "Demografi Penduduk",
    mobileLabel: "Demografi",
    icon: Users,
  },
  {
    id: "organisasi",
    label: "Kelembagaan & Organisasi",
    mobileLabel: "Kelembagaan",
    icon: Building2,
  },
  {
    id: "apbd",
    label: "APBDes & Transparansi Anggaran",
    mobileLabel: "APBDes",
    icon: Wallet,
  },
];

function getValidTab(t: string | null): InfografisTabType {
  if (t === "organisasi" || t === "kelembagaan" || t === "lembaga") return "organisasi";
  if (t === "apbd" || t === "apbdes" || t === "anggaran") return "apbd";
  return "penduduk";
}

export default function InfografisPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-20 text-center text-slate-400 text-sm">
            Memuat Data Infografis...
          </div>
        </main>
      }
    >
      <InfografisContent />
    </Suspense>
  );
}

function InfografisContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<InfografisTabType>(() => getValidTab(tabParam));

  // Sinkronisasi otomatis saat URL berubah (misal tombol Back/Forward browser)
  useEffect(() => {
    setActiveTab(getValidTab(tabParam));
  }, [tabParam]);
  
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

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Banner Section - Simple, Clean & Elegant */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#063321] via-[#083E28] to-[#0A4D33] border border-emerald-800/40 shadow-sm p-6 sm:p-8 lg:p-10 text-white">
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
              <span className="text-white font-medium">Infografis & Data Desa</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Infografis Desa Bogem
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
                Transparansi data kependudukan, tata kelola kelembagaan masyarakat, serta akuntabilitas anggaran APBDes Pemerintah Desa Bogem.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs (HP): 3 Kolom Rapi, Proporsional & Tanpa Scroll Horizontal */}
        <div
          role="tablist"
          aria-label="Kategori Infografis Mobile"
          className="grid grid-cols-3 gap-1.5 sm:hidden w-full bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 shadow-xs"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/infografis?tab=${tab.id}`}
                replace
                scroll={false}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-bold transition-all active:scale-95 text-center ${
                  isActive
                    ? "bg-[#063321] text-white shadow-sm shadow-emerald-950/20"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100/80 border border-slate-200/60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 transition-colors ${
                    isActive
                      ? "bg-white/15 text-emerald-300"
                      : "bg-emerald-100/80 text-emerald-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-1">
                  {tab.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop / Laptop Segmented Control Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Kategori Infografis"
          className="hidden sm:inline-flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 shadow-xs items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/infografis?tab=${tab.id}`}
                replace
                scroll={false}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
                  isActive
                    ? "bg-[#063321] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Tab 1: Demografi Penduduk */}
        {activeTab === "penduduk" && (
          <DemografiSection demografi={demografi} />
        )}

        {/* Tab 2: Kelembagaan & Organisasi Desa */}
        {activeTab === "organisasi" && (
          <div className="space-y-5">
            {/* Header: Simple & Bersih */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Kelembagaan & Organisasi Desa
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Lembaga kemasyarakatan aktif di lingkungan Pemerintah Desa Bogem.
                </p>
              </div>
              <div className="self-start sm:self-auto inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{organisasi.length} Lembaga Aktif</span>
              </div>
            </div>

            {/* Organizations Grid - Clean, Modern & Tanpa Kata-Kata Tak Berguna */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {organisasi.map((org) => (
                <div
                  key={org.id || org.nama}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-emerald-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  {/* Header: Judul di atas baru penjelasan / kategori */}
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200/60 mb-2">
                      {org.singkatan || "LKD"}
                    </span>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {org.nama}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {org.kategori}
                    </p>
                  </div>

                  {/* 2 Micro-cards: Ketua & Anggota */}
                  <div className="pt-3 border-t border-slate-100/80 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50/80 rounded-xl p-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        Ketua
                      </span>
                      <span className="font-bold text-slate-800 truncate block">
                        {org.ketua}
                      </span>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        Anggota
                      </span>
                      <span className="font-bold text-emerald-800 truncate block">
                        {org.jumlah_anggota || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Optional Kontak */}
                  {org.kontak && org.kontak !== "-" && (
                    <div className="text-[11px] text-slate-500 pt-0.5 flex items-center justify-between border-t border-slate-50">
                      <span>Kontak:</span>
                      <span className="font-bold text-emerald-800">{org.kontak}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: APBDes Transparansi */}
        {activeTab === "apbd" && <APBDesSection apbdes={apbdes} />}

      </div>
    </main>
  );
}
