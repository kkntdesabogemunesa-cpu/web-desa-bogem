import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function verifyAdminSession(req?: Request): Promise<{ isAdmin: boolean; error?: string; user?: any }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !supabaseAnonKey) {
      return { isAdmin: false, error: "Server Supabase config is missing." };
    }

    // 1. Try Bearer token from Request Authorization header if provided
    let token: string | undefined;
    if (req) {
      const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    // 2. Try cookie session
    if (!token) {
      try {
        const cookieStore = await cookies();
        // Check common Supabase cookie names
        const allCookies = cookieStore.getAll();
        const sbCookie = allCookies.find(
          (c) => c.name.includes("-auth-token") || c.name.includes("sb-access-token")
        );
        if (sbCookie) {
          try {
            // Might be JSON string array [access_token, refresh_token]
            const parsed = JSON.parse(sbCookie.value);
            token = Array.isArray(parsed) ? parsed[0] : parsed.access_token || sbCookie.value;
          } catch {
            token = sbCookie.value;
          }
        }
      } catch {
        // cookies() might not be available
      }
    }

    const supabase = createSupabaseJsClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { isAdmin: false, error: "Unauthorized: Silakan masuk terlebih dahulu." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return { isAdmin: false, error: "Forbidden: Hak akses pengelola desa diperlukan." };
    }

    return { isAdmin: true, user };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memverifikasi sesi admin.";
    return { isAdmin: false, error: msg };
  }
}
