import { supabase } from "@/lib/supabase";

export interface VisitorStats {
  hariIni: number;
  kemarin: number;
  mingguIni: number;
  mingguLalu: number;
  bulanIni: number;
  bulanLalu: number;
  totalKunjungan: number;
}

const STORAGE_CACHE_KEY = "bogem_real_visitor_stats";

/**
 * Menghasilkan tanggal hari ini dalam format YYYY-MM-DD sesuai zona waktu Asia/Jakarta (WIB).
 */
export function getTodayWIB(): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date()); // Output: "YYYY-MM-DD"
  } catch {
    // Fallback perhitungan manual offset UTC+7 (WIB)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utc + 7 * 3600000);
    const y = wib.getFullYear();
    const m = String(wib.getMonth() + 1).padStart(2, "0");
    const d = String(wib.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

/**
 * Menghasilkan hash unik per browser pengunjung (privacy-friendly, tanpa IP mentah).
 * Menggunakan kombinasi User-Agent, resolusi layar, color depth, dan timezone offset.
 */
export async function generateVisitorHash(): Promise<string> {
  if (typeof window === "undefined") {
    return "server-env";
  }

  const nav = window.navigator;
  const scr = window.screen;
  const tzOffset = new Date().getTimezoneOffset();

  const fingerprintRaw = [
    nav.userAgent || "",
    scr?.width || 0,
    scr?.height || 0,
    scr?.colorDepth || 0,
    tzOffset,
  ].join("###");

  // Gunakan Web Crypto API jika tersedia di Secure Context (HTTPS / localhost)
  if (typeof window.crypto !== "undefined" && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(fingerprintRaw);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fallback ke hash djb2 jika digest gagal
    }
  }

  // Fallback: Algoritma hash string djb2 sederhana jika non-secure / HTTP
  return fallbackDjb2Hash(fingerprintRaw);
}

function fallbackDjb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Konversi ke integer 32-bit
  }
  return `djb2_${Math.abs(hash).toString(16)}`;
}

function parseStatsResponse(raw: unknown): VisitorStats {
  const data = (typeof raw === "string" ? JSON.parse(raw) : raw) as Record<string, unknown> || {};
  return {
    hariIni: Number(data.hariIni ?? data.hari_ini ?? 0),
    kemarin: Number(data.kemarin ?? 0),
    mingguIni: Number(data.mingguIni ?? data.minggu_ini ?? 0),
    mingguLalu: Number(data.mingguLalu ?? data.minggu_lalu ?? 0),
    bulanIni: Number(data.bulanIni ?? data.bulan_ini ?? 0),
    bulanLalu: Number(data.bulanLalu ?? data.bulan_lalu ?? 0),
    totalKunjungan: Number(data.totalKunjungan ?? data.total_kunjungan ?? 0),
  };
}

const STORAGE_TIME_KEY = "bogem_real_visitor_stats_time";
const STATS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit TTL untuk hemat kuota Supabase

function isStatsCacheFresh(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const time = localStorage.getItem(STORAGE_TIME_KEY);
    if (!time) return false;
    return Date.now() - Number(time) < STATS_CACHE_TTL_MS;
  } catch {
    return false;
  }
}

function getCachedStats(): VisitorStats | null {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cached) {
        return parseStatsResponse(JSON.parse(cached));
      }
    } catch {
      // abaikan jika parsing cache gagal
    }
  }
  return null;
}

/**
 * Mencatat kunjungan website unik harian secara atomik ke database via RPC record_visit
 * dan mengembalikan statistik agregat terkini via RPC get_visitor_stats.
 */
export async function recordWebsiteVisit(): Promise<VisitorStats | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const todayWIB = getTodayWIB();
  const visitRecordedKey = `bogem_visited_${todayWIB}`;
  const alreadyVisitedToday = localStorage.getItem(visitRecordedKey) === "1";

  // Jika pengunjung sudah tercatat hari ini dan cache statistik masih segar (< 5 menit),
  // kembalikan cache lokal tanpa membuang RPC call ke Supabase
  if (alreadyVisitedToday && isStatsCacheFresh()) {
    const cached = getCachedStats();
    if (cached) return cached;
  }

  try {
    if (!supabase) {
      return getCachedStats();
    }

    // 1. Optimistic check di client via localStorage:
    // Jika hari ini belum tercatat di browser, panggil RPC record_visit
    if (!alreadyVisitedToday) {
      const hash = await generateVisitorHash();
      const currentPath = window.location.pathname || "/";

      const { error: recordError } = await supabase.rpc("record_visit", {
        p_visitor_hash: hash,
        p_path: currentPath,
      });

      if (!recordError) {
        // Tandai di localStorage bahwa kunjungan hari ini sudah berhasil dicatat
        localStorage.setItem(visitRecordedKey, "1");
      } else {
        console.warn("record_visit RPC warning:", recordError.message);
      }
    }

    // 2. Ambil statistik terbaru dari RPC get_visitor_stats
    const { data: statsData, error: statsError } = await supabase.rpc("get_visitor_stats");

    if (statsError || !statsData) {
      console.warn("get_visitor_stats RPC warning:", statsError?.message);
      return getCachedStats();
    }

    const calculatedStats = parseStatsResponse(statsData);
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(calculatedStats));
    localStorage.setItem(STORAGE_TIME_KEY, String(Date.now()));
    return calculatedStats;
  } catch (err) {
    console.error("recordWebsiteVisit error:", err);
    return getCachedStats();
  }
}

/**
 * Mengambil statistik kunjungan terkini tanpa mencatat hit baru.
 */
export async function getVisitorStats(forceRefresh = false): Promise<VisitorStats | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (!forceRefresh && isStatsCacheFresh()) {
    const cached = getCachedStats();
    if (cached) return cached;
  }

  try {
    if (!supabase) return getCachedStats();

    const { data: statsData, error: statsError } = await supabase.rpc("get_visitor_stats");

    if (statsError || !statsData) {
      console.warn("get_visitor_stats RPC warning:", statsError?.message);
      return getCachedStats();
    }

    const stats = parseStatsResponse(statsData);
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(stats));
    localStorage.setItem(STORAGE_TIME_KEY, String(Date.now()));
    return stats;
  } catch (err) {
    console.error("getVisitorStats error:", err);
    return getCachedStats();
  }
}
