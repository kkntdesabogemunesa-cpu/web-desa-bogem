-- ==============================================================================
-- SUPABASE SQL PATCH: PENGATURAN SURAT & INTEGRASI SURAT KETERANGAN OTOMATIS
-- Desa Bogem, Kecamatan Kawedanan, Kabupaten Magetan
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. BUAT TABEL PENGATURAN PEJABAT & FORMAT KOP SURAT
CREATE TABLE IF NOT EXISTS public.pengaturan_surat (
  id text PRIMARY KEY DEFAULT 'default',
  nama_instansi text NOT NULL DEFAULT 'PEMERINTAH KABUPATEN MAGETAN',
  nama_kecamatan text NOT NULL DEFAULT 'KECAMATAN KAWEDANAN',
  nama_desa text NOT NULL DEFAULT 'DESA BOGEM',
  alamat_kantor text NOT NULL DEFAULT 'Jl. Bhakti Mulya No.241',
  telepon_kantor text DEFAULT '081231400990',
  email_kantor text DEFAULT 'desabogemjaya@gmail.com',
  kodepos text DEFAULT '63382',
  nama_pejabat text NOT NULL DEFAULT 'TUT WARIYANI, S.KM',
  jabatan_pejabat text NOT NULL DEFAULT 'Pj Kepala Desa Bogem',
  nip_pejabat text DEFAULT '197408222006042016',
  alamat_pejabat text DEFAULT 'Desa Bogem Kecamatan Kawedanan Kabupaten Magetan',
  kode_klasifikasi text NOT NULL DEFAULT '474',
  kode_wilayah text NOT NULL DEFAULT '403.405.13',
  nomor_urut_terakhir integer NOT NULL DEFAULT 196,
  updated_at timestamptz DEFAULT now()
);

-- 2. AKTIFKAN ROW LEVEL SECURITY (RLS) PADA TABEL PENGATURAN SURAT
ALTER TABLE public.pengaturan_surat ENABLE ROW LEVEL SECURITY;

-- Izinkan semua orang (Admin & Publik) membaca pengaturan kop & pejabat surat
DROP POLICY IF EXISTS "Allow public read pengaturan_surat" ON public.pengaturan_surat;
CREATE POLICY "Allow public read pengaturan_surat" ON public.pengaturan_surat
FOR SELECT USING (true);

-- Izinkan Admin mengubah/menyimpan pengaturan surat
DROP POLICY IF EXISTS "Admin modify pengaturan_surat" ON public.pengaturan_surat;
CREATE POLICY "Admin modify pengaturan_surat" ON public.pengaturan_surat
FOR ALL USING (
  -- Bisa diakses jika admin atau role authenticated
  auth.role() = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated'
);

-- 3. SEEDING / ISI NILAI DEFAULT RESMI DESA BOGEM
INSERT INTO public.pengaturan_surat (
  id,
  nama_instansi,
  nama_kecamatan,
  nama_desa,
  alamat_kantor,
  telepon_kantor,
  email_kantor,
  kodepos,
  nama_pejabat,
  jabatan_pejabat,
  nip_pejabat,
  alamat_pejabat,
  kode_klasifikasi,
  kode_wilayah,
  nomor_urut_terakhir
) VALUES (
  'default',
  'PEMERINTAH KABUPATEN MAGETAN',
  'KECAMATAN KAWEDANAN',
  'DESA BOGEM',
  'Jl. Bhakti Mulya No.241',
  '081231400990',
  'desabogemjaya@gmail.com',
  '63382',
  'TUT WARIYANI, S.KM',
  'Pj Kepala Desa Bogem',
  '197408222006042016',
  'Desa Bogem Kecamatan Kawedanan Kabupaten Magetan',
  '474',
  '403.405.13',
  196
)
ON CONFLICT (id) DO NOTHING;

-- 4. AMANKAN AKSES UPDATE & PENERBITAN PADA TABEL PERMOHONAN SURAT
-- Memastikan Admin dapat mengupdate status SELESAI, mengupload/mengirim file surat otomatis
DROP POLICY IF EXISTS "Admin update permohonan_surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Admin update delete surat" ON public.permohonan_surat;
CREATE POLICY "Admin update permohonan_surat" ON public.permohonan_surat
FOR UPDATE USING (
  auth.role() = 'authenticated' OR public.is_admin()
) WITH CHECK (
  auth.role() = 'authenticated' OR public.is_admin()
);

-- Izinkan Admin membuat tiket surat baru untuk permohonan walk-in (offline)
DROP POLICY IF EXISTS "Admin insert permohonan_surat" ON public.permohonan_surat;
CREATE POLICY "Admin insert permohonan_surat" ON public.permohonan_surat
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' OR public.is_admin()
);

-- Izinkan Admin menghapus permohonan surat dari panel admin
DROP POLICY IF EXISTS "Admin delete permohonan_surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Admin delete surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Allow delete permohonan_surat" ON public.permohonan_surat;
CREATE POLICY "Admin delete permohonan_surat" ON public.permohonan_surat
FOR DELETE USING (
  auth.role() = 'authenticated' OR public.is_admin()
);

-- 5. PERBARUI FUNGSI PELACAKAN SURAT OLEH WARGA (TRACK SURAT SECURE)
-- Menjamin dokumen surat selesai, catatan admin, dan nomor file dapat dibaca oleh warga pemilik tiket
DROP FUNCTION IF EXISTS public.track_surat_secure(text, text);
DROP FUNCTION IF EXISTS public.track_surat_secure;
CREATE OR REPLACE FUNCTION public.track_surat_secure(p_ticket text, p_nik text)
RETURNS TABLE (
  id text,
  jenis_surat text,
  nama_lengkap text,
  status text,
  catatan_admin text,
  file_surat_selesai text,
  nama_file_selesai text,
  data_formulir jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Wajibkan NIK terisi dan minimal 16 karakter
  IF p_nik IS NULL OR length(trim(p_nik)) < 16 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT s.id, s.jenis_surat, s.nama_lengkap, s.status, s.catatan_admin, s.file_surat_selesai, s.nama_file_selesai, s.data_formulir, s.created_at, s.updated_at
  FROM public.permohonan_surat s
  WHERE s.id = trim(p_ticket) AND s.nik = trim(p_nik);
END;
$$;

-- Berikan izin eksekusi ke peran anonim dan pengguna login
GRANT EXECUTE ON FUNCTION public.track_surat_secure(text, text) TO anon, authenticated;
GRANT SELECT ON TABLE public.pengaturan_surat TO anon, authenticated;
GRANT ALL ON TABLE public.pengaturan_surat TO authenticated;
