import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(30),
  message: z.string().min(1).max(500),
  password: z.string().min(4).max(50),
});

export async function GET() {
  const { data, error } = await supabaseServer
    .from("guestbook_entries")
    .select("id,name,message,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const password_hash = await hashPassword(parsed.data.password);

  const { data, error } = await supabaseServer
    .from("guestbook_entries")
    .insert({
      name: parsed.data.name,
      message: parsed.data.message,
      password_hash,
    })
    .select("id,name,message,created_at,updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}