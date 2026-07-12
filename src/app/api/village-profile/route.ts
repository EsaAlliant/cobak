/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getActiveAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await (getSupabaseAdmin() as any)
      .from("village_profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      profile: data,
    });
  } catch {
    return NextResponse.json({
      profile: null,
    });
  }
}

export async function PATCH(request: Request) {
  if (!(await getActiveAdminSession())) {
    return NextResponse.json(
      {
        error: "Akses Admin diperlukan.",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body = await request.json();

    const payload = {
      village_name: body.village_name,
      hero_title: body.hero_title,
      hero_description: body.hero_description,
      hero_image_url: body.hero_image_url,
      sejarah: body.sejarah,
      visi: body.visi,
      misi: body.misi,
    };

    const db = getSupabaseAdmin() as any;

    const current = await db
      .from("village_profile")
      .select("id")
      .limit(1)
      .maybeSingle();

    const query = current.data
      ? db
          .from("village_profile")
          .update(payload)
          .eq("id", current.data.id)
      : db
          .from("village_profile")
          .insert(payload);

    const { data, error } = await query
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      profile: data,
    });

  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan profil desa.",
      },
      {
        status: 500,
      }
    );
  }
}