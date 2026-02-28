import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(60),
  caption: z.string().max(300).optional().or(z.literal("")),
  password: z.string().min(4).max(50),
  imagePath: z.string().min(1),
});

export async function GET() {
  const bucket = process.env.SUPABASE_GALLERY_BUCKET ?? "gallery";

  const { data, error } = await supabaseServer
    .from("gallery_items")
    .select("id,title,caption,image_path,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const payload = (data ?? []).map((it) => {
    const { data: pub } = supabaseServer.storage.from(bucket).getPublicUrl(it.image_path);
    return {
      id: it.id,
      title: it.title,
      caption: it.caption,
      imagePath: it.image_path,
      imageUrl: pub.publicUrl,
      createdAt: it.created_at,
      updatedAt: it.updated_at,
    };
  });

  return NextResponse.json(payload);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const password_hash = await hashPassword(parsed.data.password);

  const { data, error } = await supabaseServer
    .from("gallery_items")
    .insert({
      title: parsed.data.title,
      caption: parsed.data.caption || null,
      image_path: parsed.data.imagePath,
      password_hash,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}