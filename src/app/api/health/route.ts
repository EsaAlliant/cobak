import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const db = getSupabaseAdmin();

    const { error } = await db
      .from("website_settings")
      .select("id")
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: "ok",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
      },
      {
        status: 500,
      }
    );
  }
}