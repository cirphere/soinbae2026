import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/password";
import { z } from "zod";

const updateSchema = z.object({
  message: z.string().min(1).max(500),
  password: z.string().min(4).max(50),
});

const deleteSchema = z.object({
  password: z.string().min(4).max(50),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: found, error: findErr } = await supabaseServer
    .from("guestbook_entries")
    .select("id,password_hash")
    .eq("id", id)
    .single();

  if (findErr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await verifyPassword(parsed.data.password, found.password_hash);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const { data: updated, error: upErr } = await supabaseServer
    .from("guestbook_entries")
    .update({ message: parsed.data.message })
    .eq("id", id)
    .select("id,name,message,created_at,updated_at")
    .single();

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: found, error: findErr } = await supabaseServer
    .from("guestbook_entries")
    .select("id,password_hash")
    .eq("id", id)
    .single();

  if (findErr) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await verifyPassword(parsed.data.password, found.password_hash);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const { error: delErr } = await supabaseServer
    .from("guestbook_entries")
    .delete()
    .eq("id", id);

  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}