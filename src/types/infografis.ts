export interface StatDemografi {
  total_penduduk: number;
  pria: number;
  wanita: number;
  kepala_keluarga: number;
  jumlah_dusun: number;
  jumlah_rt: number;
  jumlah_rw: number;
  luas_wilayah: number; // Hektar
}

export interface ItemPekerjaan {
  nama: string;
  persen: number;
  count: string;
  color?: string;
}

export interface ItemPendidikan {
  tingkat: string;
  persen: number;
  count: string;
}

export interface ItemOrganisasi {
  id: string;
  nama: string;
  singkatan: string;
  ketua: string;
  jumlah_anggota: string;
  kategori: string;
  deskripsi: string;
  kontak?: string;
}

export interface ItemRincianAnggaran {
  nama: string;
  nominal: number | string;
}

export interface StatAPBDes {
  tahun_anggaran: string;
  pendapatan_total: number;
  pendapatan_rincian: ItemRincianAnggaran[];
  belanja_total: number;
  belanja_rincian: ItemRincianAnggaran[];
  surplus_defisit: number;
  // Pembiayaan Desa (SiLPA Tahun Sebelumnya & Pengeluaran Pembiayaan)
  pembiayaan_penerimaan?: number;
  pembiayaan_penerimaan_rincian?: ItemRincianAnggaran[];
  pembiayaan_pengeluaran?: number;
  pembiayaan_pengeluaran_rincian?: ItemRincianAnggaran[];
  pembiayaan_netto?: number;
  silpa: number; // Sisa Lebih Perhitungan Anggaran Tahun Berjalan (Surplus/Defisit + Pembiayaan Netto)
}

export interface ItemRiwayatIDM {
  tahun: number;
  skor: number;
  status: string;
}

export interface StatIDM {
  tahun: number;
  skorTotal: number;
  status: string;
  iks: { skor: number; label: string };
  ike: { skor: number; label: string };
  ikl: { skor: number; label: string };
  riwayat: ItemRiwayatIDM[];
  faktor_pendukung: string[];
}

export interface InfografisData {
  demografi: StatDemografi;
  pekerjaan?: ItemPekerjaan[];
  pendidikan?: ItemPendidikan[];
  organisasi?: ItemOrganisasi[];
  apbdes: StatAPBDes;
  idm: StatIDM;
  updated_at?: string;
}
