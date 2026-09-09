-- ==============================================================================
-- MIGRASI DATABASE: FITUR KUNJUNGAN WEBSITE (VISITOR LOGS & REALTIME)
-- File: supabase_migration_visitor_logs.sql
-- Project: Website Desa Bogem (Kecamatan Kawedanan, Kabupaten Magetan)
-- ==============================================================================
-- CARA MENJALANKAN DI SUPABASE:
-- 1. Buka Supabase Dashboard: https://supabase.com/dashboard
-- 2. Pilih project database Desa Bogem Anda
-- 3. Buka menu "SQL Editor" di bilah navigasi sebelah kiri
-- 4. Klik "New Query", paste seluruh isi skrip ini, lalu klik "Run" (Ctrl + Enter)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PEMBUATAN TABEL 'visitor_logs'
-- ------------------------------------------------------------------------------
-- Menggunakan timezone 'Asia/Jakarta' (WIB, UTC+7) untuk kolom created_date (STORED)
-- agar agregasi tanggal konsisten dengan waktu lokal Magetan, Jawa Timur.
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visitor_hash TEXT NOT NULL,
  path TEXT DEFAULT '/',
  created_date DATE GENERATED ALWAYS AS ((visited_at AT TIME ZONE 'Asia/Jakarta')::date) STORED
);

-- ------------------------------------------------------------------------------
-- 2. INDEKS UNTUK PERFORMA QUERY AGREGAT & DEDUPLIKASI HARIAN
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_date 
  ON public.visitor_logs (created_date);

CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor_hash 
  ON public.visitor_logs (visitor_hash);

-- Unique index komposit untuk memastikan dedup 1 hit per pengunjung per hari di level database
CREATE UNIQUE INDEX IF NOT EXISTS idx_visitor_logs_unique_daily 
  ON public.visitor_logs (created_date, visitor_hash);

-- ------------------------------------------------------------------------------
-- 3. KEAMANAN: ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin select all visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Public select visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Public insert visitor_logs" ON public.visitor_logs;

-- Hanya Admin Desa yang diizinkan melakukan SELECT langsung (audit/dashboard admin)
CREATE POLICY "Admin select all visitor_logs" ON public.visitor_logs
  FOR SELECT 
  USING (public.is_admin());

-- Pengunjung publik TIDAK memiliki akses SELECT langsung (data mentah & hash terlindungi).
-- Seluruh akses data publik dilakukan lewat RPC function dengan hak SECURITY DEFINER.

