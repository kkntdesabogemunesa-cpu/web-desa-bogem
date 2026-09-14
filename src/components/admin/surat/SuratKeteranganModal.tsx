"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Printer,
  FileText,
  User,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
  Maximize2,
  Send,
  Loader2,
} from "lucide-react";
import {
  PermohonanSurat,
  PengaturanSurat,
  DataSuratKeterangan,
  defaultPengaturanSurat,
} from "@/types/surat";
import {
  formatNomorSurat,
  savePengaturanSurat,
  updateStatusDanFileSurat,
  createPermohonanSurat,
} from "@/services/suratService";
import { formatDateIndonesian } from "@/utils/formatters";
import { LOGO_MAGETAN_SURAT_BASE64 } from "./logoBase64";

export function generateSuratHtml(
  suratData: DataSuratKeterangan,
  cfg: PengaturanSurat,
  origin: string = ""
): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title></title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html {
      background-color: #f1f5f9;
      margin: 0;
      padding: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      color: #000000;
      font-family: 'Times New Roman', Times, serif;
    }
    .page-wrapper {
      display: flex;
      justify-content: center;
      padding: 24px 16px;
      min-height: calc(100vh - 50px);
    }
    .surat-sheet {
      width: 210mm;
      max-width: 210mm;
      min-height: 297mm;
      background-color: #ffffff;
      padding: 16mm 16mm 16mm 16mm;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
      position: relative;
    }
    .kop-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2px;
    }
    .kop-logo {
      width: 75px;
      text-align: center;
      vertical-align: middle;
    }
    .kop-logo img {
      width: 68px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    .kop-text {
      text-align: center;
      vertical-align: middle;
      padding: 0 10px;
      font-family: Arial, Helvetica, sans-serif;
    }
    .kop-text h2 {
      margin: 0;
      font-size: 13.9pt;
      font-weight: normal;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      line-height: 1.25;
      color: #000000;
    }
    .kop-text h3 {
      margin: 2px 0 0 0;
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      line-height: 1.25;
      color: #000000;
    }
    .kop-text h1 {
      margin: 1px 0 0 0;
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      line-height: 1.25;
      color: #000000;
    }
    .kop-text .kop-kontak {
      margin: 3px 0 0 0;
      font-size: 11.5pt;
      font-weight: normal;
      line-height: 1.25;
      color: #000000;
    }
    .kop-text .kop-email {
      margin: 1px 0 0 0;
      font-size: 11.5pt;
      font-weight: normal;
      line-height: 1.25;
      color: #000000;
    }
    .kop-text .kop-email a {
      color: #000000;
      text-decoration: underline;
    }
    .kop-line {
      border-top: 1px solid #000000;
      border-bottom: 2.2px solid #000000;
      height: 3px;
      margin-top: 4px;
      margin-bottom: 20px;
    }
    .body-content {
      padding: 0 12mm;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      color: #000000;
      line-height: 1.35;
    }
    .judul-surat {
      text-align: center;
      margin: 6px 0 20px 0;
    }
    .judul-surat h2 {
      margin: 0;
      font-size: 12pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      display: inline-block;
    }
    .judul-surat p {
      margin: 4px 0 0 0;
      font-size: 12pt;
      font-weight: normal;
    }
    .pembuka {
      margin-bottom: 4px;
      font-size: 12pt;
    }
    .pejabat-table {
      margin-left: 36px;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .pejabat-table td {
      vertical-align: top;
      padding: 1.5px 0;
      font-size: 12pt;
    }
    .pengantar {
      margin-bottom: 6px;
      font-size: 12pt;
    }
    .poin-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    .poin-table td {
      vertical-align: top;
      padding: 2.2px 0;
      font-size: 12pt;
      line-height: 1.35;
    }
    .col-no {
      width: 28px;
      padding-left: 10px;
    }
    .col-lbl {
      width: 175px;
    }
    .col-colon {
      width: 15px;
      text-align: center;
    }
    .col-val {
      text-align: justify;
    }
    .penutup {
      margin-bottom: 20px;
      font-size: 12pt;
      text-indent: 40px;
      text-align: justify;
      line-height: 1.45;
    }
    .ttd-wrap {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .ttd-box {
      width: 250px;
      text-align: center;
      font-size: 12pt;
      line-height: 1.35;
    }
    .ttd-space {
      height: 75px;
    }
    .ttd-nama {
      font-weight: bold;
      text-decoration: underline;
    }
    .ttd-nip {
      font-size: 12pt;
      margin-top: 2px;
    }
    @media print {
      html, body {
        background-color: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .page-wrapper {
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        min-height: auto !important;
      }
      .surat-sheet {
        width: 100% !important;
        max-width: 100% !important;
        min-height: auto !important;
        padding: 16mm 16mm 16mm 16mm !important;
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  </style>
</head>
<body>
  <!-- TOOLBAR PRATINJAU PADA LAYAR -->
  <div class="no-print" style="position: sticky; top: 0; z-index: 999; background: #073623; color: #ffffff; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.18);">
    <div style="font-size: 13px; font-weight: 600;">
      📄 Pratinjau Dokumen Resmi Desa Bogem (Kertas A4)
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 7px 16px; border-radius: 8px; font-weight: bold; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
        🖨️ Cetak / Simpan PDF
      </button>
      <button onclick="window.close()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 7px 12px; border-radius: 8px; font-size: 12px; cursor: pointer;">
        Tutup
      </button>
    </div>
  </div>

  <div class="page-wrapper">
    <div class="surat-sheet">
      <!-- KOP SURAT (FONT ARIAL SESUAI SURAT RESMI PEMKAB MAGETAN) -->
      <table class="kop-table">
        <tr>
          <td class="kop-logo">
            <img src="${LOGO_MAGETAN_SURAT_BASE64}" alt="Logo Kabupaten Magetan" />
          </td>
          <td class="kop-text">
            <h2>${cfg.nama_instansi || "PEMERINTAH KABUPATEN MAGETAN"}</h2>
            <h3>${cfg.nama_kecamatan || "KECAMATAN KAWEDANAN"}</h3>
            <h1>${cfg.nama_desa || "DESA BOGEM"}</h1>
            <p class="kop-kontak">${cfg.alamat_kantor || "Jl. Bhakti Mulya No.241"} telp : ${cfg.telepon_kantor || "081231400990"}</p>
            <p class="kop-email">Email : <a href="mailto:${cfg.email_kantor || "desabogemjaya@gmail.com"}">${cfg.email_kantor || "desabogemjaya@gmail.com"}</a> , Kodepos ${cfg.kodepos || "63382"}</p>
          </td>
          <td style="width: 75px;"></td>
        </tr>
      </table>
      <div class="kop-line"></div>

      <!-- KONTEN SURAT (FONT TIMES NEW ROMAN 12PT INDENT 12MM) -->
      <div class="body-content">
        <!-- JUDUL SURAT -->
        <div class="judul-surat">
          <h2>${suratData.judul_surat || "SURAT KETERANGAN"}</h2>
          <p>Nomor: ${suratData.nomor_surat || "474 / 196 / 403.405.13 / 2026"}</p>
        </div>

        <!-- PEMBUKA PEJABAT -->
        <div class="pembuka">Yang bertanda tangan di bawah ini :</div>
        <table class="pejabat-table">
          <tr>
            <td style="width: 70px;">Nama</td>
            <td style="width: 15px; text-align: center;">:</td>
            <td>${suratData.nama_pejabat || cfg.nama_pejabat}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td style="text-align: center;">:</td>
            <td>${suratData.jabatan_pejabat || cfg.jabatan_pejabat}</td>
          </tr>
          <tr>
            <td>Alamat</td>
            <td style="text-align: center;">:</td>
            <td>${suratData.alamat_pejabat || cfg.alamat_pejabat}</td>
          </tr>
        </table>

        <!-- PENGANTAR -->
        <div class="pengantar">Dengan ini menerangkan dengan sesungguhnya bahwa :</div>

        <!-- 11 POIN WARGA -->
        <table class="poin-table">
          <tr>
            <td class="col-no">1</td>
            <td class="col-lbl">Nama</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.nama_warga || ""}</td>
          </tr>
          <tr>
            <td class="col-no">2</td>
            <td class="col-lbl">Tempat, tanggal lahir</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.tempat_tanggal_lahir || ""}</td>
          </tr>
          <tr>
            <td class="col-no">3</td>
            <td class="col-lbl">Jenis kelamin</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.jenis_kelamin || ""}</td>
          </tr>
          <tr>
            <td class="col-no">4</td>
            <td class="col-lbl">Kebangsaan</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.kebangsaan || "Indonesia"}</td>
          </tr>
          <tr>
            <td class="col-no">5</td>
            <td class="col-lbl">Agama</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.agama || ""}</td>
          </tr>
          <tr>
            <td class="col-no">6</td>
            <td class="col-lbl">Status Perkawinan</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.status_perkawinan || ""}</td>
          </tr>
          <tr>
            <td class="col-no">7</td>
            <td class="col-lbl">Pekerjaan</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.pekerjaan || ""}</td>
          </tr>
          <tr>
            <td class="col-no">8</td>
            <td class="col-lbl">Nomor KTP</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.nomor_ktp || ""}</td>
          </tr>
          <tr>
            <td class="col-no">9</td>
            <td class="col-lbl">Alamat Desa/Kelurahan</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.alamat_warga || ""}</td>
          </tr>
          <tr>
            <td class="col-no">10</td>
            <td class="col-lbl">Keterangan</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.keterangan || ""}</td>
          </tr>
          <tr>
            <td class="col-no">11</td>
            <td class="col-lbl">Keperluan</td>
            <td class="col-colon">:</td>
            <td class="col-val">${suratData.keperluan || ""}</td>
          </tr>
        </table>

        <!-- PENUTUP -->
        <div class="penutup">
          Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya
        </div>

        <!-- TANDA TANGAN -->
        <div class="ttd-wrap">
          <div class="ttd-box">
            <div>${suratData.tanggal_surat || "Bogem, 28 Agustus 2026"}</div>
            <div>${suratData.jabatan_pejabat || cfg.jabatan_pejabat}</div>
            <div class="ttd-space"></div>
            <div class="ttd-nama">${suratData.nama_pejabat || cfg.nama_pejabat}</div>
            ${suratData.nip_pejabat ? `<div class="ttd-nip">NIP.${suratData.nip_pejabat}</div>` : ""}
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

