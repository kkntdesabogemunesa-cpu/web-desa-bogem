import { supabase } from "@/lib/supabase";
import {
  PermohonanSurat,
  CreatePermohonanInput,
  StatusSurat,
  OpsiSurat,
  defaultOpsiSuratList,
  PengaturanSurat,
  defaultPengaturanSurat,
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

    return (data as Array<Record<string, unknown>>).map((d) => ({
      id: String(d.id || ""),
      nama_surat: String(d.nama_surat || ""),
      deskripsi: String(d.deskripsi || ""),
      syarat: String(d.syarat || ""),
      custom_fields: Array.isArray(d.custom_fields) ? (d.custom_fields as OpsiSurat["custom_fields"]) : [],
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

    const payload: Record<string, unknown> = {
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

    // 1. Eksekusi DELETE dengan .select() untuk memastikan baris benar-benar terhapus di database
    const { data, error } = await supabase
      .from("permohonan_surat")
      .delete()
      .eq("id", id)
      .select();

    if (!error && data && data.length > 0) {
      return { success: true };
    }

    if (error) {
      console.error("deletePermohonanSurat error:", error.message);
      return { success: false, error: error.message };
    }

    // Jika data kosong tanpa error, berarti RLS Supabase memblokir operasi hapus
    console.warn("deletePermohonanSurat: 0 rows deleted for id:", id);
    return {
      success: false,
      error: "Gagal menghapus dari database. Izin ditolak oleh RLS Supabase. Pastikan script SQL patch di supabase_patch_surat_keterangan.sql telah di-run di SQL Editor Supabase.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus permohonan surat.";
    return { success: false, error: msg };
  }
}

// ==========================================
// 3. PENGELOLAAN FORMAT & PEJABAT SURAT
// ==========================================

const LOCAL_STORAGE_KEY_PENGATURAN_SURAT = "desa_bogem_pengaturan_surat";

export async function fetchPengaturanSurat(): Promise<PengaturanSurat> {
  // 1. Coba ambil dari Supabase
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("pengaturan_surat")
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (!error && data) {
        return {
          nama_instansi: data.nama_instansi || defaultPengaturanSurat.nama_instansi,
          nama_kecamatan: data.nama_kecamatan || defaultPengaturanSurat.nama_kecamatan,
          nama_desa: data.nama_desa || defaultPengaturanSurat.nama_desa,
          alamat_kantor: data.alamat_kantor || defaultPengaturanSurat.alamat_kantor,
          telepon_kantor: data.telepon_kantor || defaultPengaturanSurat.telepon_kantor,
          email_kantor: data.email_kantor || defaultPengaturanSurat.email_kantor,
          kodepos: data.kodepos || defaultPengaturanSurat.kodepos,
          nama_pejabat: data.nama_pejabat || defaultPengaturanSurat.nama_pejabat,
          jabatan_pejabat: data.jabatan_pejabat || defaultPengaturanSurat.jabatan_pejabat,
          nip_pejabat: data.nip_pejabat ?? defaultPengaturanSurat.nip_pejabat,
          alamat_pejabat: data.alamat_pejabat || defaultPengaturanSurat.alamat_pejabat,
          kode_klasifikasi: data.kode_klasifikasi || defaultPengaturanSurat.kode_klasifikasi,
          kode_wilayah: data.kode_wilayah || defaultPengaturanSurat.kode_wilayah,
          nomor_urut_terakhir: typeof data.nomor_urut_terakhir === "number" ? data.nomor_urut_terakhir : defaultPengaturanSurat.nomor_urut_terakhir,
        };
      }
    }
  } catch {
    // Fallback jika tabel belum dibuat di Supabase
  }

  // 2. Coba ambil dari localStorage jika di browser
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY_PENGATURAN_SURAT);
      if (local) {
        const parsed = JSON.parse(local);
        return { ...defaultPengaturanSurat, ...parsed };
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback nilai default resmi Desa Bogem
  return defaultPengaturanSurat;
}

export async function savePengaturanSurat(
  config: PengaturanSurat
): Promise<{ success: boolean; error?: string }> {
  // Simpan ke localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PENGATURAN_SURAT, JSON.stringify(config));
    } catch {
      // ignore
    }
  }

  // Coba simpan ke Supabase jika tabel tersedia
  try {
    if (supabase) {
      const { error } = await supabase.from("pengaturan_surat").upsert({
        id: "default",
        ...config,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn("Simpan ke Supabase pengaturan_surat warning (menggunakan localStorage):", error.message);
      }
    }
    return { success: true };
  } catch {
    return { success: true };
  }
}

export function formatNomorSurat(
  pengaturan: PengaturanSurat,
  nomorUrut?: number | string,
  tahun?: number | string
): string {
  const no = nomorUrut !== undefined && nomorUrut !== "" ? nomorUrut : pengaturan.nomor_urut_terakhir;
  const th = tahun || new Date().getFullYear();
  return `${pengaturan.kode_klasifikasi} / ${no} / ${pengaturan.kode_wilayah} / ${th}`;
}
