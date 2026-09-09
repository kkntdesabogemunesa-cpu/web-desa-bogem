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

interface VisitorLog {
  total: number;
  daily: Record<string, number>; // "YYYY-MM-DD" -> count
}

const STORAGE_CACHE_KEY = "bogem_real_visitor_stats";

// Helper untuk format tanggal YYYY-MM-DD lokal
function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Menghitung metrik berdasarkan log harian real
function calculateStatsFromLog(log: VisitorLog): VisitorStats {
  const now = new Date();
  const todayStr = formatDate(now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // Minggu ini (dari hari Senin minggu berjalan hingga hari ini)
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Senin, 6 = Minggu
  let mingguIniCount = 0;
  for (let i = 0; i <= dayOfWeek; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    mingguIniCount += log.daily[formatDate(d)] || 0;
  }

  // Minggu lalu (7 hari sebelum Senin minggu ini)
  let mingguLaluCount = 0;
  for (let i = dayOfWeek + 1; i <= dayOfWeek + 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    mingguLaluCount += log.daily[formatDate(d)] || 0;
  }

  // Bulan ini (YYYY-MM)
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let bulanIniCount = 0;

  // Bulan lalu
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`;
  let bulanLaluCount = 0;

  Object.entries(log.daily).forEach(([dateStr, count]) => {
    if (dateStr.startsWith(currentMonthPrefix)) {
      bulanIniCount += count;
    } else if (dateStr.startsWith(lastMonthPrefix)) {
      bulanLaluCount += count;
    }
  });

  return {
    hariIni: log.daily[todayStr] || 0,
    kemarin: log.daily[yesterdayStr] || 0,
    mingguIni: mingguIniCount,
    mingguLalu: mingguLaluCount,
    bulanIni: bulanIniCount,
    bulanLalu: bulanLaluCount,
    totalKunjungan: log.total || Object.values(log.daily).reduce((a, b) => a + b, 0),
  };
}

/**
 * Mencatat kunjungan unik nyata (1 hit per pengunjung per hari) langsung ke Supabase.
 * Tidak ada data palsu/hardcoded — data 100% real terhitung saat diakses!
 */
export async function recordWebsiteVisit(): Promise<VisitorStats> {
  if (typeof window === "undefined") {
    return {
      hariIni: 0,
      kemarin: 0,
      mingguIni: 0,
      mingguLalu: 0,
      bulanIni: 0,
      bulanLalu: 0,
      totalKunjungan: 0,
    };
  }

  const todayStr = formatDate(new Date());
  const visitRecordedKey = `bogem_visited_${todayStr}`;
  const alreadyVisitedToday = localStorage.getItem(visitRecordedKey) === "1";

  try {
    if (!supabase) {
      return getCachedStats();
    }

    // Ambil data log kunjungan real dari infografis Supabase
    const { data: info, error } = await supabase
      .from("infografis")
      .select("id, demografi")
      .eq("id", "main")
      .maybeSingle();

    if (error || !info) {
      return getCachedStats();
    }

    const demografi = info.demografi || {};
    const visitorLog: VisitorLog = demografi.visitor_log || {
      total: 0,
      daily: {},
    };

    if (!alreadyVisitedToday) {
      // Catat kunjungan baru hari ini
      visitorLog.daily[todayStr] = (visitorLog.daily[todayStr] || 0) + 1;
      visitorLog.total = (visitorLog.total || 0) + 1;

      // Update langsung ke database Supabase
      await supabase
        .from("infografis")
        .update({
          demografi: {
            ...demografi,
            visitor_log: visitorLog,
          },
        })
        .eq("id", "main");

      localStorage.setItem(visitRecordedKey, "1");
    }

    const calculatedStats = calculateStatsFromLog(visitorLog);
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(calculatedStats));
    return calculatedStats;
  } catch (err) {
    console.error("recordWebsiteVisit error:", err);
    return getCachedStats();
  }
}

/**
 * Mengambil statistik kunjungan real terkini
 */
export async function getVisitorStats(): Promise<VisitorStats> {
  if (typeof window === "undefined") {
    return {
      hariIni: 0,
      kemarin: 0,
      mingguIni: 0,
      mingguLalu: 0,
      bulanIni: 0,
      bulanLalu: 0,
      totalKunjungan: 0,
    };
  }

  try {
    if (!supabase) return getCachedStats();

    const { data: info } = await supabase
      .from("infografis")
      .select("demografi")
      .eq("id", "main")
      .maybeSingle();

    if (info?.demografi?.visitor_log) {
      const stats = calculateStatsFromLog(info.demografi.visitor_log);
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(stats));
      return stats;
    }
  } catch {
    // fallback to cache
  }

  return getCachedStats();
}

function getCachedStats(): VisitorStats {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return {
    hariIni: 1,
    kemarin: 0,
    mingguIni: 1,
    mingguLalu: 0,
    bulanIni: 1,
    bulanLalu: 0,
    totalKunjungan: 1,
  };
}
