/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { getActiveAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await (getSupabaseAdmin() as any)
      .from("potensi_desa")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  if (!(await getActiveAdminSession())) {
    return NextResponse.json(
      { error: "Akses Admin diperlukan." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const { data, error } = await (getSupabaseAdmin() as any)
      .from("potensi_desa")
      .insert({
        title: body.title,
        description: body.description,
        icon: body.icon,
        image_url: body.image_url,
        sort_order: Number(body.sort_order || 0),
        is_published: body.is_published ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambah data.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await getActiveAdminSession())) {
    return NextResponse.json(
      { error: "Akses Admin diperlukan." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const { data, error } = await (getSupabaseAdmin() as any)
      .from("potensi_desa")
      .update({
        title: body.title,
        description: body.description,
        icon: body.icon,
        image_url: body.image_url,
        sort_order: Number(body.sort_order || 0),
        is_published: body.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui data.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await getActiveAdminSession())) {
    return NextResponse.json(
      { error: "Akses Admin diperlukan." },
      { status: 403 }
    );
  }

  try {
    const { id } = await request.json();

    const { error } = await (getSupabaseAdmin() as any)
      .from("potensi_desa")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus data.",
      },
      {
        status: 500,
      }
    );
  }
}