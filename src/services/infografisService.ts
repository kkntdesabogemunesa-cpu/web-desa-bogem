import { supabase } from "@/lib/supabase";
import { InfografisData, ItemOrganisasi } from "@/types/infografis";

export const defaultOrganisasiList: ItemOrganisasi[] = [
  {
    id: "bpd",
    nama: "Badan Permusyawaratan Desa",
    singkatan: "BPD",
    ketua: "Bpk. Bambang Sutrisno",
    jumlah_anggota: "9 Orang",
    kategori: "Permusyawaratan & Pengawasan",
    deskripsi: "Menampung dan menyalurkan aspirasi masyarakat desa serta mengawasi pelaksanaan APBDes dan kinerja Pemdes.",
    kontak: "-",
  },
  {
    id: "lpmd",
    nama: "Lembaga Pemberdayaan Masyarakat Desa",
    singkatan: "LPMD",
    ketua: "Bpk. Sukarman",
    jumlah_anggota: "12 Orang",
    kategori: "Pembangunan & Partisipasi",
    deskripsi: "Membantu pemerintah desa menyusun rencana dan menggerakkan partisipasi swadaya gotong royong masyarakat.",
    kontak: "-",
  },
  {
    id: "pkk",
    nama: "Tim Penggerak PKK Desa Bogem",
    singkatan: "PKK",
    ketua: "Ibu Sri Wahyuni",
    jumlah_anggota: "35 Kader",
    kategori: "Pemberdayaan Keluarga",
    deskripsi: "Menggerakkan 10 program pokok PKK, pembinaan keluarga sejahtera, posyandu balita-lansia, dan ketahanan pangan keluarga.",
    kontak: "-",
  },
  {
    id: "karang-taruna",
    nama: "Karang Taruna Satria Muda",
    singkatan: "Karang Taruna",
    ketua: "Dimas Anggara",
    jumlah_anggota: "28 Pemuda",
    kategori: "Kepemudaan & Olahraga",
    deskripsi: "Wadah pengembangan potensi pemuda desa dalam olahraga, kepemimpinan, kepedulian sosial, serta kegiatan desa.",
    kontak: "-",
  },
  {
    id: "satlinmas",
    nama: "Satuan Perlindungan Masyarakat",
    singkatan: "Satlinmas",
    ketua: "Bpk. Suparno",
    jumlah_anggota: "20 Anggota",
    kategori: "Ketertiban & Keamanan",
    deskripsi: "Membantu menjaga ketenteraman, ketertiban umum masyarakat desa, serta kesiapsiagaan penanggulangan bencana.",
    kontak: "-",
  },
  {
    id: "posyandu",
    nama: "Kader Posyandu & Kesehatan Desa",
    singkatan: "Posyandu",
    ketua: "Ibu Endang Sulistyo",
    jumlah_anggota: "24 Kader",
    kategori: "Kesehatan Masyarakat",
    deskripsi: "Layanan rutin penimbangan balita, pemantauan gizi pencegahan stunting, imunisasi, dan pemeriksaan kesehatan lansia.",
    kontak: "-",
  },
];

