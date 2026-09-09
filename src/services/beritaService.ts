import { supabase } from "@/lib/supabase";
import { BeritaItem, CreateBeritaInput } from "@/types/berita";

export const fallbackBeritaList: BeritaItem[] = [];

let cachedBeritaList: { data: BeritaItem[]; timestamp: number } | null = null;
const BERITA_CACHE_TTL_MS = 2 * 60 * 1000; // 2 menit client-side cache

export function clearBeritaCache(): void {
  cachedBeritaList = null;
}

export async function fetchBeritaList(page?: number, limit?: number, forceRefresh = false): Promise<BeritaItem[]> {
  const isFullList = page === undefined && limit === undefined;

  if (isFullList && !forceRefresh && cachedBeritaList && Date.now() - cachedBeritaList.timestamp < BERITA_CACHE_TTL_MS) {
    return cachedBeritaList.data;
  }

  try {
    if (!supabase) return fallbackBeritaList;

    let query = supabase
      .from("berita")
      .select("id, judul, kategori, penulis, ringkasan, konten, gambar, created_at")
      .order("created_at", { ascending: false });

    if (page !== undefined && limit !== undefined) {
      const from = Math.max(0, (page - 1) * limit);
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;

    if (error) {
      console.error("fetchBeritaList error:", error.message);
      return fallbackBeritaList;
    }

    const result = data || fallbackBeritaList;
    if (isFullList) {
      cachedBeritaList = { data: result, timestamp: Date.now() };
    }
    return result;
  } catch (err) {
    console.error("fetchBeritaList exception:", err);
    return fallbackBeritaList;
  }
}

export async function fetchBeritaById(id: string | number): Promise<BeritaItem | null> {
  try {
    if (!supabase) return null;

    const cleanId = decodeURIComponent(String(id)).trim();

    // 1. Direct query by ID
    const { data, error } = await supabase
      .from("berita")
      .select("id, judul, kategori, penulis, ringkasan, konten, gambar, created_at")
      .eq("id", cleanId)
      .maybeSingle();

    if (!error && data) {
      return data;
    }

    // 2. Fallback: Search in full list in case ID types or string formatting differ
    const all = await fetchBeritaList();
    const found = all.find((item) => String(item.id) === cleanId);
    return found || null;
  } catch (err) {
    console.error("fetchBeritaById exception:", err);
    try {
      const all = await fetchBeritaList();
      return all.find((item) => String(item.id) === decodeURIComponent(String(id)).trim()) || null;
    } catch {
      return null;
    }
  }
}

export async function createBerita(input: CreateBeritaInput): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const payload = {
      judul: input.judul.trim(),
      konten: input.konten.trim(),
      penulis: input.penulis?.trim() || "Pemerintah Desa Bogem",
      kategori: input.kategori || "Pengumuman Resmi",
      ringkasan: input.ringkasan?.trim() || null,
      gambar: input.gambar || null,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("berita").insert([payload]);

    if (error) {
      console.error("createBerita error:", error.message);
      return { success: false, error: error.message };
    }

    clearBeritaCache();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat membuat berita.";
    return { success: false, error: msg };
  }
}

export async function updateBerita(
  id: string | number,
  input: Partial<CreateBeritaInput>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const payload: Record<string, unknown> = {};
    if (input.judul !== undefined) payload.judul = input.judul.trim();
    if (input.konten !== undefined) payload.konten = input.konten.trim();
    if (input.penulis !== undefined) payload.penulis = input.penulis.trim();
    if (input.kategori !== undefined) payload.kategori = input.kategori;
    if (input.ringkasan !== undefined) payload.ringkasan = input.ringkasan ? input.ringkasan.trim() : null;
    if (input.gambar !== undefined) payload.gambar = input.gambar || null;

    const { error } = await supabase.from("berita").update(payload).eq("id", id);

    if (error) {
      console.error("updateBerita error:", error.message);
      return { success: false, error: error.message };
    }

    clearBeritaCache();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui berita.";
    return { success: false, error: msg };
  }
}

export async function deleteBerita(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const { error } = await supabase.from("berita").delete().eq("id", id);

    if (error) {
      console.error("deleteBerita error:", error.message);
      return { success: false, error: error.message };
    }

    clearBeritaCache();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus berita.";
    return { success: false, error: msg };
  }
}