interface SuratKeteranganModalProps {
  isOpen: boolean;
  onClose: () => void;
  permohonan?: PermohonanSurat | null;
  pengaturan: PengaturanSurat;
  onPengaturanUpdated?: (updated: PengaturanSurat) => void;
  onSuratDiterbitkan?: () => void;
}

export default function SuratKeteranganModal({
  isOpen,
  onClose,
  permohonan,
  pengaturan,
  onPengaturanUpdated,
  onSuratDiterbitkan,
}: SuratKeteranganModalProps) {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [publishing, setPublishing] = useState(false);
  const [suratData, setSuratData] = useState<DataSuratKeterangan>({
    nomor_surat: "",
    tanggal_surat: "",
    nama_pejabat: "",
    jabatan_pejabat: "",
    alamat_pejabat: "",
    nip_pejabat: "",
    nama_warga: "",
    tempat_tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    kebangsaan: "Indonesia",
    agama: "Islam",
    status_perkawinan: "Belum Kawin",
    pekerjaan: "",
    nomor_ktp: "",
    alamat_warga: "Desa Bogem Kecamatan Kawedanan Kabupaten Magetan",
    keterangan: "Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan berkelakuan baik.",
    keperluan: "",
  });

  const [savingCounter, setSavingCounter] = useState(false);
  const [counterSavedNotice, setCounterSavedNotice] = useState(false);

  // Initialize data when modal opens or permohonan/pengaturan changes
  useEffect(() => {
    if (!isOpen) return;

    const currentYear = new Date().getFullYear();
    const formattedDate = formatDateIndonesian(new Date().toISOString());
    const initialNomor = formatNomorSurat(
      pengaturan || defaultPengaturanSurat,
      pengaturan?.nomor_urut_terakhir || defaultPengaturanSurat.nomor_urut_terakhir,
      currentYear
    );

    // Parse data from permohonan if provided
    let namaWarga = "";
    let nikWarga = "";
    let ttlWarga = "";
    let jk = "Laki-laki";
    let agamaWarga = "Islam";
    let statusNikah = "Belum Kawin";
    let kerjaan = "";
    let alamatWarga = "Desa Bogem Kecamatan Kawedanan Kabupaten Magetan";
    let keperluanSurat = "";
    let keteranganSurat = "Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan berkelakuan baik.";
    let judulSurat = "SURAT KETERANGAN";

    if (permohonan) {
      namaWarga = permohonan.nama_lengkap || "";
      nikWarga = permohonan.nik || "";

      const df = permohonan.data_formulir || {};

      // Judul Surat
      if (permohonan.jenis_surat) {
        const j = permohonan.jenis_surat.toUpperCase();
        if (j.includes("USAHA") || j.includes("SKU")) {
          judulSurat = "SURAT KETERANGAN USAHA";
        } else if (j.includes("DOMISILI")) {
          judulSurat = "SURAT KETERANGAN DOMISILI";
        } else if (j.includes("TIDAK MAMPU") || j.includes("SKTM")) {
          judulSurat = "SURAT KETERANGAN TIDAK MAMPU";
        } else if (j.includes("SKCK")) {
          judulSurat = "SURAT PENGANTAR SKCK";
        } else if (j.includes("BELUM MENIKAH") || j.includes("BELUM NIKAH")) {
          judulSurat = "SURAT KETERANGAN BELUM MENIKAH";
        } else if (j.includes("KEMATIAN")) {
          judulSurat = "SURAT KETERANGAN KEMATIAN";
        } else {
          judulSurat = "SURAT KETERANGAN";
        }
      }

      // TTL Warga
      if (typeof df.tempat_tanggal_lahir === "string" && df.tempat_tanggal_lahir.trim()) {
        ttlWarga = df.tempat_tanggal_lahir.trim();
      } else if (typeof df.tempat_tgl_lahir === "string" && df.tempat_tgl_lahir.trim()) {
        ttlWarga = df.tempat_tgl_lahir.trim();
      } else if (typeof df.tempat_lahir === "string" || typeof df.tanggal_lahir === "string") {
        ttlWarga = [df.tempat_lahir, df.tanggal_lahir].filter(Boolean).join(", ");
      }

      // Jenis Kelamin
      if (typeof df.jenis_kelamin === "string" && df.jenis_kelamin.trim()) {
        jk = df.jenis_kelamin.trim();
      }

      // Agama
      if (typeof df.agama === "string" && df.agama.trim()) {
        agamaWarga = df.agama.trim();
      }

      // Status Perkawinan
      if (typeof df.status_perkawinan === "string" && df.status_perkawinan.trim()) {
        statusNikah = df.status_perkawinan.trim();
      }

      // Pekerjaan
      if (typeof df.pekerjaan === "string" && df.pekerjaan.trim()) {
        kerjaan = df.pekerjaan.trim();
      }

      // Alamat Warga Lengkap
      if (typeof df.alamat_lengkap === "string" && df.alamat_lengkap.trim()) {
        alamatWarga = df.alamat_lengkap.trim();
      } else if (typeof df.alamat_warga === "string" && df.alamat_warga.trim()) {
        alamatWarga = df.alamat_warga.trim();
      } else if (typeof df.alamat_domisili === "string" && df.alamat_domisili.trim()) {
        alamatWarga = df.alamat_domisili.trim();
      } else if (typeof df.rt_rw === "string" || typeof df.dusun === "string" || typeof df.alamat_jalan === "string") {
        const jalan = df.alamat_jalan ? `${df.alamat_jalan}` : "";
        const rtrw = df.rt_rw ? `${df.rt_rw}` : "";
        const dusun = df.dusun ? (String(df.dusun).toLowerCase().startsWith("dusun") ? String(df.dusun) : `Dusun ${df.dusun}`) : "";
        alamatWarga = [jalan, rtrw, dusun, "Desa Bogem Kecamatan Kawedanan Kabupaten Magetan"].filter(Boolean).join(", ");
      }

      // Keperluan
      if (typeof df.keperluan === "string" && df.keperluan.trim()) {
        keperluanSurat = df.keperluan.trim();
      } else if (permohonan.jenis_surat) {
        keperluanSurat = `Persyaratan pembuatan / pengajuan ${permohonan.jenis_surat}`;
      }

      // Kalimat Keterangan Resmi Otomatis Berdasarkan Jenis Surat
      const jenisLower = (permohonan.jenis_surat || "").toLowerCase();
      if (jenisLower.includes("usaha") || jenisLower.includes("sku")) {
        const usaha = typeof df.nama_usaha === "string" ? df.nama_usaha.trim() : "";
        const jenisUsaha = typeof df.jenis_usaha === "string" ? df.jenis_usaha.trim() : "";
        const thn = typeof df.tahun_berdiri === "string" ? df.tahun_berdiri.trim() : "";
        const alamatUsaha = typeof df.alamat_usaha === "string" ? df.alamat_usaha.trim() : "";
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan mempunyai usaha ${usaha || "perdagangan/jasa"}${jenisUsaha ? ` di bidang ${jenisUsaha}` : ""}${thn ? ` sejak tahun ${thn}` : ""}${alamatUsaha ? ` yang berlokasi di ${alamatUsaha}` : " yang berlokasi di Desa Bogem"}.`;
      } else if (jenisLower.includes("domisili")) {
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan yang bertempat tinggal dan berdomisili di ${alamatWarga}.`;
      } else if (jenisLower.includes("tidak mampu") || jenisLower.includes("sktm")) {
        const ortu = typeof df.nama_kepala_keluarga === "string" ? df.nama_kepala_keluarga.trim() : "";
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan yang tergolong keluarga prasejahtera / ekonomi kurang mampu${ortu ? ` (Kepala Keluarga: ${ortu})` : ""}.`;
      } else if (jenisLower.includes("belum") && jenisLower.includes("nikah")) {
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan sampai saat surat keterangan ini diterbitkan berstatus belum pernah menikah (lajang).`;
      } else if (jenisLower.includes("skck")) {
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan selama menjadi warga berkelakuan baik serta tidak pernah tersangkut tindak pidana/kriminalitas.`;
      } else if (jenisLower.includes("kematian")) {
        const alm = typeof df.nama_almarhum === "string" ? df.nama_almarhum.trim() : "";
        const tglMeninggal = typeof df.tanggal_meninggal === "string" ? df.tanggal_meninggal.trim() : "";
        keteranganSurat = `Orang tersebut di atas adalah benar-benar pihak keluarga yang melaporkan kematian almarhum/almarhumah ${alm || "keluarga"}${tglMeninggal ? ` pada tanggal ${tglMeninggal}` : ""}.`;
      } else if (typeof df.keterangan_tambahan === "string" && df.keterangan_tambahan.trim()) {
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan berkelakuan baik. ${df.keterangan_tambahan.trim()}`;
      } else {
        keteranganSurat = `Orang tersebut di atas adalah benar-benar penduduk Desa Bogem Kecamatan Kawedanan Kabupaten Magetan dan berkelakuan baik.`;
      }
    }

    setSuratData({
      nomor_surat: initialNomor,
      tanggal_surat: `Bogem, ${formattedDate}`,
      judul_surat: judulSurat,
      nama_pejabat: pengaturan?.nama_pejabat || defaultPengaturanSurat.nama_pejabat,
      jabatan_pejabat: pengaturan?.jabatan_pejabat || defaultPengaturanSurat.jabatan_pejabat,
      alamat_pejabat: pengaturan?.alamat_pejabat || defaultPengaturanSurat.alamat_pejabat,
      nip_pejabat: pengaturan?.nip_pejabat ?? defaultPengaturanSurat.nip_pejabat,
      nama_warga: namaWarga,
      tempat_tanggal_lahir: ttlWarga,
      jenis_kelamin: jk,
      kebangsaan: "Indonesia",
      agama: agamaWarga,
      status_perkawinan: statusNikah,
      pekerjaan: kerjaan,
      nomor_ktp: nikWarga,
      alamat_warga: alamatWarga,
      keterangan: keteranganSurat,
      keperluan: keperluanSurat,
    });
  }, [isOpen, permohonan, pengaturan]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSuratData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrint = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const htmlContent = generateSuratHtml(suratData, cfg, origin);

    // Cetak menggunakan invisible iframe bersih
    let iframe = document.getElementById("surat-print-frame") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "surat-print-frame";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
    }

    const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 300);
    } else {
      window.print();
    }
  };

  const handleTerbitkanDanKirim = async () => {
    if (!suratData.nama_warga.trim()) {
      alert("Mohon lengkapi Nama Warga pemohon.");
      return;
    }
    if (!suratData.nomor_surat.trim()) {
      alert("Mohon tentukan Nomor Surat.");
      return;
    }

    setPublishing(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const html = generateSuratHtml(suratData, cfg, origin);
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
      const safeName = (suratData.nama_warga || "Warga").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `Surat_Keterangan_${safeName}.html`;
      const catatan = `Surat Keterangan resmi Nomor: ${suratData.nomor_surat} telah disahkan dan diterbitkan oleh Pemerintah Desa Bogem (${suratData.nama_pejabat || cfg.nama_pejabat}). Dokumen resmi siap dicetak/diunduh.`;

      if (permohonan) {
        // Update permohonan yang ada di Supabase
        const res = await updateStatusDanFileSurat(permohonan.id, {
          status: "SELESAI",
          file_surat_selesai: dataUrl,
          nama_file_selesai: fileName,
          catatan_admin: catatan,
        });

        if (!res.success) {
          alert(`Gagal menerbitkan surat: ${res.error || "Terjadi kendala koneksi database"}`);
          setPublishing(false);
          return;
        }
      } else {
        // Buat data permohonan baru untuk surat walk-in offline
        const cleanNik = suratData.nomor_ktp?.replace(/[^0-9]/g, "") || "3520000000000000";
        const paddedNik = cleanNik.padEnd(16, "0").slice(0, 16);
        const newTicket = await createPermohonanSurat({
          nik: paddedNik,
          nama_lengkap: suratData.nama_warga.trim(),
          no_whatsapp: "081200000000",
          jenis_surat: "Surat Keterangan (Walk-in Balai Desa)",
          data_formulir: {
            nomor_surat: suratData.nomor_surat,
            keperluan: suratData.keperluan,
            keterangan: suratData.keterangan,
            tempat_tgl_lahir: suratData.tempat_tanggal_lahir,
            pekerjaan: suratData.pekerjaan,
            agama: suratData.agama,
          },
        });

        if (newTicket.success && newTicket.data) {
          await updateStatusDanFileSurat(newTicket.data.id, {
            status: "SELESAI",
            file_surat_selesai: dataUrl,
            nama_file_selesai: fileName,
            catatan_admin: catatan,
          });
        }
      }

      // Otomatis menaikkan nomor buku agenda keluar (+1)
      const nextNomor = (cfg.nomor_urut_terakhir || defaultPengaturanSurat.nomor_urut_terakhir) + 1;
      const updatedCfg = {
        ...cfg,
        nomor_urut_terakhir: nextNomor,
      };
      await savePengaturanSurat(updatedCfg);
      if (onPengaturanUpdated) onPengaturanUpdated(updatedCfg);

      alert(
        `Berhasil! Surat Keterangan No: ${suratData.nomor_surat} telah berhasil diterbitkan dan langsung dikirim ke warga.`
      );

      if (onSuratDiterbitkan) onSuratDiterbitkan();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menerbitkan surat.");
    } finally {
      setPublishing(false);
    }
  };

  const handleIncrementAndSaveCounter = async () => {
    setSavingCounter(true);
    const nextNomor = (pengaturan?.nomor_urut_terakhir || defaultPengaturanSurat.nomor_urut_terakhir) + 1;
    const updated = {
      ...(pengaturan || defaultPengaturanSurat),
      nomor_urut_terakhir: nextNomor,
    };

    await savePengaturanSurat(updated);
    if (onPengaturanUpdated) onPengaturanUpdated(updated);
    setSavingCounter(false);
    setCounterSavedNotice(true);
    setTimeout(() => setCounterSavedNotice(false), 3000);
  };

  const cfg = pengaturan || defaultPengaturanSurat;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* MODAL WRAPPER */}
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[96vh] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Format & Cetak Surat Keterangan</span>
                {permohonan && (
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {permohonan.id}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tab switch on small screens */}
            <div className="flex lg:hidden bg-slate-200/70 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === "form" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600"
                }`}
              >
                Form Data
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === "preview" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600"
                }`}
              >
                Pratinjau Surat
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-[#004329] hover:bg-[#003520] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Dokumen (A4)</span>
              <span className="sm:hidden">Cetak</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SPLIT VIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* LEFT: FORM DATA (COL 5) */}
          <div
            className={`lg:col-span-5 p-5 sm:p-6 overflow-y-auto border-r border-slate-100 space-y-6 max-h-[calc(96vh-140px)] ${
              activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Quick Helper */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                Teks yang Anda ketik pada kolom di bawah akan langsung muncul secara otomatis di lembar pratinjau surat sebelah kanan.
              </p>
            </div>

            {/* BLOCK 1: NOMOR & PEJABAT */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-700" />
                <span>Nomor Surat & Tanggal</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">Judul Surat Kedinasan</label>
                <input
                  type="text"
                  name="judul_surat"
                  value={suratData.judul_surat || "SURAT KETERANGAN"}
                  onChange={handleInputChange}
                  placeholder="SURAT KETERANGAN"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Nomor Surat</label>
                  <input
                    type="text"
                    name="nomor_surat"
                    value={suratData.nomor_surat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Tanggal Surat</label>
                  <input
                    type="text"
                    name="tanggal_surat"
                    value={suratData.tanggal_surat}
                    onChange={handleInputChange}
                    placeholder="Bogem, 28 Agustus 2026"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Buku Agenda Terakhir:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    No. {cfg.nomor_urut_terakhir}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleIncrementAndSaveCounter}
                    disabled={savingCounter}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                  >
                    {savingCounter ? "Menyimpan..." : "+1 Naikkan Nomor Agenda Buku"}
                  </button>
                  {counterSavedNotice && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Tersimpan!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* BLOCK 2: PEJABAT YANG BERTANDA TANGAN */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pihak yang Bertanda Tangan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Nama Pejabat</label>
                  <input
                    type="text"
                    name="nama_pejabat"
                    value={suratData.nama_pejabat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    name="jabatan_pejabat"
                    value={suratData.jabatan_pejabat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700">NIP Pejabat</label>
                  <input
                    type="text"
                    name="nip_pejabat"
                    value={suratData.nip_pejabat || ""}
                    onChange={handleInputChange}
                    placeholder="Contoh: 197408222006042016"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700">Alamat Instansi Pejabat</label>
                  <input
                    type="text"
                    name="alamat_pejabat"
                    value={suratData.alamat_pejabat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* BLOCK 3: 11 POIN DATA WARGA */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>11 Poin Data Warga Pemohon</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">1. Nama Lengkap</label>
                  <input
                    type="text"
                    name="nama_warga"
                    value={suratData.nama_warga}
                    onChange={handleInputChange}
                    placeholder="Contoh: Yusa Eka Setiawan"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">2. Tempat, Tanggal Lahir</label>
                  <input
                    type="text"
                    name="tempat_tanggal_lahir"
                    value={suratData.tempat_tanggal_lahir}
                    onChange={handleInputChange}
                    placeholder="Contoh: Magetan, 14 Mei 1999"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">3. Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      value={suratData.jenis_kelamin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">4. Kebangsaan</label>
                    <input
                      type="text"
                      name="kebangsaan"
                      value={suratData.kebangsaan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">5. Agama</label>
                    <select
                      name="agama"
                      value={suratData.agama}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Khonghucu">Khonghucu</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">6. Status Perkawinan</label>
                    <select
                      name="status_perkawinan"
                      value={suratData.status_perkawinan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Belum Kawin">Belum Kawin</option>
                      <option value="Kawin">Kawin</option>
                      <option value="Cerai Hidup">Cerai Hidup</option>
                      <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">7. Pekerjaan</label>
                  <input
                    type="text"
                    name="pekerjaan"
                    value={suratData.pekerjaan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Belum / Tidak Bekerja / Wiraswasta"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">8. Nomor KTP (NIK)</label>
                  <input
                    type="text"
                    name="nomor_ktp"
                    value={suratData.nomor_ktp}
                    onChange={handleInputChange}
                    placeholder="16 digit NIK"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">9. Alamat Desa/Kelurahan</label>
                  <textarea
                    name="alamat_warga"
                    rows={2}
                    value={suratData.alamat_warga}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">10. Keterangan</label>
                  <textarea
                    name="keterangan"
                    rows={2}
                    value={suratData.keterangan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">11. Keperluan</label>
                  <input
                    type="text"
                    name="keperluan"
                    value={suratData.keperluan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Persyaratan Melamar Pekerjaan"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW A4 SHEET (COL 7) */}
          <div
            className={`lg:col-span-7 bg-slate-200/60 p-4 sm:p-6 overflow-y-auto max-h-[calc(96vh-140px)] flex justify-center items-start ${
              activeTab === "form" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* PAPER CONTAINER (SURAT RESMI A4) */}
            <div
              id="surat-keterangan-print"
              className="bg-white text-black shadow-xl border border-slate-300 w-full max-w-[210mm] min-h-[297mm] p-[16mm] select-text text-[12pt] leading-[1.35] relative"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              {/* KOP SURAT (FONT ARIAL SESUAI SURAT RESMI PEMKAB MAGETAN) */}
              <div className="w-full">
                <div className="flex items-center justify-between">
                  {/* LOGO MAGETAN RESMI (MONOKROM SESUAI TEMPLATE RESMI) */}
                  <div className="w-[75px] flex-shrink-0 flex items-center justify-center">
                    <img
                      src={LOGO_MAGETAN_SURAT_BASE64}
                      alt="Logo Kabupaten Magetan"
                      className="w-[68px] h-auto object-contain"
                    />
                  </div>

                  {/* KOP TEXT (ARIAL) */}
                  <div className="text-center flex-1 px-2 font-sans">
                    <h2 className="text-[13.9pt] font-normal tracking-[0.22em] uppercase leading-tight text-black">
                      {cfg.nama_instansi || "PEMERINTAH KABUPATEN MAGETAN"}
                    </h2>
                    <h3 className="text-[16pt] font-bold tracking-[0.04em] uppercase leading-tight text-black mt-0.5">
                      {cfg.nama_kecamatan || "KECAMATAN KAWEDANAN"}
                    </h3>
                    <h1 className="text-[16pt] font-bold tracking-[0.05em] uppercase leading-tight text-black mt-0.5">
                      {cfg.nama_desa || "DESA BOGEM"}
                    </h1>
                    <p className="text-[11.5pt] font-normal leading-tight text-black mt-1">
                      {cfg.alamat_kantor || "Jl. Bhakti Mulya No.241"} telp : {cfg.telepon_kantor || "081231400990"}
                    </p>
                    <p className="text-[11.5pt] font-normal leading-tight text-black mt-0.5">
                      Email : <span className="underline">{cfg.email_kantor || "desabogemjaya@gmail.com"}</span> , Kodepos {cfg.kodepos || "63382"}
                    </p>
                  </div>

                  {/* SPACER FOR BALANCED CENTER */}
                  <div className="w-[75px] flex-shrink-0 hidden sm:block" />
                </div>

                {/* DOUBLE LINE UNDER KOP */}
                <div className="border-t border-black border-b-[2.2px] border-b-black h-[3px] mt-1 mb-5" />
              </div>

              {/* KONTEN SURAT (TIMES NEW ROMAN 12PT INDENT 12MM / PX-8) */}
              <div className="px-6 sm:px-8 text-[12pt] text-black leading-[1.35]">
                {/* JUDUL SURAT */}
                <div className="text-center my-5">
                  <h2 className="text-[12pt] font-bold uppercase underline tracking-[0.02em] inline-block">
                    {suratData.judul_surat || "SURAT KETERANGAN"}
                  </h2>
                  <p className="text-[12pt] mt-1 font-normal">
                    Nomor: {suratData.nomor_surat || "474 / 196 / 403.405.13 / 2026"}
                  </p>
                </div>

                {/* PEMBUKA PEJABAT */}
                <div className="mb-1 text-[12pt]">
                  <p>Yang bertanda tangan di bawah ini :</p>
                </div>
                <div className="pl-9 space-y-0.5 mb-4 text-[12pt]">
                  <div className="grid grid-cols-[70px_15px_1fr]">
                    <span>Nama</span>
                    <span className="text-center">:</span>
                    <span>{suratData.nama_pejabat || cfg.nama_pejabat}</span>
                  </div>
                  <div className="grid grid-cols-[70px_15px_1fr]">
                    <span>Jabatan</span>
                    <span className="text-center">:</span>
                    <span>{suratData.jabatan_pejabat || cfg.jabatan_pejabat}</span>
                  </div>
                  <div className="grid grid-cols-[70px_15px_1fr]">
                    <span>Alamat</span>
                    <span className="text-center">:</span>
                    <span>{suratData.alamat_pejabat || cfg.alamat_pejabat}</span>
                  </div>
                </div>

                {/* DENGAN INI MENERANGKAN */}
                <div className="mb-1.5 text-[12pt]">
                  <p>Dengan ini menerangkan dengan sesungguhnya bahwa :</p>
                </div>

                {/* 11 POIN TABEL */}
                <div className="space-y-[3px] mb-5 text-[12pt]">
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">1</span>
                    <span>Nama</span>
                    <span className="text-center">:</span>
                    <span>{suratData.nama_warga || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">2</span>
                    <span>Tempat, tanggal lahir</span>
                    <span className="text-center">:</span>
                    <span>{suratData.tempat_tanggal_lahir || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">3</span>
                    <span>Jenis kelamin</span>
                    <span className="text-center">:</span>
                    <span>{suratData.jenis_kelamin || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">4</span>
                    <span>Kebangsaan</span>
                    <span className="text-center">:</span>
                    <span>{suratData.kebangsaan || "Indonesia"}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">5</span>
                    <span>Agama</span>
                    <span className="text-center">:</span>
                    <span>{suratData.agama || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">6</span>
                    <span>Status Perkawinan</span>
                    <span className="text-center">:</span>
                    <span>{suratData.status_perkawinan || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">7</span>
                    <span>Pekerjaan</span>
                    <span className="text-center">:</span>
                    <span>{suratData.pekerjaan || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">8</span>
                    <span>Nomor KTP</span>
                    <span className="text-center">:</span>
                    <span>{suratData.nomor_ktp || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">9</span>
                    <span>Alamat Desa/Kelurahan</span>
                    <span className="text-center">:</span>
                    <span>{suratData.alamat_warga || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">10</span>
                    <span>Keterangan</span>
                    <span className="text-center">:</span>
                    <span className="text-justify">{suratData.keterangan || ""}</span>
                  </div>
                  <div className="grid grid-cols-[28px_175px_15px_1fr] py-[1px]">
                    <span className="pl-2.5">11</span>
                    <span>Keperluan</span>
                    <span className="text-center">:</span>
                    <span className="text-justify">{suratData.keperluan || ""}</span>
                  </div>
                </div>

                {/* PENUTUP */}
                <div className="my-5 text-[12pt] text-justify leading-[1.45] indent-10">
                  <p>
                    Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya
                  </p>
                </div>

                {/* TANDA TANGAN (BOTTOM RIGHT) */}
                <div className="flex justify-end text-[12pt]">
                  <div className="w-[250px] text-center space-y-0.5 leading-[1.35]">
                    <p>{suratData.tanggal_surat || "Bogem, 28 Agustus 2026"}</p>
                    <p>{suratData.jabatan_pejabat || cfg.jabatan_pejabat}</p>
                    
                    {/* RUANG TANDA TANGAN */}
                    <div className="h-[75px]" />

                    <p className="font-bold underline">
                      {suratData.nama_pejabat || cfg.nama_pejabat}
                    </p>
                    {suratData.nip_pejabat ? (
                      <p className="text-[12pt] mt-0.5">NIP.{suratData.nip_pejabat}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Format kedinasan resmi A4 Pemerintah Desa Bogem.</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>🖨️ Cetak / Preview</span>
            </button>
            <button
              type="button"
              disabled={publishing}
              onClick={handleTerbitkanDanKirim}
              className="inline-flex items-center space-x-1.5 bg-[#004329] hover:bg-[#003520] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menerbitkan Surat...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{permohonan ? "🚀 Terbitkan & Kirim ke Warga" : "💾 Simpan ke Arsip & Terbitkan"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
