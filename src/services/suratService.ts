import { supabase } from "@/lib/supabase";
import {
  PermohonanSurat,
  CreatePermohonanInput,
  StatusSurat,
  OpsiSurat,
  defaultOpsiSuratList,
} from "@/types/surat";

// Generate unique ticket code: SRT-YYYYMM-XXXXXX (6-char alphanumeric keyspace)
export function generateTicketCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Tanpa 0/O, 1/I untuk mencegah kebingungan baca
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SRT-${year}${month}-${random}`;
}

// ==========================================
// 1. PENGELOLAAN OPSI JENIS SURAT
// ==========================================

export async function fetchOpsiSuratList(): Promise<OpsiSurat[]> {
  try {
    if (!supabase) return defaultOpsiSuratList;

    const { data, error } = await supabase
      .from("opsi_surat")
      .select("id, nama_surat, deskripsi, syarat, custom_fields")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultOpsiSuratList;
    }

    return data.map((d: any) => ({
      id: d.id,
      nama_surat: d.nama_surat,
      deskripsi: d.deskripsi || "",
      syarat: d.syarat || "",
      custom_fields: d.custom_fields || [],
    }));
  } catch (err) {
    console.error("fetchOpsiSuratList error:", err);
    return defaultOpsiSuratList;
  }
}

export async function saveOpsiSuratList(
  list: OpsiSurat[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const payload = list.map((o) => ({
      id: o.id,
      nama_surat: o.nama_surat,
      deskripsi: o.deskripsi || "",
      syarat: o.syarat || "",
      custom_fields: o.custom_fields || [],
    }));

    const { error } = await supabase.from("opsi_surat").upsert(payload);

    if (error) {
      console.error("saveOpsiSuratList error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan opsi surat.";
    return { success: false, error: msg };
  }
}

// ==========================================
// 2. PENGELOLAAN PERMOHONAN SURAT WARGA
// ==========================================

/**
 * Fetch surat applications with pagination support (Admin Dashboard Only)
 */
export async function fetchSuratList(page: number = 1, limit: number = 50): Promise<PermohonanSurat[]> {
  try {
    if (!supabase) return [];

    const from = Math.max(0, (page - 1) * limit);
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("permohonan_surat")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("fetchSuratList error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("fetchSuratList exception:", err);
    return [];
  }
}

/**
 * Fetch ONLY surat applications belonging to a specific citizen user (by User ID or NIK)
 * Sanitizes input parameters to prevent query injection into PostgREST filter
 */
export async function fetchUserSuratList(userId?: string, nik?: string): Promise<PermohonanSurat[]> {
  try {
    if (!supabase) return [];
    if (!userId && !nik) return [];

    const cleanNik = nik && /^[0-9]{16}$/.test(nik.trim()) ? nik.trim() : null;
    const cleanUserId = userId && /^[0-9a-fA-F-]{36}$/.test(userId.trim()) ? userId.trim() : null;

    if (!cleanUserId && !cleanNik) return [];

    let query = supabase
      .from("permohonan_surat")
      .select("*")
      .order("created_at", { ascending: false });

    if (cleanUserId && cleanNik) {
      query = query.or(`user_id.eq.${cleanUserId},nik.eq.${cleanNik}`);
    } else if (cleanUserId) {
      query = query.eq("user_id", cleanUserId);
    } else if (cleanNik) {
      query = query.eq("nik", cleanNik);
    }

    const { data, error } = await query;

    if (error) {
      console.error("fetchUserSuratList error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("fetchUserSuratList exception:", err);
    return [];
  }
}

/**
 * Track a specific surat by Ticket ID AND citizen NIK.
 * NIK is strictly mandatory to prevent brute-force enumeration of ticket IDs!
 */
export async function searchSuratByTicket(ticketId: string, nik?: string): Promise<PermohonanSurat | null> {
  try {
    if (!supabase) return null;

    const cleanTicket = ticketId?.trim();
    const cleanNik = nik?.trim();

    // NIK wajib ada dan minimal 16 karakter untuk menjaga privasi warga!
    if (!cleanTicket || !cleanNik || cleanNik.length < 16) {
      return null;
    }

    // 1. Coba lewat RPC function 'track_surat_secure'
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc("track_surat_secure", {
        p_ticket: cleanTicket,
        p_nik: cleanNik,
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        return rpcData[0] as PermohonanSurat;
      }
      if (!rpcError && rpcData && rpcData.length === 0) {
        return null;
      }
    } catch {
      // Fallback jika RPC belum di-run di Supabase
    }

    // 2. Fallback query langsung: WAJIB menyertakan .eq("nik", cleanNik)!
    const { data, error } = await supabase
      .from("permohonan_surat")
      .select("id, jenis_surat, nama_lengkap, status, catatan_admin, file_surat_selesai, nama_file_selesai, created_at, updated_at")
      .eq("id", cleanTicket)
      .eq("nik", cleanNik)
      .maybeSingle();

    if (error) {
      console.error("searchSuratByTicket error:", error.message);
      return null;
    }

    return (data as PermohonanSurat) || null;
  } catch (err) {
    console.error("searchSuratByTicket exception:", err);
    return null;
  }
}

export async function createPermohonanSurat(
  input: CreatePermohonanInput
): Promise<{ success: boolean; data?: PermohonanSurat; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    // Validasi server-side
    const cleanNik = input.nik?.trim() || "";
    if (!cleanNik || cleanNik.length !== 16 || !/^[0-9]{16}$/.test(cleanNik)) {
      return { success: false, error: "NIK pemohon wajib 16 digit angka sesuai KTP." };
    }
    if (!input.nama_lengkap || input.nama_lengkap.trim().length < 2) {
      return { success: false, error: "Nama lengkap pemohon wajib diisi." };
    }
    if (!input.no_whatsapp || input.no_whatsapp.trim().length < 9) {
      return { success: false, error: "Nomor WhatsApp wajib diisi dengan benar." };
    }
    if (!input.jenis_surat || input.jenis_surat.trim().length < 2) {
      return { success: false, error: "Jenis surat yang diajukan wajib dipilih." };
    }

    const now = new Date().toISOString();
    let retries = 3;
    let lastErrorMsg = "";

    // Retry-on-conflict: jika terjadi tabrakan primary key ticketId (error 23505), generate ulang
    while (retries > 0) {
      const ticketId = generateTicketCode();
      const newSurat: PermohonanSurat = {
        id: ticketId,
        user_id: input.user_id || undefined,
        opsi_surat_id: input.opsi_surat_id || undefined,
        nik: cleanNik,
        nama_lengkap: input.nama_lengkap.trim(),
        no_whatsapp: input.no_whatsapp.trim(),
        email: input.email?.trim() || undefined,
        jenis_surat: input.jenis_surat.trim(),
        data_formulir: input.data_formulir || {},
        status: "MENUNGGU",
        created_at: now,
        updated_at: now,
      };

      const { error } = await supabase.from("permohonan_surat").insert([newSurat]);

      if (!error) {
        return { success: true, data: newSurat };
      }

      // Jika collision (duplicate key code 23505), coba lagi
      if (error.code === "23505" || error.message.includes("duplicate key")) {
        retries--;
        continue;
      }

      lastErrorMsg = error.message;
      break;
    }

    return { success: false, error: lastErrorMsg || "Gagal membuat permohonan surat. Silakan coba lagi." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengajukan permohonan surat.";
    return { success: false, error: msg };
  }
}

export async function updateStatusDanFileSurat(
  id: string,
  updates: {
    status: StatusSurat;
    file_surat_selesai?: string;
    nama_file_selesai?: string;
    catatan_admin?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const payload: Record<string, any> = {
      status: updates.status,
      updated_at: new Date().toISOString(),
    };

    if (updates.file_surat_selesai !== undefined) payload.file_surat_selesai = updates.file_surat_selesai;
    if (updates.nama_file_selesai !== undefined) payload.nama_file_selesai = updates.nama_file_selesai;
    if (updates.catatan_admin !== undefined) payload.catatan_admin = updates.catatan_admin;

    const { error } = await supabase
      .from("permohonan_surat")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("updateStatusDanFileSurat error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memperbarui permohonan surat.";
    return { success: false, error: msg };
  }
}

export async function deletePermohonanSurat(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not available." };

    const { error } = await supabase.from("permohonan_surat").delete().eq("id", id);

    if (error) {
      console.error("deletePermohonanSurat error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus permohonan surat.";
    return { success: false, error: msg };
  }
}