-- ------------------------------------------------------------------------------
-- 4. RPC FUNCTION: record_visit (Pencatatan Kunjungan Atomik & Dedup Database)
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.record_visit(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.record_visit(TEXT);

CREATE OR REPLACE FUNCTION public.record_visit(
  p_visitor_hash TEXT,
  p_path TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_today DATE;
  v_today_count INTEGER;
BEGIN
  -- Validasi input
  IF p_visitor_hash IS NULL OR trim(p_visitor_hash) = '' THEN
    RAISE EXCEPTION 'visitor_hash tidak boleh kosong' USING ERRCODE = '22023';
  END IF;

  -- Hitung tanggal hari ini berdasarkan zona waktu WIB (Asia/Jakarta)
  v_today := (now() AT TIME ZONE 'Asia/Jakarta')::date;

  -- Cek & Insert secara atomik (dedup database-level)
  IF NOT EXISTS (
    SELECT 1 FROM public.visitor_logs
    WHERE created_date = v_today AND visitor_hash = trim(p_visitor_hash)
  ) THEN
    INSERT INTO public.visitor_logs (visitor_hash, path)
    VALUES (trim(p_visitor_hash), NULLIF(trim(p_path), ''))
    ON CONFLICT (created_date, visitor_hash) DO NOTHING;
  END IF;

  -- Kembalikan total kunjungan unik hari ini
  SELECT COUNT(*) INTO v_today_count
  FROM public.visitor_logs
  WHERE created_date = v_today;

  RETURN COALESCE(v_today_count, 0);
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. RPC FUNCTION: get_visitor_stats (Statistik Kunjungan Lengkap Waktu WIB)
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.get_visitor_stats();

CREATE OR REPLACE FUNCTION public.get_visitor_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now_wib TIMESTAMP;
  v_today DATE;
  v_yesterday DATE;
  v_start_minggu_ini DATE;
  v_start_minggu_lalu DATE;
  v_start_bulan_ini DATE;
  v_start_bulan_lalu DATE;
  v_stats JSONB;
BEGIN
  -- Waktu sekarang di Magetan (WIB)
  v_now_wib := now() AT TIME ZONE 'Asia/Jakarta';
  v_today := v_now_wib::date;
  v_yesterday := v_today - 1;

  -- Awal pekan ini (Senin): date_trunc('week', ...) PostgreSQL otomatis Senin
  v_start_minggu_ini := (date_trunc('week', v_now_wib))::date;
  -- Awal pekan lalu (7 hari sebelum Senin pekan ini)
  v_start_minggu_lalu := v_start_minggu_ini - 7;

  -- Awal bulan ini (Tanggal 1)
  v_start_bulan_ini := (date_trunc('month', v_now_wib))::date;
  -- Awal bulan lalu (Tanggal 1 bulan sebelumnya)
  v_start_bulan_lalu := (date_trunc('month', v_now_wib - interval '1 month'))::date;

  -- Agregasi 1-pass yang efisien langsung dari indeks created_date
  SELECT jsonb_build_object(
    'hari_ini', COALESCE(COUNT(*) FILTER (WHERE created_date = v_today), 0),
    'kemarin', COALESCE(COUNT(*) FILTER (WHERE created_date = v_yesterday), 0),
    'minggu_ini', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_minggu_ini AND created_date < v_start_minggu_ini + 7), 0),
    'minggu_lalu', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_minggu_lalu AND created_date < v_start_minggu_ini), 0),
    'bulan_ini', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_bulan_ini AND created_date < (v_start_bulan_ini + interval '1 month')::date), 0),
    'bulan_lalu', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_bulan_lalu AND created_date < v_start_bulan_ini), 0),
    'total_kunjungan', COALESCE(COUNT(*), 0),

    -- Format camelCase tambahan agar langsung cocok dengan tipe TypeScript di Next.js
    'hariIni', COALESCE(COUNT(*) FILTER (WHERE created_date = v_today), 0),
    'kemarin', COALESCE(COUNT(*) FILTER (WHERE created_date = v_yesterday), 0),
    'mingguIni', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_minggu_ini AND created_date < v_start_minggu_ini + 7), 0),
    'mingguLalu', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_minggu_lalu AND created_date < v_start_minggu_ini), 0),
    'bulanIni', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_bulan_ini AND created_date < (v_start_bulan_ini + interval '1 month')::date), 0),
    'bulanLalu', COALESCE(COUNT(*) FILTER (WHERE created_date >= v_start_bulan_lalu AND created_date < v_start_bulan_ini), 0),
    'totalKunjungan', COALESCE(COUNT(*), 0)
  )
  INTO v_stats
  FROM public.visitor_logs;

  RETURN v_stats;
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. HAK AKSES EKSEKUSI RPC UNTUK ROLE PUBLIK (ANON & AUTHENTICATED)
-- ------------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.record_visit(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_visitor_stats() TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 7. PENDAFTARAN REALTIME (UNTUK PERSIAPAN TAHAP 3)
-- ------------------------------------------------------------------------------
-- Daftarkan tabel visitor_logs ke publikasi realtime Supabase
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'visitor_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_logs;
  END IF;
END;
$$;

-- ------------------------------------------------------------------------------
-- 8. QUERY MIGRASI DATA LAMA DARI 'infografis' (OPSIONAL & AMAN DIJALANKAN)
-- ------------------------------------------------------------------------------
-- Memindahkan riwayat kunjungan dari infografis.demografi.visitor_log.daily
-- ke tabel visitor_logs baru agar histori kunjungan sebelumnya tidak hilang.
DO $$
DECLARE
  v_daily JSONB;
  r RECORD;
  i INTEGER;
  v_date_str TEXT;
  v_count INTEGER;
  v_visited_at TIMESTAMPTZ;
  v_migrated_count INTEGER := 0;
BEGIN
  -- Ambil JSON daily jika ada
  SELECT demografi->'visitor_log'->'daily' INTO v_daily
  FROM public.infografis
  WHERE id = 'main';

  IF v_daily IS NOT NULL AND jsonb_typeof(v_daily) = 'object' THEN
    FOR r IN SELECT key, value FROM jsonb_each_text(v_daily)
    LOOP
      v_date_str := r.key;
      v_count := r.value::integer;
      -- Set waktu ke pukul 12:00 WIB
      v_visited_at := (v_date_str || ' 12:00:00+07')::timestamptz;

      IF v_count > 0 THEN
        FOR i IN 1..v_count LOOP
          INSERT INTO public.visitor_logs (visited_at, visitor_hash, path)
          VALUES (
            v_visited_at,
            'legacy_' || v_date_str || '_' || i,
            '/'
          )
          ON CONFLICT (created_date, visitor_hash) DO NOTHING;
          v_migrated_count := v_migrated_count + 1;
        END LOOP;
      END IF;
    END LOOP;
    
    RAISE NOTICE 'Migrasi berhasil: % baris log lama telah dipindahkan.', v_migrated_count;
  ELSE
    RAISE NOTICE 'Tidak ditemukan data historis visitor_log di tabel infografis (dilewati).';
  END IF;
END;
$$;
