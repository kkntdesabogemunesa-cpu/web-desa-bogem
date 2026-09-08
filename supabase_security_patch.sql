-- ==============================================================================
-- SUPABASE SECURITY PATCH (LENGKAP) - DESA BOGEM
-- Jalankan skrip ini di SQL Editor Supabase Dashboard Anda.
-- Mengamankan RLS Permohonan Surat, Profil Warga, Storage, & Pencegahan Privilege Escalation
-- ==============================================================================

-- 0. PASTIKAN STRUKTUR KOLOM TABEL INFOGRAFIS TERBARU
ALTER TABLE public.infografis ADD COLUMN IF NOT EXISTS organisasi JSONB DEFAULT '[]'::jsonb;

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

-- 2. RPC FUNCTION UNTUK FITUR LACAK SURAT WARGA (WAJIB KODE TIKET + NIK)
-- Mencegah enumerasi / brute-force: NIK diwajibkan secara mutlak!
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
  SELECT s.id, s.jenis_surat, s.nama_lengkap, s.status, s.catatan_admin, s.file_surat_selesai, s.nama_file_selesai, s.created_at, s.updated_at
  FROM public.permohonan_surat s
  WHERE s.id = trim(p_ticket) AND s.nik = trim(p_nik);
END;
$$;

-- 3. AMANKAN TABEL PROFILES (NIK & NO HP WARGA)
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "User view own profile or admin" ON public.profiles;
DROP POLICY IF EXISTS "User update own profile" ON public.profiles;

-- Profil warga HANYA boleh dibaca oleh pemilik akun bersangkutan atau Admin Desa
CREATE POLICY "User view own profile or admin" ON public.profiles
FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- User boleh mengupdate profil sendiri, tapi kolom role TIDAK BISA diubah ke admin
CREATE POLICY "User update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id OR public.is_admin())
WITH CHECK (
  (auth.uid() = id AND role = 'warga') OR public.is_admin()
);

-- 4. TRIGGER MUTLAK PENCEGAHAN PRIVILEGE ESCALATION (ROLE INJECTION)
-- Mencegah injeksi { role: 'admin' } baik saat INSERT (signUp) maupun UPDATE dari client!
DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_profile_role();
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Saat user baru terdaftar (INSERT):
  -- Jika bukan Admin asli yang menjalankan, paksa role selalu 'warga'
  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin() THEN
      NEW.role := 'warga';
    END IF;
  END IF;

  -- Saat profil diperbarui (UPDATE):
  -- Non-admin DILARANG KERAS mengubah isi kolom role!
  IF TG_OP = 'UPDATE' THEN
    IF NOT public.is_admin() AND NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Akses Ditolak: Anda tidak memiliki izin untuk memodifikasi hak akses (role).';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- 5. RPC FUNCTION UNTUK PENGECEKAN REGISTRASI NIK (BOOLEAN SAJA)
DROP FUNCTION IF EXISTS public.is_nik_registered(text);
DROP FUNCTION IF EXISTS public.is_nik_registered;
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

-- 6. AMANKAN STORAGE BUCKET 'public-images'
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
CREATE POLICY "Admin upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public-images' AND public.is_admin());

-- 7. RATE LIMITING PADA PERMOHONAN SURAT (MAKSIMAL 3 PENGAJUAN PER 10 MENIT PER NIK)
-- Bekerja di level database, aman untuk serverless & mencegah spam direct API
DROP TRIGGER IF EXISTS trg_surat_rate_limit ON public.permohonan_surat;
DROP FUNCTION IF EXISTS public.check_surat_rate_limit();
CREATE OR REPLACE FUNCTION public.check_surat_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.permohonan_surat
  WHERE nik = NEW.nik
    AND created_at >= (NOW() - INTERVAL '10 minutes');

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maksimal 3 permohonan surat per 10 menit untuk NIK ini.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_surat_rate_limit ON public.permohonan_surat;
CREATE TRIGGER trg_surat_rate_limit
  BEFORE INSERT ON public.permohonan_surat
  FOR EACH ROW
  EXECUTE FUNCTION public.check_surat_rate_limit();

-- Pastikan izin akses publik ke RPC functions tersedia
GRANT EXECUTE ON FUNCTION public.track_surat_secure(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_nik_registered(text) TO anon, authenticated;

