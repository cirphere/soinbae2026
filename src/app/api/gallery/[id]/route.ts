import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/password";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(60),
  caption: z.string().max(300).optional().or(z.literal("")),
  password: z.string().min(4).max(50),
  newImagePath: z.string().min(1).optional(), // 교체 시만 전달
});

const deleteSchema = z.object({
  password: z.string().min(4).max(50),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const bucket = process.env.SUPABASE_GALLERY_BUCKET ?? "gallery";

  const { data: found, error: findErr } = await supabaseServer
    .from("gallery_items")
    .select("id,password_hash,image_path")
    .eq("id", id)
    .single();

  if (findErr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await verifyPassword(parsed.data.password, found.password_hash);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const nextPath = parsed.data.newImagePath ?? found.image_path;

  const { error: upErr } = await supabaseServer
    .from("gallery_items")
    .update({
      title: parsed.data.title,
      caption: parsed.data.caption || null,
      image_path: nextPath,
    })
    .eq("id", id);

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  // 이미지 교체면 기존 파일 삭제
  if (parsed.data.newImagePath && parsed.data.newImagePath !== found.image_path) {
    await supabaseServer.storage.from(bucket).remove([found.image_path]);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const bucket = process.env.SUPABASE_GALLERY_BUCKET ?? "gallery";

  const { data: found, error: findErr } = await supabaseServer
    .from("gallery_items")
    .select("id,password_hash,image_path")
    .eq("id", id)
    .single();

  if (findErr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await verifyPassword(parsed.data.password, found.password_hash);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  await supabaseServer.storage.from(bucket).remove([found.image_path]);

  const { error: delErr } = await supabaseServer
    .from("gallery_items")
    .delete()
    .eq("id", id);

  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}