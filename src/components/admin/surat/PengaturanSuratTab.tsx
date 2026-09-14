"use client";

import { useState, useEffect } from "react";
import { PengaturanSurat, defaultPengaturanSurat } from "@/types/surat";
import { savePengaturanSurat, formatNomorSurat } from "@/services/suratService";
import { Save, CheckCircle2, Building, UserCheck, Hash, Info, RotateCcw } from "lucide-react";

interface PengaturanSuratTabProps {
  initialData: PengaturanSurat;
  onSaved?: (updated: PengaturanSurat) => void;
}

export default function PengaturanSuratTab({ initialData, onSaved }: PengaturanSuratTabProps) {
  const [form, setForm] = useState<PengaturanSurat>(initialData || defaultPengaturanSurat);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const res = await savePengaturanSurat(form);
    setSaving(false);

    if (res.success) {
      setFeedback("Pengaturan pejabat & format surat berhasil disimpan!");
      if (onSaved) onSaved(form);
      setTimeout(() => setFeedback(null), 3500);
    } else {
      alert(`Gagal menyimpan: ${res.error || "Terjadi kesalahan"}`);
    }
  };

  const handleReset = () => {
    if (confirm("Kembalikan pengaturan surat ke standar bawaan Desa Bogem?")) {
      setForm(defaultPengaturanSurat);
    }
  };

  const tahunSekarang = new Date().getFullYear();
  const previewNomor = formatNomorSurat(form, form.nomor_urut_terakhir, tahunSekarang);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-700" />
                <span>Pengaturan Pejabat & Format Kop Surat</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Data ini akan otomatis muncul pada kop surat dan tanda tangan setiap kali Anda mencetak Surat Keterangan. Jika ada pergantian Kepala Desa/Pj atau perubahan nomor surat, Anda dapat mengubahnya di sini kapan saja.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar Desa Bogem</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: PEJABAT PENANDATANGAN */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>1. Pejabat Penandatangan Surat</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Pejabat Penandatangan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_pejabat"
                  value={form.nama_pejabat}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: TUT WARIYANI, S.KM"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
                <span className="text-[11px] text-slate-400">Nama lengkap beserta gelar resmi.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Jabatan Pejabat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jabatan_pejabat"
                  value={form.jabatan_pejabat}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Pj Kepala Desa Bogem / Kepala Desa Bogem"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
                <span className="text-[11px] text-slate-400">Contoh: &quot;Pj Kepala Desa Bogem&quot; atau &quot;Kepala Desa Bogem&quot;.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  NIP Pejabat (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  name="nip_pejabat"
                  value={form.nip_pejabat || ""}
                  onChange={handleChange}
                  placeholder="Contoh: 197408222006042016"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium font-mono"
                />
                <span className="text-[11px] text-slate-400">Kosongkan jika Kepala Desa terpilih/non-PNS.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Alamat Kedudukan Pejabat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="alamat_pejabat"
                  value={form.alamat_pejabat}
                  onChange={handleChange}
                  required
                  placeholder="Desa Bogem Kecamatan Kawedanan Kabupaten Magetan"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
                <span className="text-[11px] text-slate-400">Muncul pada kalimat &quot;Yang bertanda tangan di bawah ini...&quot;.</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: FORMAT PENOMORAN SURAT */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              <Hash className="w-4 h-4 text-emerald-700" />
              <span>2. Format Penomoran Surat Resmi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kode Klasifikasi Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_klasifikasi"
                  value={form.kode_klasifikasi}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: 474"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono font-medium"
                />
                <span className="text-[11px] text-slate-400">Kode klasifikasi tata persuratan kependudukan (default: 474).</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nomor Urut Terakhir <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="nomor_urut_terakhir"
                  value={form.nomor_urut_terakhir}
                  onChange={handleChange}
                  required
                  min={1}
                  placeholder="Contoh: 196"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono font-bold text-emerald-800"
                />
                <span className="text-[11px] text-slate-400">Nomor buku agenda surat keluar terakhir.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kode Wilayah Desa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_wilayah"
                  value={form.kode_wilayah}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: 403.405.13"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono font-medium"
                />
                <span className="text-[11px] text-slate-400">Kode wilayah Desa Bogem (403.405.13).</span>
              </div>
            </div>

            {/* Preview Nomor */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Hasil Format Nomor Surat di Dokumen:</span>
                  <span className="text-sm sm:text-base font-bold font-mono text-slate-900 tracking-wider">
                    Nomor: {previewNomor}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 self-start sm:self-center font-medium">
                Tahun otomatis: {tahunSekarang}
              </span>
            </div>
          </div>

          {/* SECTION 3: KOP SURAT PEMERINTAH */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 uppercase tracking-wider border-b border-slate-100 pb-2">
              <Building className="w-4 h-4 text-emerald-700" />
              <span>3. Identitas Lembaga / Kop Surat Resmi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Instansi Atas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_instansi"
                  value={form.nama_instansi}
                  onChange={handleChange}
                  required
                  placeholder="PEMERINTAH KABUPATEN MAGETAN"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_kecamatan"
                  value={form.nama_kecamatan}
                  onChange={handleChange}
                  required
                  placeholder="KECAMATAN KAWEDANAN"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Desa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_desa"
                  value={form.nama_desa}
                  onChange={handleChange}
                  required
                  placeholder="DESA BOGEM"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  Alamat Kantor Balai Desa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="alamat_kantor"
                  value={form.alamat_kantor}
                  onChange={handleChange}
                  required
                  placeholder="Jl. Bhakti Mulya No.241"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Telepon Kantor
                </label>
                <input
                  type="text"
                  name="telepon_kantor"
                  value={form.telepon_kantor}
                  onChange={handleChange}
                  placeholder="081231400990"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kode Pos
                </label>
                <input
                  type="text"
                  name="kodepos"
                  value={form.kodepos}
                  onChange={handleChange}
                  placeholder="63382"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">
                  Email Kantor Desa
                </label>
                <input
                  type="email"
                  name="email_kantor"
                  value={form.email_kantor}
                  onChange={handleChange}
                  placeholder="desabogemjaya@gmail.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-[#004329] hover:bg-[#003520] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Pengaturan Surat"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
