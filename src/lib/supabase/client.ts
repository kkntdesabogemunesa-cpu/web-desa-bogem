import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  return createSupabaseJsClient(supabaseUrl, supabaseAnonKey);
}

// Universal singleton client instance for convenient usage across app
export const supabase = createSupabaseJsClient(supabaseUrl, supabaseAnonKey);
export default supabase;
