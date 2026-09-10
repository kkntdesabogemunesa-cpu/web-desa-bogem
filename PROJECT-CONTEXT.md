# PROJECT CONTEXT: WEBSITE RESMI DESA BOGEM
**Kecamatan Kawedanan, Kabupaten Magetan, Provinsi Jawa Timur**

Dokumen ini menyajikan ringkasan teknis dan fungsional lengkap dari proyek Website Desa Bogem. Dokumen ini dirancang sebagai referensi tunggal (*single source of truth*) bagi pengembang, desainer, maupun pemangku kepentingan agar dapat memahami arsitektur, basis data, alur fitur, serta aset proyek tanpa harus memeriksa kode satu per satu.

---

## 1. Struktur & Tech Stack

### 1.1 Spesifikasi Inti
- **Framework**: [Next.js 16.3.0](https://nextjs.org) dengan arsitektur **App Router** (`src/app/`).
- **React**: React 19.2.8 & React DOM 19.2.8.
- **Bahasa**: [TypeScript 5](https://www.typescriptlang.org/) dengan konfigurasi strict path aliases (`@/*` mengarah ke `./src/*`).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (`@tailwindcss/postcss: ^4`, `tailwindcss: ^4`). Dikonfigurasi dengan `@import "tailwindcss";` pada `src/app/globals.css`.
- **Database & Backend**: [Supabase](https://supabase.com) menggunakan `@supabase/supabase-js` (^2.112.3) dan `@supabase/ssr` (^0.12.5).
- **Library UI / Komponen Eksternal**:
  - **Ikon**: [lucide-react](https://lucide.dev/) (^1.31.0).
  - **Peta Interaktif & Spasial**: [Leaflet](https://leafletjs.com/) (^1.9.4) & `@types/leaflet` (^1.9.22) dengan basemap satelit resolusi tinggi dari Esri World Imagery.
  - **Komponen UI**: Murni *custom-built utility classes* Tailwind CSS (tanpa dependensi berat seperti shadcn/ui, Chakra UI, atau MUI), menghasilkan bundel JavaScript yang sangat ringan dan cepat diakses melalui jaringan seluler pedesaan.
- **Tipografi / Font**:
  - Di-load otomatis melalui `next/font/google` di `src/app/layout.tsx`: **Inter** (`subsets: ["latin"]`).
  - Variabel CSS font diterapkan pada root tag `<body>` dengan kelas `bg-slate-50 text-slate-800 antialiased`.

### 1.2 Tree Struktur Folder Ringkas

```text
web-desa-bogem/
├── public/                         # Aset statis publik
│   ├── images/
│   │   ├── logo-magetan.png        # Logo resmi Pemkab Magetan (PNG)
│   │   └── logo-magetan.svg        # Logo vektor Pemkab Magetan (SVG)
│   ├── favicon.ico, icon.png       # Favicon & icon web
│   └── apple-icon.png              # Touch icon iOS
├── src/
│   ├── app/                        # Next.js App Router (Halaman & API)
│   │   ├── layout.tsx              # Root Layout (Navbar, Footer, MobileNav, AuthProvider)
│   │   ├── globals.css             # Konfigurasi Tailwind v4 & keyframe animasi
│   │   ├── page.tsx                # Beranda (Landing Page Desa)
│   │   ├── profil/page.tsx         # Profil Desa, Visi Misi, Bagan SOTK/BPD, Sejarah, Peta
│   │   ├── pemerintah/page.tsx     # Struktur Aparatur SOTK Desa Lengkap
│   │   ├── infografis/
│   │   │   ├── page.tsx            # Statistik Demografi, Organisasi LKD, & APBDes
│   │   │   └── idm/page.tsx        # Indeks Desa Membangun (IDM) & Status Mandiri
│   │   ├── berita/
│   │   │   ├── page.tsx            # Portal Warta & Berita Desa
│   │   │   └── [id]/page.tsx       # Detail Berita & Tombol Share Medsos
│   │   ├── potensi/page.tsx        # Etalase "Beli Dari Desa" (Produk UMKM & Order WA)
│   │   ├── layanan-surat/page.tsx  # Layanan Surat Online (Form Builder, Lacak, Surat Saya)
│   │   ├── login/page.tsx          # Login Warga & Pengelola (Email/NIK + Google OAuth)
│   │   ├── register/page.tsx       # Registrasi Warga Baru (NIK, No HP, Email)
│   │   ├── lengkapi-profil/        # Pengisian NIK & No HP pasca login Google
│   │   ├── forgot-password/        # Alur Lupa Password
│   │   ├── reset-password/         # Reset Password
│   │   ├── auth/callback/          # Handler Callback OAuth Supabase
│   │   ├── admin/                  # Panel Khusus Pengelola Desa (Protected)
│   │   │   ├── layout.tsx          # Layout Admin & Auth Gate Pengecekan Role 'admin'
│   │   │   ├── page.tsx            # Dashboard Admin Menu Cepat
│   │   │   ├── surat/page.tsx      # Inbox Permohonan, Verifikasi, Upload Berkas Surat
│   │   │   ├── infografis/page.tsx # Editor Kependudukan, Organisasi, APBDes, IDM
│   │   │   ├── sotk/page.tsx       # Editor Struktur & Aparatur Desa
│   │   │   ├── profil-desa/        # Editor Visi Misi, Sambutan, Bagan, Jam Layanan
│   │   │   ├── berita/page.tsx     # Editor Publikasi Kabar Berita
│   │   │   └── umkm/page.tsx       # Editor Katalog UMKM & Produk
│   │   └── api/                    # Route Handlers
│   │       ├── cron/keep-alive/    # Cron keep-alive pencegah auto-pause Supabase
│   │       └── maps/               # Endpoint data koordinat & peta
│   ├── components/                 # Komponen UI Reusable
│   │   ├── Navbar.tsx              # Top sticky navbar dengan auth state & mobile drawer
│   │   ├── MobileNav.tsx           # Fixed bottom navigation bar (khusus layar ponsel)
│   │   ├── Footer.tsx              # Footer informatif (4 kolom desktop & accordion mobile)
│   │   ├── VillageMap.tsx          # Client wrapper untuk peta Leaflet (SSR disabled)
│   │   ├── InteractiveBogemMap.tsx # Peta satelit Esri, batas polygon BIG, fly-in zoom
│   │   ├── ImageWithSkeleton.tsx   # Next/Image dengan animasi skeleton shimmer
│   │   ├── PageTransitionBar.tsx   # Indikator loading bar transisi rute halus
│   │   ├── home/                   # Sub-komponen spesifik halaman Beranda
│   │   │   ├── HeroSlider.tsx      # Banner berputar otomatis (3 tema keunggulan)
│   │   │   ├── QuickShortcuts.tsx  # Tombol pintas cepat layanan warga
│   │   │   ├── SambutanKades.tsx   # Sambutan resmi Kades & foto profil
│   │   │   ├── VisiMisiSection.tsx # Ringkasan visi & 4 butir misi desa
│   │   │   ├── AparaturPreview.tsx # Kartu foto aparatur SOTK
│   │   │   ├── StatistikSection.tsx# Ringkasan data demografi & IDM
│   │   │   ├── BeritaPreview.tsx   # Kartu warta terkini
│   │   │   ├── UMKMPreview.tsx     # Kartu produk unggulan warga
│   │   │   ├── PetaSection.tsx     # Penampil peta wilayah & jam kerja
│   │   │   └── PendudukCards.tsx   # Kartu demografi animasi
│   │   └── berita/
│   │       └── ShareButtons.tsx    # Tombol bagikan artikel (WA, FB, X, Salin Link)
│   ├── context/
│   │   └── AuthContext.tsx         # Provider Autentikasi Supabase & Profil Warga
│   ├── data/
│   │   ├── bogemBoundaryOfficial.ts# 215 koordinat batas desa resmi dari BIG
│   │   ├── bogemGeoJson.ts         # Titik koordinat pusat desa & kantor desa
│   │   └── bogem_bogem_kawedanan.geojson # Format GeoJSON standar
│   ├── hooks/
│   │   ├── useBerita.ts            # Hook data fetching warta berita
│   │   └── useUMKM.ts              # Hook data fetching produk UMKM
│   ├── lib/
│   │   ├── supabase/client.ts      # Inisialisasi Supabase client browser
│   │   ├── supabase/server.ts      # Inisialisasi Supabase client server/SSR
│   │   ├── supabase.ts             # Universal re-export Supabase client
│   │   └── storage.ts              # Helper upload file ke bucket Supabase + auto compress
│   ├── services/                   # Business logic & layer komunikasi Supabase
│   │   ├── profilService.ts        # Layanan fetch/update profil & kontak desa
│   │   ├── infografisService.ts    # Layanan fetch/update demografi, APBDes, IDM
│   │   ├── beritaService.ts        # Layanan CRUD berita desa
│   │   ├── umkmService.ts          # Layanan CRUD etalase produk UMKM
│   │   ├── perangkatService.ts     # Layanan CRUD aparatur SOTK
│   │   ├── suratService.ts         # Layanan pengajuan, lacak, form builder surat
│   │   └── visitorService.ts       # Pencatatan hit unik & statistik pengunjung WIB
│   ├── types/                      # Deklarasi Type & Interface TypeScript
│   └── utils/
│       ├── constants.ts            # Konfigurasi aplikasi, alamat, kategori preset
│       ├── formatters.ts           # Formatter tanggal Indonesia, rupiah, URL WhatsApp
│       ├── imageCompressor.ts      # Kompresor foto otomatis di browser (<250KB WebP)
│       └── validators.ts           # Validator NIK KTP 16 digit, password, phone, email
├── next.config.ts                  # Konfigurasi Next.js, CSP Headers, Image Cache TTL
├── postcss.config.mjs              # Konfigurasi PostCSS Tailwind v4
├── supabase_schema.sql             # Skema DDL lengkap, RLS Policies, Triggers & Seed
├── supabase_migration_visitor_logs.sql # Migrasi tabel visitor_logs & fungsi agregat WIB
└── supabase_security_patch.sql     # Skrip pengetatan keamanan & anti privilege escalation
```

---

## 2. Skema Data (Supabase PostgreSQL)

Database menggunakan PostgreSQL yang di-host pada Supabase dengan sistem proteksi **Row Level Security (RLS)** ketat di seluruh tabel.

### 2.1 Daftar Tabel & Kolom

#### 1. Tabel `profiles` (Akun Pengguna: Warga & Perangkat)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `UUID` (PK) | Relasi ke `auth.users(id)` ON DELETE CASCADE |
| `nik` | `TEXT` (UNIQUE) | 16 digit NIK KTP warga pemohon |
| `nama` | `TEXT` | Nama lengkap warga sesuai KTP |
| `no_hp` | `TEXT` | Nomor handphone / WhatsApp aktif |
| `email` | `TEXT` | Alamat email terdaftar |
| `role` | `TEXT` | `'warga'` (default) atau `'admin'` |
| `created_at` | `TIMESTAMPTZ` | Waktu registrasi |
| `updated_at` | `TIMESTAMPTZ` | Waktu pembaruan profil terakhir |

*Catatan Keamanan*: Dilindungi trigger `protect_profile_role` yang memblokir injeksi role `admin` dari sisi klien saat signUp maupun update.

---

#### 2. Tabel `profil_desa` (Profil Umum, Legalitas, & Kontak)
Menyimpan satu baris konfigurasi utama (`id = 'main'`).
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | Nilai default `'main'` |
| `visi` | `TEXT` | Pernyataan visi desa |
| `misi` | `JSONB` | Array daftar butir misi (`string[]`) |
| `nama_kades` | `TEXT` | Nama Kepala Desa |
| `foto_kades` | `TEXT` | URL foto resmi Kepala Desa |
| `sambutan_kades` | `TEXT` | Teks sambutan pembuka di beranda |
| `bagan_desa_image` | `TEXT` | URL gambar bagan struktur Pemdes |
| `bagan_bpd_image` | `TEXT` | URL gambar bagan struktur BPD |
| `sejarah` | `TEXT` | Narasi sejarah dan asal-usul desa |
| `luas_wilayah` | `TEXT` | Misal: `"101,03 Ha"` |
| `jumlah_penduduk` | `TEXT` | Misal: `"1.615 Jiwa"` |
| `ketinggian` | `TEXT` | Misal: `"± 78 mdpl"` |
| `batas_wilayah` | `JSONB` | Object batas utara, timur, selatan, barat |
| `jam_pelayanan` | `TEXT` | Misal: `"Senin - Jumat: 08.00 - 15.00 WIB"` |
| `jam_pelayanan_note`| `TEXT` | Catatan hari libur / layanan darurat |
| `alamat_kantor` | `TEXT` | Alamat kantor desa lengkap |
| `telepon_kantor` | `TEXT` | Nomor telepon/WA kantor desa |
| `email_kantor` | `TEXT` | Email dinas desa |
| `updated_at` | `TIMESTAMPTZ` | Waktu update terakhir |

---

#### 3. Tabel `perangkat_desa` (Struktur SOTK & Aparatur Pemerintahan)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | Default `gen_random_uuid()::text` |
| `nama` | `TEXT` | Nama lengkap aparatur beserta gelar |
| `jabatan` | `TEXT` | Jabatan (Kepala Desa, Sekdes, Kasi, Kaur, Kasun) |
| `foto` | `TEXT` | URL foto potret resmi (rasio 3:4) |
| `kontak` | `TEXT` | Nomor kontak/WhatsApp |
| `urutan` | `INTEGER` | Urutan hierarki tampilan (1 untuk pimpinan) |
| `created_at` | `TIMESTAMPTZ` | Tanggal ditambahkan |

---

#### 4. Tabel `infografis` (Statistik, Demografi, Organisasi, APBDes, & IDM)
Menyimpan satu baris data komprehensif (`id = 'main'`).
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | Nilai default `'main'` |
| `demografi` | `JSONB` | Total penduduk, pria, wanita, KK, dusun, RT, RW, luas |
| `pekerjaan` | `JSONB` | Array profesi warga, persentase, dan jumlah |
| `pendidikan` | `JSONB` | Array jenjang pendidikan warga |
| `organisasi` | `JSONB` | Array Lembaga Kemasyarakatan Desa (BPD, LPMD, PKK, dll) |
| `apbdes` | `JSONB` | Pendapatan, belanja, pembiayaan, SiLPA, surplus/defisit |
| `idm` | `JSONB` | Skor IDM, status desa, nilai IKS, IKE, IKL, & riwayat |
| `updated_at` | `TIMESTAMPTZ` | Waktu sinkronisasi |

---

#### 5. Tabel `opsi_surat` (Kategori Surat & Dynamic Form Builder)
Dikelola oleh Admin untuk menentukan formulir dinamis apa saja yang harus diisi warga untuk setiap jenis surat.
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | ID unik, misal: `'opsi-1'`, `'opsi-2'` |
| `nama_surat` | `TEXT` | Nama surat (contoh: *Surat Keterangan Usaha (SKU)*) |
| `deskripsi` | `TEXT` | Deskripsi fungsi dan tujuan pembuatan surat |
| `syarat` | `TEXT` | Persyaratan berkas (KTP, KK, Pengantar RT, dll) |
| `custom_fields` | `JSONB` | Array konfigurasi field dinamis: `[ { id, label, tipe, placeholder, wajib } ]` |
| `created_at` | `TIMESTAMPTZ` | Tanggal pembuatan opsi |

---

#### 6. Tabel `permohonan_surat` (Pengajuan Surat & Hasil Layanan)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | Kode Tiket unik, misal: `SRT-202508-4921AB` |
| `user_id` | `UUID` | Relasi ke `public.profiles(id)` (opsional jika login) |
| `opsi_surat_id` | `TEXT` | Relasi ke `public.opsi_surat(id)` |
| `nik` | `TEXT` | NIK KTP pemohon (16 digit angka) |
| `nama_lengkap` | `TEXT` | Nama pemohon |
| `no_whatsapp` | `TEXT` | Nomor WhatsApp aktif untuk notifikasi |
| `email` | `TEXT` | Email pemohon |
| `jenis_surat` | `TEXT` | Nama jenis surat yang diajukan |
| `data_formulir` | `JSONB` | Nilai input yang diisi warga sesuai `custom_fields` |
| `status` | `TEXT` | `'MENUNGGU'`, `'DIPROSES'`, `'SELESAI'`, atau `'DITOLAK'` |
| `file_surat_selesai` | `TEXT` | URL atau Base64 file dokumen surat jadi (PDF/Word/Gambar) |
| `nama_file_selesai` | `TEXT` | Nama berkas unduhan (misal: *Surat_SKU_Ahmad.pdf*) |
| `catatan_admin` | `TEXT` | Catatan operator desa (misal: alasan penolakan/instruksi ambil fisik) |
| `created_at` | `TIMESTAMPTZ` | Waktu pengajuan surat |
| `updated_at` | `TIMESTAMPTZ` | Waktu pembaruan status |

---

#### 7. Tabel `berita` (Kabar & Publikasi Warta Desa)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | Default `gen_random_uuid()::text` |
| `author_id` | `UUID` | ID profil pembuat berita |
| `judul` | `TEXT` | Judul berita warta desa |
| `kategori` | `TEXT` | Kategori (Pengumuman Resmi, Kesehatan, Pembangunan, dll) |
| `penulis` | `TEXT` | Default: *"Pemerintah Desa Bogem"* |
| `ringkasan` | `TEXT` | Ringkasan pembuka (lead paragraph) |
| `konten` | `TEXT` | Isi artikel lengkap |
| `gambar` | `TEXT` | URL gambar cover di Supabase Storage / remote CDN |
| `created_at` | `TIMESTAMPTZ` | Tanggal publikasi |

---

#### 8. Tabel `umkm` (Katalog Etalase "Beli Dari Desa")
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT` (PK) | Default `gen_random_uuid()::text` |
| `nama_usaha` | `TEXT` | Nama toko / merk produk warga |
| `pemilik` | `TEXT` | Nama pemilik UMKM |
| `deskripsi` | `TEXT` | Deskripsi produk, bahan, atau layanan |
| `kategori` | `TEXT` | Makanan & Minuman, Kerajinan Tangan, Jasa, Pertanian, dll |
| `kontak` | `TEXT` | Nomor kontak WhatsApp untuk transaksi pemesanan |
| `alamat` | `TEXT` | Alamat lokasi toko/rumah produksi di desa |
| `harga` | `TEXT` | Teks format rupiah (misal: *"Rp 15.000 / porsi"*) |
| `gambar` | `TEXT` | URL foto produk di Supabase Storage |
| `created_at` | `TIMESTAMPTZ` | Tanggal ditambahkan |

---

#### 9. Tabel `visitor_logs` (Pencatatan Kunjungan Real-Time)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `UUID` (PK) | Default `gen_random_uuid()` |
| `visited_at` | `TIMESTAMPTZ` | Waktu kunjungan tercatat |
| `visitor_hash` | `TEXT` | Hash browser anonim (privacy-friendly tanpa IP mentah) |
| `path` | `TEXT` | Halaman yang dikunjungi (default: `'/'`) |
| `created_date` | `DATE` (STORED) | Generated column: `(visited_at AT TIME ZONE 'Asia/Jakarta')::date` |

---

### 2.2 Fungsi Tersimpan (RPC Functions) & Keamanan RLS
1. `is_admin()`: Memvalidasi apakah user yang sedang login berstatus admin.
2. `track_surat_secure(p_ticket TEXT, p_nik TEXT)`: Fitur pencarian surat publik yang mewajibkan kode tiket **dan** 16 digit NIK yang cocok untuk mencegah enumerasi data pribadi warga.
3. `is_nik_registered(p_nik TEXT)`: Mengembalikan nilai *boolean* saat registrasi untuk mengecek NIK ganda tanpa membocorkan identitas pemilik.
4. `check_surat_rate_limit()`: Trigger otomatis di level database yang membatasi pengajuan maksimal 3 permohonan surat per 10 menit untuk NIK yang sama (mencegah spam bot).
5. `record_visit(p_visitor_hash TEXT, p_path TEXT)`: Mencatat 1 kunjungan unik per hari per browser berdasarkan zona waktu WIB.
6. `get_visitor_stats()`: Menghitung agregasi statistik 1-pass untuk hari ini, kemarin, pekan ini, pekan lalu, bulan ini, bulan lalu, dan total kunjungan.

---

## 3. Halaman & Routing

Aplikasi menggunakan pola Next.js App Router dengan pemisahan rute publik dan panel admin:

```
RUTE APLIKASI
├── PUBLIK
│   ├── /                         -> Beranda Utama
│   ├── /profil                   -> Profil Desa, Visi Misi, Sejarah, Peta
│   ├── /pemerintah               -> Struktur SOTK & Aparatur Desa
│   ├── /infografis               -> Demografi, Organisasi LKD, APBDes
│   ├── /infografis/idm           -> Status Indeks Desa Membangun (IDM)
│   ├── /berita                   -> Katalog Warta & Kabar Berita
│   ├── /berita/[id]              -> Detail Berita & Tombol Bagikan
│   ├── /potensi                  -> Etalase UMKM "Beli Dari Desa"
│   ├── /layanan-surat            -> Pengajuan, Lacak, & Riwayat Surat Warga
│   ├── /login                    -> Masuk Akun Warga & Pengelola
│   ├── /register                 -> Pendaftaran Akun Warga Baru
│   ├── /lengkapi-profil          -> Pelengkap NIK KTP untuk Login Google
│   ├── /forgot-password          -> Pengajuan Reset Kata Sandi
│   ├── /reset-password           -> Pembaruan Kata Sandi Baru
│   └── /auth/callback            -> Handler Callback OAuth
├── KHUSUS ADMIN (LOGIN DENGAN ROLE 'admin' WAJIB)
│   ├── /admin                    -> Dashboard Menu Cepat Pengelola
│   ├── /admin/surat              -> Inbox Permohonan, Proses Surat, Form Builder
│   ├── /admin/infografis         -> Kelola Data Demografi, APBDes, IDM, LKD
│   ├── /admin/sotk               -> Kelola Aparatur & Struktur Organisasi
│   ├── /admin/profil-desa        -> Kelola Visi Misi, Bagan, Jam Layanan, Kontak
│   ├── /admin/berita             -> Kelola Publikasi Berita
│   └── /admin/umkm               -> Kelola Produk & Data Usaha Warga
└── API & CRON
    ├── /api/cron/keep-alive      -> Ping Inactivity Supabase (Vercel Cron)
    └── /api/maps                 -> Data Spasial & Google Maps Embed
```

---

## 4. Konten Real & Data Bawaan (Seed Data)

### 4.1 Identitas Pemerintahan Desa
- **Nama Desa**: Desa Bogem
- **Kecamatan**: Kecamatan Kawedanan
- **Kabupaten**: Kabupaten Magetan
- **Provinsi**: Jawa Timur
- **Kode Pos**: 63382
- **Kode Kemendagri / BIG**: `35.20.05.2013` (Delineasi Batas Desa BIG)
- **Alamat Kantor Balai Desa**: Jl. Bakti Mulya No. 241, Desa Bogem, Kec. Kawedanan, Kab. Magetan, Jawa Timur 63382
- **Nomor Telepon / WhatsApp Resmi**: `0851-3655-8975`
- **Alamat Email Dinas**: `desabogemjaya@gmail.com`
- **Jam Pelayanan Kantor**:
  - *Senin - Jumat*: 08.00 - 15.00 WIB
  - *Sabtu & Minggu*: Libur Pelayanan Administrasi Fisik (Layanan surat online tetap terbuka 24 jam)

### 4.2 Geografis & Tapal Batas Wilayah
- **Luas Wilayah**: `101,03 Ha` (atau `245 Ha` pada infografis makro), `100.63 Ha` (hasil batas BIG).
- **Ketinggian**: ± 78 mdpl (Dataran rendah subur persawahan).
- **Batas-Batas Wilayah Administratif**:
  - **Utara**: Desa Karangrejo (Desa Tladan / Genengan)
  - **Timur**: Kelurahan Sampung (Desa Pojok / Kawedanan)
  - **Selatan**: Kelurahan Sampung (Desa Giripurno)
  - **Barat**: Desa Jambangan (Desa Sugihrejo)

### 4.3 Demografi Kependudukan
- **Jumlah Penduduk**: `1.615 Jiwa` (profil ringkas) / `3.620 Jiwa` (data agregat statistik).
- **Rincian Gender**: 1.790 Laki-Laki (49,4%) & 1.830 Perempuan (50,6%).
- **Kepala Keluarga (KK)**: 1.080 KK.
- **Pembagian Wilayah**: 4 Dusun, 4 RW, 18 RT.
- **Mata Pencaharian Utama**:
  1. Petani & Pekebun: 45% (1.629 warga)
  2. Wiraswasta / Pelaku UMKM: 23% (832 warga)
  3. Karyawan Swasta: 16% (579 warga)
  4. PNS / TNI / Polri: 8% (290 warga)
  5. Jasa / Lainnya: 8% (290 warga)

### 4.4 Visi & Misi Desa
- **Visi**:
  > *"Mewujudkan Desa Bogem yang Mandiri, Sejahtera, Berdaya Saing, dan Berbudaya melalui Tata Kelola Pemerintahan yang Transparan dan Pemanfaatan Teknologi Digital."*
- **Misi**:
  1. Meningkatkan kualitas pelayanan administrasi dan informasi masyarakat berbasis digital.
  2. Mendorong pertumbuhan ekonomi warga lewat dukungan UMKM dan pemasaran produk lokal.
  3. Meningkatkan infrastruktur sarana publik dan kelestarian lingkungan hidup desa.
  4. Mempererat kerukunan gotong royong dan melestarikan kearifan budaya lokal.

### 4.5 Sejarah Singkat Desa
> *"Nama Desa Bogem memiliki akar sejarah yang kuat dan sarat nilai perjuangan serta kearifan lokal di wilayah Kecamatan Kawedanan, Kabupaten Magetan. Sejak dahulu kala, kawasan ini dikenal sebagai wilayah pemukiman yang tentram dengan tanah persawahan yang subur dan sumber mata air yang melimpah. Masyarakat secara turun-temurun mengandalkan sektor pertanian sawah, palawija, serta kerajinan dan perdagangan lokal. Semangat gotong royong, kebersamaan warga, dan nilai-nilai religius menjadi fondasi utama dalam kehidupan bermasyarakat."*

### 4.6 Status Indeks Desa Membangun (IDM)
- **Status Kemandirian**: **DESA MANDIRI**
- **Skor IDM Terkini (2025)**: `0.8542`
- **Rincian Indeks Komposit**:
  - **IKS (Ketahanan Sosial)**: `0.892` (Sangat Baik)
  - **IKE (Ketahanan Ekonomi)**: `0.785` (Baik / Berkembang)
  - **IKL (Ketahanan Lingkungan)**: `0.886` (Sangat Baik)
- **Riwayat Pertumbuhan**:
  - Tahun 2021: Skor `0.712` (Desa Berkembang)
  - Tahun 2023: Skor `0.798` (Desa Maju)
  - Tahun 2025: Skor `0.8542` (Desa Mandiri)

### 4.7 Realisasi Keuangan APBDes (Tahun Anggaran 2024)
- **Total Pendapatan Desa**: Rp 1.520.400.000
  - Dana Desa (DDS): Rp 850.000.000 (55,9%)
  - Alokasi Dana Desa (ADD): Rp 420.400.000 (27,7%)
  - Pendapatan Asli Desa (PADes): Rp 150.000.000 (9,9%)
  - Bagi Hasil Pajak & Retribusi (PBH): Rp 100.000.000 (6,6%)
  - Bidang Pembangunan Desa: Rp 680.000.000
  - Penyelenggaraan Pemerintahan: Rp 450.100.000
  - Pembinaan Kemasyarakatan: Rp 165.000.000
  - Pemberdayaan Masyarakat: Rp 110.000.000
  - Penanggulangan Bencana & Darurat: Rp 40.000.000
- **Surplus Anggaran**: Rp 75.300.000
- **SiLPA Tahun Berjalan**: Rp 75.300.000

### 4.8 Kelembagaan & Lembaga Kemasyarakatan Desa (LKD)
1. **Badan Permusyawaratan Desa (BPD)** — Ketua: Bpk. Bambang Sutrisno (9 Anggota)
2. **Lembaga Pemberdayaan Masyarakat Desa (LPMD)** — Ketua: Bpk. Sukarman (12 Anggota)
3. **Tim Penggerak PKK Desa Bogem** — Ketua: Ibu Sri Wahyuni (35 Kader)
4. **Karang Taruna Satria Muda** — Ketua: Dimas Anggara (28 Pemuda)
5. **Satuan Perlindungan Masyarakat (Satlinmas)** — Ketua: Bpk. Suparno (20 Anggota)
6. **Kader Posyandu & Kesehatan Desa** — Ketua: Ibu Endang Sulistyo (24 Kader)

### 4.9 Kategori Surat & Formulir Dinamis Bawaan
1. **Surat Keterangan Usaha (SKU)**: Input nama usaha, jenis usaha, alamat tempat usaha, tahun berdiri, keperluan pengajuan SKU.
2. **Surat Keterangan Domisili**: Input dusun, RT/RW, alamat domisili lengkap, keperluan surat domisili.
3. **Surat Keterangan Tidak Mampu (SKTM)**: Input nama kepala keluarga, tujuan SKTM, rata-rata penghasilan bulanan, keterangan kondisi ekonomi.
4. **Surat Pengantar SKCK**: Input tempat/tanggal lahir, pekerjaan saat ini, keperluan SKCK.
5. **Surat Keterangan Belum Menikah**: Input tempat/tanggal lahir, agama, status pekerjaan, keperluan surat.
6. **Surat Keterangan Kematian**: Input nama almarhum, NIK almarhum, tanggal meninggal, tempat meninggal, penyebab, hubungan pelapor.

### 4.10 Lokasi File Aset & Media
- **Logo Resmi Kabupaten Magetan**:
  - `public/images/logo-magetan.png` (resolusi tinggi)
  - `public/images/logo-magetan.svg` (vektor tajam)
  - `public/logo-magetan.png`
- **Favicon & PWA**:
  - `src/app/icon.png`, `src/app/apple-icon.png`, `public/favicon.ico`
- **Data Spasial & Polygon Tapal Batas**:
  - `src/data/bogemBoundaryOfficial.ts`: 215 pasang koordinat batas resmi Badan Informasi Geospasial (BIG).
  - `src/data/bogemGeoJson.ts`: Titik koordinat Kantor Desa Bogem (`[-7.68446, 111.40938]`).
  - `src/data/bogem_bogem_kawedanan.geojson`: Format standar GIS layer.
- **Foto Dinamis (Berita, UMKM, Bagan SOTK/BPD)**:
  - Disimpan pada Supabase Storage Bucket `public-images` dan diakses publik via CDN Supabase.

---

## 5. Komponen UI & Desain Antarmuka

### 5.1 Komponen Reusable Utama

#### `Navbar.tsx` (`src/components/Navbar.tsx`)
- **Fungsi**: Navigasi sticky utama di bagian atas.
- **Fitur**:
  - Menampilkan Logo Pemkab Magetan dan branding identitas desa.
  - Active indicator link sesuai halaman yang sedang dibuka.
  - Highlight tombol `Layanan Surat`.
  - Auth Pill: Menampilkan inisial, nama, role user terautentikasi, serta tombol logout. Terdapat badge peringatan animasi *"Lengkapi NIK"* jika akun belum melengkapi identitas KTP.
  - Hamburger Button 2-garis animasi dinamis untuk tampilan ponsel.
  - Otomatis disembunyikan (`return null`) jika rute URL diawali `/admin`.

#### `MobileNav.tsx` (`src/components/MobileNav.tsx`)
- **Fungsi**: Bottom navigation bar melayang (*fixed bottom-0*) khusus perangkat ponsel/tablet (< lg).
- **Fitur**:
  - 6 Menu Cepat: Beranda, Profil, Infografis, Berita, Belanja, Surat.
  - Support *safe-area-inset-bottom* untuk iPhone ber-notch / home bar.
  - *Smooth scroll to top* otomatis saat user mengklik menu yang halamannya sedang aktif.
  - Disembunyikan di dalam panel admin.

#### `Footer.tsx` (`src/components/Footer.tsx`)
- **Fungsi**: Penutup halaman dengan informasi kontak lengkap dan pencatatan kunjungan website.
- **Fitur**:
  - **Tampilan Desktop (≥ md)**: 4 Kolom grid mencakup Profil Desa, Kontak Kantor, Jam Pelayanan, dan Kartu Statistik Kunjungan (Hari Ini, Kemarin, Pekan Ini, Pekan Lalu, Bulan Ini, Bulan Lalu, Total).
  - **Tampilan Mobile (< md)**: Accordion interaktif (Kunjungan Website, Kontak Desa, Sosial Media, Jelajahi) yang tertata ringkas.

#### `VillageMap.tsx` & `InteractiveBogemMap.tsx`
- **Fungsi**: Peta interaktif desa berbasis Leaflet.
- **Fitur**:
  - Menggunakan citra satelit resolusi tinggi dari Esri World Imagery.
  - Menggambar tapal batas polygon 215 koordinat resmi BIG dengan highlight warna hijau emerald transparan.
  - Custom pin marker Kantor Balai Desa Bogem dengan popup informasi kontak.
  - Animasi sinematik *fly-in zoom* dari peta regional Jawa Timur menuju wilayah Desa Bogem.
  - Tombol *"Ulangi Zoom"* interaktif.
  - Dilengkapi `ResizeObserver` dan `IntersectionObserver` agar ukuran peta otomatis menyesuaikan saat container berganti ukuran.

#### `ImageWithSkeleton.tsx` (`src/components/ImageWithSkeleton.tsx`)
- **Fungsi**: Wrapper komponen `next/image` berperforma tinggi.
- **Fitur**: Menampilkan efek animasi *shimmer skeleton* saat foto sedang dalam proses unduh, dan bertransisi halus (*fade-in*) begitu foto siap. Menyediakan fallback ikon bila URL foto rusak/kosong.

#### `PageTransitionBar.tsx` (`src/components/PageTransitionBar.tsx`)
- **Fungsi**: Loading bar tipis berwarna hijau emerald di puncak layar (`fixed top-0`) yang memberikan umpan balik visual instan saat pengguna berpindah halaman.

#### Sub-Komponen Beranda (`src/components/home/`)
- `HeroSlider.tsx`: Banner rotasi 3 pesan utama dilengkapi kontrol jeda saat kursor diarahkan (*pause on hover/touch*).
- `QuickShortcuts.tsx`: 6 Tombol pintasan akses cepat.
- `SambutanKades.tsx`: Sambutan Kepala Desa berlatar kartu hijau tua berwibawa.
- `VisiMisiSection.tsx`: Paparan visi dan 4 kartu misi desa.
- `AparaturPreview.tsx`: Pratinjau susunan perangkat desa dengan tautan ke halaman SOTK lengkap.
- `StatistikSection.tsx`: Cuplikan demografi penduduk dan skor IDM.
- `BeritaPreview.tsx`: Menampilkan 3 kabar warta desa terbaru.
- `UMKMPreview.tsx`: Menampilkan 3 etalase produk UMKM warga.
- `PetaSection.tsx`: Menampilkan peta Leaflet dan jadwal kantor.
- `PendudukCards.tsx`: 4 Kartu metrik kependudukan dengan animasi mikro mengapung (*floating micro-animation*).

---

## 6. Constraint, Batasan Teknis & Preferensi Desain

### 6.1 Optimasi Kuota Hosting & Serverless (Vercel Free Tier)
1. **Limit Optimasi Gambar (1.000 gambar/bulan)**:
   - Dikonfigurasi di `next.config.ts` dengan `minimumCacheTTL: 31536000` (1 tahun cache CDN) agar gambar yang sudah dioptimasi tidak memakan kuota transformasi bulanan Vercel berulang kali.
   - Format gambar didukung: modern `image/avif` dan `image/webp`.
2. **Client-Side Image Compression** (`src/utils/imageCompressor.ts`):
   - Warga desa sering mengunggah foto langsung dari kamera smartphone berkualitas tinggi (berukuran 8MB - 20MB).
   - Sistem secara otomatis mengompres foto langsung di peramban (client-side canvas) menjadi berkas WebP berkualitas 82% dengan resolusi maksimal 1200x1200px (ukuran berkas turun menjadi < 250KB) sebelum diunggah ke Supabase Storage. Upload menjadi super cepat dan kuota storage Supabase hemat.

### 6.2 Pencegahan Auto-Pause Database (Supabase Free Tier)
- Supabase Free Tier secara otomatis menangguhkan (*pause*) proyek database jika tidak ada aktivitas selama 7 hari berturut-turut.
- Proyek ini dilengkapi route `/api/cron/keep-alive` yang melakukan query ringan ke tabel `profil_desa` untuk mereset masa tenggang penangguhan database. Endpoint ini dapat dihubungkan ke Vercel Cron (`cron expression`) atau uptime monitor eksternal.

### 6.3 Aksesibilitas & Ramah Pengguna Pedesaan (*Rural Accessibility*)
1. **Mobile-First Experience**: Sebagian besar masyarakat desa mengakses internet melalui ponsel Android/iOS. Setiap komponen dioptimalkan agar ramah sentuhan dengan ukuran area klik (*tap target*) minimal 44x44px.
2. **Bottom Navigation**: Bilah menu bawah memudahkan warga mengakses fitur utama hanya dengan satu ibu jari (*one-thumb navigation*).
3. **Validasi & Kemudahan Layanan Surat**:
   - Warga yang sudah login tidak perlu mengetik ulang NIK, Nama, dan No WhatsApp karena otomatis terisi (*auto-fill*).
   - Kode tiket surat dibuat ringkas (misal: `SRT-202508-4921`) tanpa menggunakan karakter yang membingungkan seperti huruf `O` dan angka `0`, atau huruf `I` dan angka `1`.
   - Warga yang lupa kode tiket dapat melacak dokumen mereka cukup dengan memasukkan 16 digit NIK KTP.

### 6.4 Identitas & Standar Branding
1. **Warna Resmi Pemerintah Desa**:
   - Mengusung palet warna hijau botol / daun tua dinas kehutanan & pertanian: `#063321`, `#073623`, `#004329`.
   - Dipadukan dengan warna latar belakang lembut `#F8FAFC`, aksen hijau emerald `#059669` / `#10b981`, serta teks kontras tinggi untuk memastikan kenyamanan membaca di luar ruangan.
2. **Branding Pemerintah Kabupaten Magetan**:
   - Mempertahankan logo resmi Lambang Daerah Kabupaten Magetan di sudut kiri atas navigasi, kartu login admin, dan dokumen persuratan.
   - Menyertakan atribut hirarki resmi: *"Pemerintah Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan, Jawa Timur"*.
