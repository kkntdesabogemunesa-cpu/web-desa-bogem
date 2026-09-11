"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Users,
  PieChart,
  Wallet,
  Building2,
  User,
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      {/* 4 Kartu Kependudukan Utama */}
      <PendudukCards
        totalPenduduk={demografi.total_penduduk}
        kepalaKeluarga={demografi.kepala_keluarga}
        perempuan={demografi.wanita}
        lakiLaki={demografi.pria}
      />

      {/* Komposisi & Rasio Jenis Kelamin */}
      <Card className="p-5 sm:p-6 border-border/80 shadow-xs space-y-4 sm:space-y-5 bg-card">
        <div className="flex items-center justify-between pb-1 border-b border-border/60">
          <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center space-x-2">
            <PieChart className="size-4 text-emerald-700 dark:text-emerald-400" />
            <span>Rasio Komposisi Jenis Kelamin</span>
          </h3>
        </div>

        {/* 2 Komparasi Karakter / Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Laki-Laki */}
          <div className="bg-sky-50/50 dark:bg-sky-950/20 hover:bg-sky-50/80 rounded-2xl p-4 sm:p-5 border border-sky-100/80 dark:border-sky-900/40 flex items-center space-x-4 transition-all group">
            <div className="size-14 sm:size-16 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/penduduk/laki-laki.png"
                alt="Laki-Laki"
                width={64}
                height={64}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs sm:text-[13px] font-semibold text-muted-foreground uppercase tracking-wider block">
                LAKI-LAKI
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-700 dark:text-sky-400 tracking-tight tabular-nums">
                {animatedPersenPria.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Perempuan */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50/80 rounded-2xl p-4 sm:p-5 border border-rose-100/80 dark:border-rose-900/40 flex items-center space-x-4 transition-all group">
            <div className="size-14 sm:size-16 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/penduduk/perempuan.png"
                alt="Perempuan"
                width={64}
                height={64}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs sm:text-[13px] font-semibold text-muted-foreground uppercase tracking-wider block">
                PEREMPUAN
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight tabular-nums">
                {animatedPersenWanita.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Proportional Progress Track */}
        <div className="space-y-2 pt-1">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden flex p-0.5 border border-border/50">
            <div
              style={{ width: `${animatedPersenPria}%` }}
              className="bg-sky-500 h-full rounded-l-full transition-all duration-300"
            />
            <div
              style={{ width: `${animatedPersenWanita}%` }}
              className="bg-rose-400 h-full rounded-r-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1 tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-sky-500 inline-block" />
              <span>Laki-Laki ({animatedPersenPria.toFixed(1)}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-400 inline-block" />
              <span>Perempuan ({animatedPersenWanita.toFixed(1)}%)</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Rincian Wilayah & Administrasi Desa */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
        <Card className="p-4 sm:p-5 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 bg-card">
          <span className="text-xs sm:text-[13px] text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
            Luas Wilayah
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight tabular-nums">
            {animatedLuas}{" "}
            <span className="text-base sm:text-lg font-semibold text-muted-foreground">Ha</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 bg-card">
          <span className="text-xs sm:text-[13px] text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
            Jumlah Dusun
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight tabular-nums">
            {animatedDusun}{" "}
            <span className="text-base sm:text-lg font-semibold text-muted-foreground">Dusun</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 bg-card">
          <span className="text-xs sm:text-[13px] text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
            Jumlah RW
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight tabular-nums">
            {animatedRW}{" "}
            <span className="text-base sm:text-lg font-semibold text-muted-foreground">RW</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-border/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 bg-card">
          <span className="text-xs sm:text-[13px] text-muted-foreground block font-semibold uppercase tracking-wider mb-1">
            Jumlah RT
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#004329] dark:text-emerald-400 tracking-tight tabular-nums">
            {animatedRT}{" "}
            <span className="text-base sm:text-lg font-semibold text-muted-foreground">RT</span>
          </div>
        </Card>
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
    <div className="flex justify-between items-center gap-2 text-xs py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
        <span
          className={`size-1.5 rounded-full shrink-0 ${
            theme === "emerald" ? "bg-emerald-600" : "bg-slate-600"
          }`}
        />
        <span className="font-semibold text-foreground/80 truncate">{nama}</span>
      </div>
      <div className="flex items-center space-x-2.5 shrink-0">
        <Badge
          variant="secondary"
          className={`text-[10px] font-bold px-2 py-0.5 tabular-nums min-w-[48px] text-center inline-block ${
            theme === "emerald"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {animPersen.toFixed(1)}%
        </Badge>
        <span
          className={`font-bold text-right whitespace-nowrap tabular-nums min-w-[115px] sm:min-w-[135px] inline-block ${
            theme === "emerald" ? "text-emerald-800 dark:text-emerald-400" : "text-foreground"
          }`}
        >
          Rp {formatRupiah(animNominal)}
        </span>
      </div>
    </div>
  );
}

function APBDesSection({ apbdes }: { apbdes: InfografisData["apbdes"] }) {
  const totalPendapatan = apbdes.pendapatan_total || apbdes.pendapatan_rincian.reduce((acc, c) => acc + parseNominal(c.nominal), 0);
  const totalBelanja = apbdes.belanja_total || apbdes.belanja_rincian.reduce((acc, c) => acc + parseNominal(c.nominal), 0);

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

  const animPendapatan = useCountUp(totalPendapatan, 1400, true, 0);
  const animBelanja = useCountUp(totalBelanja, 1400, true, 0);
  const animSurplusDefisit = useCountUp(Math.abs(surplusDefisit), 1400, true, 0);
  const animPembiayaanNetto = useCountUp(Math.abs(pembiayaanNetto), 1400, true, 0);
  const animSilpa = useCountUp(Math.abs(silpaTahunBerjalan), 1200, true, 0);
  const animPenerimaanPembiayaan = useCountUp(totalPenerimaanPembiayaan, 1400, true, 0);
  const animPengeluaranPembiayaan = useCountUp(totalPengeluaranPembiayaan, 1400, true, 0);

  return (
    <div className="space-y-6">
      {/* 5 Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Pendapatan */}
        <Card className="p-4 sm:p-5 shadow-xs border-border/80 flex flex-col justify-between min-h-[108px] bg-card">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            1. Pendapatan
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 whitespace-nowrap tabular-nums tracking-tight my-1">
            Rp {formatRupiah(animPendapatan)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {apbdes.pendapatan_rincian?.length || 0} Pos Penerimaan Desa
          </p>
        </Card>

        {/* 2. Belanja */}
        <Card className="p-4 sm:p-5 shadow-xs border-border/80 flex flex-col justify-between min-h-[108px] bg-card">
          <div className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider">
            2. Belanja
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-foreground whitespace-nowrap tabular-nums tracking-tight my-1">
            Rp {formatRupiah(animBelanja)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {apbdes.belanja_rincian?.length || 0} Bidang Pengeluaran
          </p>
        </Card>

        {/* 3. Surplus / Defisit */}
        <Card
          className={`p-4 sm:p-5 shadow-xs border flex flex-col justify-between min-h-[108px] ${
            surplusDefisit >= 0
              ? "bg-card border-teal-200 dark:border-teal-800"
              : "bg-card border-rose-200 dark:border-rose-800"
          }`}
        >
          <div
            className={`text-[11px] font-bold uppercase tracking-wider ${
              surplusDefisit >= 0 ? "text-teal-800 dark:text-teal-300" : "text-rose-800 dark:text-rose-300"
            }`}
          >
            3. {surplusDefisit >= 0 ? "Surplus" : "Defisit"}
          </div>
          <div
            className={`text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold whitespace-nowrap tabular-nums tracking-tight my-1 ${
              surplusDefisit >= 0 ? "text-teal-700 dark:text-teal-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {surplusDefisit < 0 ? "-" : ""}Rp {formatRupiah(animSurplusDefisit)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {surplusDefisit >= 0 ? "Pendapatan > Belanja" : "Ditutup dari Pembiayaan"}
          </p>
        </Card>

        {/* 4. Pembiayaan Netto */}
        <Card className="p-4 sm:p-5 shadow-xs border-border/80 flex flex-col justify-between min-h-[108px] bg-card">
          <div className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
            4. Pembiayaan Netto
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-blue-800 dark:text-blue-400 whitespace-nowrap tabular-nums tracking-tight my-1">
            {pembiayaanNetto < 0 ? "-" : ""}Rp {formatRupiah(animPembiayaanNetto)}
          </div>
          <p className="text-[11px] text-muted-foreground">Penerimaan - Pengeluaran</p>
        </Card>

        {/* 5. SiLPA Tahun Berjalan */}
        <Card
          className={`p-4 sm:p-5 shadow-xs border flex flex-col justify-between min-h-[108px] sm:col-span-2 lg:col-span-1 ${
            Math.abs(silpaTahunBerjalan) < 0.01
              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
              : silpaTahunBerjalan > 0
              ? "bg-card border-teal-200 dark:border-teal-800"
              : "bg-card border-amber-200 dark:border-amber-800"
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
            5. Sisa (SiLPA)
          </div>
          <div className="text-sm sm:text-base lg:text-[15px] xl:text-lg 2xl:text-xl font-extrabold text-emerald-900 dark:text-emerald-300 whitespace-nowrap tabular-nums tracking-tight my-1">
            {silpaTahunBerjalan < -0.01 ? "-" : ""}Rp {formatRupiah(animSilpa)}
          </div>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
            {Math.abs(silpaTahunBerjalan) < 0.01
              ? "✓ Anggaran Berimbang"
              : silpaTahunBerjalan > 0
              ? "Sisa Lebih Anggaran"
              : "Defisit Belum Tertutup"}
          </p>
        </Card>
      </div>

      {/* Rincian Pendapatan & Belanja 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Rincian Pendapatan */}
        <Card className="p-4 sm:p-7 shadow-xs border-border/80 space-y-4 bg-card">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-emerald-900 dark:text-emerald-300">
                Rincian Sumber Pendapatan Desa
              </h3>
              <p className="text-[11px] text-muted-foreground">Pos penerimaan APBDes</p>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums whitespace-nowrap">
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
        </Card>

        {/* Rincian Belanja */}
        <Card className="p-4 sm:p-7 shadow-xs border-border/80 space-y-4 bg-card">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-foreground">
                Rincian Bidang Belanja Desa
              </h3>
              <p className="text-[11px] text-muted-foreground">Alokasi bidang pengeluaran</p>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-foreground tabular-nums whitespace-nowrap">
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
        </Card>
      </div>

      {/* Rincian Pembiayaan Desa */}
      {(penerimaanRincian.length > 0 || pengeluaranRincian.length > 0) && (
        <Card className="p-4 sm:p-7 shadow-xs border-border/80 space-y-4 bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <h3 className="text-xs sm:text-base font-bold text-blue-950 dark:text-blue-300">
                Pembiayaan Desa (SiLPA Tahun Lalu & Penyertaan Modal)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Pos penyeimbang anggaran untuk mencapai anggaran berimbang sesuai Permendagri No. 20/2018
              </p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-muted-foreground">Pembiayaan Netto:</span>
              <span className="text-xs sm:text-sm font-extrabold text-blue-900 dark:text-blue-300 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl tabular-nums whitespace-nowrap">
                {pembiayaanNetto < 0 ? "-" : ""}Rp {formatRupiah(animPembiayaanNetto)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Penerimaan Pembiayaan */}
            <div className="bg-muted/40 rounded-2xl p-4 border border-border/80 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-blue-950 dark:text-blue-300">Penerimaan Pembiayaan</span>
                <span className="text-xs font-extrabold text-blue-900 dark:text-blue-300 tabular-nums whitespace-nowrap">
                  Rp {formatRupiah(animPenerimaanPembiayaan)}
                </span>
              </div>
              <div className="space-y-2">
                {penerimaanRincian.map((item, idx) => (
                  <APBDesRincianRow
                    key={idx}
                    nama={item.nama}
                    nominal={item.nominal}
                    total={totalPenerimaanPembiayaan}
                    theme="emerald"
                  />
                ))}
              </div>
            </div>

            {/* Pengeluaran Pembiayaan */}
            <div className="bg-muted/40 rounded-2xl p-4 border border-border/80 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Pengeluaran Pembiayaan</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-200 tabular-nums whitespace-nowrap">
                  Rp {formatRupiah(animPengeluaranPembiayaan)}
                </span>
              </div>
              <div className="space-y-2">
                {pengeluaranRincian.map((item, idx) => (
                  <APBDesRincianRow
                    key={idx}
                    nama={item.nama}
                    nominal={item.nominal}
                    total={totalPengeluaranPembiayaan}
                    theme="slate"
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
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
        <main className="min-h-screen bg-background pb-28 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-20 text-center text-muted-foreground text-sm">
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

  useEffect(() => {
    setActiveTab(getValidTab(tabParam));
  }, [tabParam]);
  
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
                <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
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

        {/* Mobile Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Kategori Infografis Mobile"
          className="grid grid-cols-3 gap-1.5 sm:hidden w-full bg-card/90 backdrop-blur-sm p-1.5 rounded-2xl border border-border/80 shadow-xs"
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
                    ? "bg-[#063321] text-white shadow-xs"
                    : "bg-muted/50 text-foreground/80 hover:bg-muted border border-border/60"
                }`}
              >
                <div
                  className={`size-7 rounded-lg flex items-center justify-center mb-1 transition-colors ${
                    isActive
                      ? "bg-white/15 text-emerald-300"
                      : "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  }`}
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-1">
                  {tab.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Kategori Infografis"
          className="hidden sm:inline-flex bg-card/80 backdrop-blur-sm p-1.5 rounded-2xl border border-border/80 shadow-xs items-center gap-1.5 max-w-full overflow-x-auto scrollbar-none"
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

        {/* Tab 1: Demografi Penduduk */}
        {activeTab === "penduduk" && (
          <DemografiSection demografi={demografi} />
        )}

        {/* Tab 2: Kelembagaan & Organisasi Desa */}
        {activeTab === "organisasi" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  Kelembagaan & Organisasi Desa
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Lembaga kemasyarakatan aktif di lingkungan Pemerintah Desa Bogem.
                </p>
              </div>
              <Badge variant="secondary" className="self-start sm:self-auto gap-2 bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950 dark:text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{organisasi.length} Lembaga Aktif</span>
              </Badge>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {organisasi.map((org) => (
                <Card
                  key={org.id || org.nama}
                  className="p-5 border-border/80 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group bg-card"
                >
                  <div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 font-bold text-xs border-emerald-200/60 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
                      {org.singkatan || "LKD"}
                    </Badge>

                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                      {org.nama}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {org.kategori}
                    </p>
                  </div>

                  {/* 2 Micro-cards: Ketua & Anggota */}
                  <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/40 rounded-xl p-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 flex items-center gap-1">
                        <User className="size-3 text-muted-foreground" />
                        Ketua
                      </span>
                      <span className="font-bold text-foreground truncate block">
                        {org.ketua}
                      </span>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5 flex items-center gap-1">
                        <Users className="size-3 text-muted-foreground" />
                        Anggota
                      </span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-400 truncate block">
                        {org.jumlah_anggota || "-"}
                      </span>
                    </div>
                  </div>

                  {org.kontak && org.kontak !== "-" && (
                    <div className="text-[11px] text-muted-foreground pt-0.5 flex items-center justify-between border-t border-border/40">
                      <span>Kontak:</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">{org.kontak}</span>
                    </div>
                  )}
                </Card>
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
