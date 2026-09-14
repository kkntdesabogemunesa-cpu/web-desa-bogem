export type StatusSurat = "MENUNGGU" | "DIPROSES" | "SELESAI" | "DITOLAK";

export type FieldType = "text" | "number" | "date" | "textarea";

export interface FormFieldConfig {
  id: string; // unique key, e.g. "nama_usaha"
  label: string; // e.g. "Nama Usaha / Toko"
  tipe: FieldType; // "text" | "number" | "date" | "textarea"
  placeholder?: string;
  wajib: boolean;
}

export interface OpsiSurat {
  id: string;
  nama_surat: string;
  deskripsi: string;
  syarat: string;
  // Kolom-kolom formulir khusus yang diatur oleh Admin
  custom_fields?: FormFieldConfig[];
}

export const defaultOpsiSuratList: OpsiSurat[] = [
  {
    id: "opsi-1",
    nama_surat: "Surat Keterangan Usaha (SKU)",
    deskripsi: "Untuk legalitas pembukaan rekening usaha, pengajuan pinjaman/KUR, atau verifikasi UMKM.",
    syarat: "Fotokopi KTP & KK, Nama Usaha, Jenis Usaha, dan Alamat Lokasi Usaha.",
    custom_fields: [
      { id: "nama_usaha", label: "Nama Usaha / Toko", tipe: "text", placeholder: "Contoh: Warung Makan Berkah", wajib: true },
      { id: "jenis_usaha", label: "Bidang / Jenis Usaha", tipe: "text", placeholder: "Contoh: Kuliner / Perdagangan / Jasa", wajib: true },
      { id: "alamat_usaha", label: "Alamat Tempat Usaha", tipe: "text", placeholder: "Contoh: Jl. Raya Bogem No. 12, RT 02/01", wajib: true },
      { id: "tahun_berdiri", label: "Mulai Usaha Sejak Tahun", tipe: "text", placeholder: "Contoh: 2021", wajib: false },
    ],
  },
  {
    id: "opsi-2",
    nama_surat: "Surat Keterangan Domisili",
    deskripsi: "Surat bukti keterangan tempat tinggal resmi pemohon di wilayah Desa Bogem.",
    syarat: "Fotokopi KTP, KK, dan Alamat Tempat Tinggal Saat Ini.",
    custom_fields: [],
  },
  {
    id: "opsi-3",
    nama_surat: "Surat Keterangan Tidak Mampu (SKTM)",
    deskripsi: "Untuk permohonan beasiswa pendidikan, keringanan biaya rumah sakit, atau bansos.",
    syarat: "Fotokopi KTP, KK, dan Keterangan Keperluan Khusus.",
    custom_fields: [
      { id: "nama_kepala_keluarga", label: "Nama Kepala Keluarga / Orang Tua", tipe: "text", placeholder: "Nama kepala keluarga sesuai KK", wajib: false },
      { id: "penghasilan_per_bulan", label: "Rata-Rata Penghasilan per Bulan", tipe: "text", placeholder: "Contoh: Rp 800.000 / bulan", wajib: false },
    ],
  },
  {
    id: "opsi-4",
    nama_surat: "Surat Pengantar SKCK",
    deskripsi: "Surat rekomendasi pengantar dari desa untuk pembuatan SKCK di Polsek Kawedanan/Polres.",
    syarat: "Fotokopi KTP, KK, dan Pas Foto Berwarna.",
    custom_fields: [],
  },
  {
    id: "opsi-5",
    nama_surat: "Surat Keterangan Belum Menikah",
    deskripsi: "Keterangan status lajang/belum pernah menikah untuk persyaratan kerja atau pernikahan.",
    syarat: "Fotokopi KTP dan KK.",
    custom_fields: [],
  },
  {
    id: "opsi-6",
    nama_surat: "Surat Keterangan Kematian",
    deskripsi: "Surat pengantar pelaporan kematian untuk pencatatan kependudukan.",
    syarat: "Surat Keterangan Bidan/RS, KTP & KK.",
    custom_fields: [
      { id: "nama_almarhum", label: "Nama Lengkap Almarhum/Almarhumah", tipe: "text", placeholder: "Nama almarhum sesuai KTP/KK", wajib: true },
      { id: "nik_almarhum", label: "NIK Almarhum", tipe: "text", placeholder: "16 digit NIK almarhum", wajib: true },
      { id: "tanggal_meninggal", label: "Tanggal Meninggal Dunia", tipe: "date", wajib: true },
      { id: "tempat_meninggal", label: "Tempat Meninggal", tipe: "text", placeholder: "Contoh: Rumah Duka Desa Bogem / RSUD Sayidiman", wajib: true },
      { id: "sebab_kematian", label: "Penyebab Meninggal Dunia", tipe: "text", placeholder: "Contoh: Sakit / Usia Lanjut", wajib: true },
      { id: "hubungan_pelapor", label: "Hubungan Pemohon dengan Jenazah", tipe: "text", placeholder: "Contoh: Anak Kandung / Suami / Istri", wajib: true },
    ],
  },
  {
    id: "opsi-7",
    nama_surat: "Surat Keterangan Umum",
    deskripsi: "Surat keterangan resmi dari Pemerintah Desa Bogem untuk berbagai keperluan administrasi warga.",
    syarat: "Fotokopi KTP dan Kartu Keluarga (KK).",
    custom_fields: [],
  },
];

