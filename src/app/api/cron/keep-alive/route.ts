import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Optional Bearer token validation if CRON_SECRET is configured in Vercel environment variables
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client not initialized" },
      { status: 500 }
    );
  }

  const startTime = Date.now();

  try {
    // Lightweight query to keep the Supabase database active & reset the 7-day pause timer
    const { data, error } = await supabase
      .from("profil_desa")
      .select("id, updated_at")
      .limit(1)
      .maybeSingle();

    const durationMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Keep-alive query encountered a database error",
          error: error.message,
          durationMs,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive ping successful. Inactivity timer reset.",
      timestamp: new Date().toISOString(),
      durationMs,
      recordFound: !!data,
    });
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: msg,
        durationMs,
      },
      { status: 500 }
    );
  }
}