export const defaultInfografisData: InfografisData = {
  demografi: {
    total_penduduk: 3620,
    pria: 1790,
    wanita: 1830,
    kepala_keluarga: 1080,
    jumlah_dusun: 4,
    jumlah_rt: 18,
    jumlah_rw: 4,
    luas_wilayah: 245,
  },
  pekerjaan: [
    { nama: "Petani & Pekebun", persen: 45, count: "1.629 Warga", color: "bg-emerald-600" },
    { nama: "Wiraswasta / UMKM", persen: 23, count: "832 Warga", color: "bg-teal-600" },
    { nama: "Karyawan Swasta", persen: 16, count: "579 Warga", color: "bg-[#004329]" },
    { nama: "PNS / TNI / Polri", persen: 8, count: "290 Warga", color: "bg-emerald-500" },
    { nama: "Lainnya / Jasa", persen: 8, count: "290 Warga", color: "bg-slate-500" },
  ],
  pendidikan: [
    { tingkat: "SD / Sederajat", persen: 26, count: "941 Warga" },
    { tingkat: "SMP / Sederajat", persen: 31, count: "1.122 Warga" },
    { tingkat: "SMA / SMK", persen: 32, count: "1.158 Warga" },
    { tingkat: "Diploma / Sarjana (S1/S2)", persen: 11, count: "399 Warga" },
  ],
  organisasi: defaultOrganisasiList,
  apbdes: {
    tahun_anggaran: "2024",
    pendapatan_total: 1520400000,
    pendapatan_rincian: [
      { nama: "Dana Desa (DDS)", nominal: 850000000 },
      { nama: "Alokasi Dana Desa (ADD)", nominal: 420400000 },
      { nama: "Pendapatan Asli Desa (PADes)", nominal: 150000000 },
      { nama: "Bagi Hasil Pajak & Retribusi (PBH)", nominal: 100000000 },
    ],
    belanja_total: 1445100000,
    belanja_rincian: [
      { nama: "Bidang Pembangunan Desa", nominal: 680000000 },
      { nama: "Bidang Penyelenggaraan Pemerintahan", nominal: 450100000 },
      { nama: "Bidang Pembinaan Kemasyarakatan", nominal: 165000000 },
      { nama: "Bidang Pemberdayaan Masyarakat", nominal: 110000000 },
      { nama: "Bidang Penanggulangan Bencana & Darurat", nominal: 40000000 },
    ],
    surplus_defisit: 75300000,
    silpa: 75300000,
  },
  idm: {
    tahun: 2025,
    skorTotal: 0.8542,
    status: "DESA MANDIRI",
    iks: { skor: 0.892, label: "Sangat Baik" },
    ike: { skor: 0.785, label: "Baik (Berkembang)" },
    ikl: { skor: 0.886, label: "Sangat Baik" },
    riwayat: [
      { tahun: 2021, skor: 0.712, status: "Desa Berkembang" },
      { tahun: 2023, skor: 0.798, status: "Desa Maju" },
      { tahun: 2025, skor: 0.8542, status: "Desa Mandiri" },
    ],
    faktor_pendukung: [
      "Aksesibilitas jaringan internet & layanan digital desa terintegrasi.",
      "Pasar desa dan pusat promosi UMKM lokal aktif.",
      "Fasilitas kesehatan dan tenaga medis mudah dijangkau warga.",
      "Sistem mitigasi bencana alam dan kebersihan lingkungan terjaga.",
    ],
  },
  updated_at: new Date().toISOString(),
};

export async function fetchInfografisData(): Promise<InfografisData> {
  try {
    if (!supabase) return defaultInfografisData;

    const { data, error } = await supabase
      .from("infografis")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data) {
      return defaultInfografisData;
    }

    return {
      demografi: data.demografi || defaultInfografisData.demografi,
      pekerjaan: data.pekerjaan || defaultInfografisData.pekerjaan,
      pendidikan: data.pendidikan || defaultInfografisData.pendidikan,
      organisasi: data.organisasi && Array.isArray(data.organisasi) && data.organisasi.length > 0
        ? data.organisasi
        : defaultOrganisasiList,
      apbdes: data.apbdes || defaultInfografisData.apbdes,
      idm: data.idm || defaultInfografisData.idm,
      updated_at: data.updated_at || defaultInfografisData.updated_at,
    };
  } catch (err) {
    console.error("fetchInfografisData error:", err);
    return defaultInfografisData;
  }
}

export async function updateInfografisData(
  newData: Partial<InfografisData>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const current = await fetchInfografisData();
    const updatedPayload = {
      id: "main",
      demografi: newData.demografi || current.demografi,
      pekerjaan: newData.pekerjaan !== undefined ? newData.pekerjaan : current.pekerjaan,
      pendidikan: newData.pendidikan !== undefined ? newData.pendidikan : current.pendidikan,
      organisasi: newData.organisasi !== undefined ? newData.organisasi : (current.organisasi || defaultOrganisasiList),
      apbdes: newData.apbdes || current.apbdes,
      idm: newData.idm || current.idm,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("infografis").upsert(updatedPayload);

    if (error) {
      console.error("updateInfografisData error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui infografis.";
    return { success: false, error: msg };
  }
}