export interface PermohonanSurat {
  id: string; // Kode Tiket e.g. "SRT-202508-4921"
  user_id?: string;
  opsi_surat_id?: string;
  nik: string;
  nama_lengkap: string;
  no_whatsapp: string;
  email?: string;
  jenis_surat: string;
  // Dynamic form values submitted by citizen
  data_formulir: Record<string, unknown>;
  status: StatusSurat;
  file_surat_selesai?: string; // Data URL or URL of the uploaded finished letter file
  nama_file_selesai?: string; // e.g. "Surat_Keterangan_Usaha_Yusa.pdf"
  catatan_admin?: string;
  created_at: string;
  updated_at: string;
}

export type CreatePermohonanInput = Omit<
  PermohonanSurat,
  "id" | "status" | "file_surat_selesai" | "nama_file_selesai" | "catatan_admin" | "created_at" | "updated_at"
>;

export interface PengaturanSurat {
  nama_instansi: string; // e.g. "PEMERINTAH KABUPATEN MAGETAN"
  nama_kecamatan: string; // e.g. "KECAMATAN KAWEDANAN"
  nama_desa: string; // e.g. "DESA BOGEM"
  alamat_kantor: string; // e.g. "Jl. Bhakti Mulya No.241"
  telepon_kantor: string; // e.g. "081231400990"
  email_kantor: string; // e.g. "desabogemjaya@gmail.com"
  kodepos: string; // e.g. "63382"
  nama_pejabat: string; // e.g. "TUT WARIYANI, S.KM"
  jabatan_pejabat: string; // e.g. "Pj Kepala Desa Bogem"
  nip_pejabat: string; // e.g. "197408222006042016"
  alamat_pejabat: string; // e.g. "Desa Bogem Kecamatan Kawedanan Kabupaten Magetan"
  kode_klasifikasi: string; // e.g. "474"
  kode_wilayah: string; // e.g. "403.405.13"
  nomor_urut_terakhir: number; // e.g. 196
}

export const defaultPengaturanSurat: PengaturanSurat = {
  nama_instansi: "PEMERINTAH KABUPATEN MAGETAN",
  nama_kecamatan: "KECAMATAN KAWEDANAN",
  nama_desa: "DESA BOGEM",
  alamat_kantor: "Jl. Bhakti Mulya No.241",
  telepon_kantor: "081231400990",
  email_kantor: "desabogemjaya@gmail.com",
  kodepos: "63382",
  nama_pejabat: "TUT WARIYANI, S.KM",
  jabatan_pejabat: "Pj Kepala Desa Bogem",
  nip_pejabat: "197408222006042016",
  alamat_pejabat: "Desa Bogem Kecamatan Kawedanan Kabupaten Magetan",
  kode_klasifikasi: "474",
  kode_wilayah: "403.405.13",
  nomor_urut_terakhir: 196,
};

export interface DataSuratKeterangan {
  // Informasi Surat
  nomor_surat: string;
  tanggal_surat: string;
  judul_surat?: string; // e.g. "SURAT KETERANGAN"

  // Pihak yang bertanda tangan
  nama_pejabat: string;
  jabatan_pejabat: string;
  alamat_pejabat: string;
  nip_pejabat?: string;

  // 11 Poin Data Warga
  nama_warga: string;
  tempat_tanggal_lahir: string;
  jenis_kelamin: string;
  kebangsaan: string;
  agama: string;
  status_perkawinan: string;
  pekerjaan: string;
  nomor_ktp: string;
  alamat_warga: string;
  keterangan: string;
  keperluan: string;
}

