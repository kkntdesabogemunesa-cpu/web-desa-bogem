-- ==============================================================================
-- SUPABASE SECURITY PATCH - DESA BOGEM
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda.
-- Mengamankan RLS Permohonan Surat, Profil Warga, dan Storage Object
-- ==============================================================================

-- 1. AMANKAN TABEL PERMOHONAN SURAT
DROP POLICY IF EXISTS "Warga view own surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Public select permohonan_surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Admin select all permohonan_surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Warga select own permohonan_surat" ON public.permohonan_surat;
DROP POLICY IF EXISTS "Public insert surat" ON public.permohonan_surat;

-- Hanya Admin Desa yang boleh membaca SELURUH data permohonan surat
CREATE POLICY "Admin select all permohonan_surat" ON public.permohonan_surat
FOR SELECT USING (public.is_admin());

-- Warga yang login hanya boleh melihat permohonan miliknya sendiri
CREATE POLICY "Warga select own permohonan_surat" ON public.permohonan_surat
FOR SELECT USING (auth.uid() = user_id);

-- Pengajuan surat baru: Hanya boleh diajukan dengan status awal 'MENUNGGU' dan tanpa file/catatan admin
CREATE POLICY "Public insert surat" ON public.permohonan_surat
FOR INSERT WITH CHECK (
  status = 'MENUNGGU'
  AND file_surat_selesai IS NULL
  AND catatan_admin IS NULL
);

-- 2. RPC FUNCTION UNTUK FITUR LACAK SURAT WARGA (AMAN DARI DUMP PUBLIK)
CREATE OR REPLACE FUNCTION public.track_surat_secure(p_ticket text, p_nik text DEFAULT NULL)
RETURNS TABLE (
  id text,
  jenis_surat text,
  nama_lengkap text,
  status text,
  catatan_admin text,
  file_surat_selesai text,
  nama_file_selesai text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_nik IS NOT NULL AND trim(p_nik) <> '' THEN
    RETURN QUERY
    SELECT s.id, s.jenis_surat, s.nama_lengkap, s.status, s.catatan_admin, s.file_surat_selesai, s.nama_file_selesai, s.created_at, s.updated_at
    FROM public.permohonan_surat s
    WHERE s.id = trim(p_ticket) AND s.nik = trim(p_nik);
  ELSE
    RETURN QUERY
    SELECT s.id, s.jenis_surat, s.nama_lengkap, s.status, s.catatan_admin, s.file_surat_selesai, s.nama_file_selesai, s.created_at, s.updated_at
    FROM public.permohonan_surat s
    WHERE s.id = trim(p_ticket);
  END IF;
END;
$$;

-- 3. AMANKAN TABEL PROFILES (NIK & NO HP WARGA)
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "User view own profile or admin" ON public.profiles;

-- Profil warga HANYA boleh dibaca oleh pemilik akun bersangkutan atau Admin Desa
CREATE POLICY "User view own profile or admin" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- 4. RPC FUNCTION UNTUK PENGECEKAN REGISTRASI NIK (BOOLEAN SAJA)
CREATE OR REPLACE FUNCTION public.is_nik_registered(p_nik text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE nik = trim(p_nik)
  );
END;
$$;

-- 5. AMANKAN STORAGE BUCKET 'public-images'
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
CREATE POLICY "Admin upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public-images' AND public.is_admin());

-- Pastikan izin akses publik ke RPC functions tersedia
GRANT EXECUTE ON FUNCTION public.track_surat_secure(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_nik_registered(text) TO anon, authenticated;
