import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { z } from "zod";

const reqSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1).optional(),
});

function safeExt(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const cleaned = ext.replace(/[^a-z0-9]/g, "").slice(0, 10);
  return cleaned || "bin";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = reqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const bucket = process.env.SUPABASE_GALLERY_BUCKET ?? "gallery";
  const ext = safeExt(parsed.data.fileName);
  const yyyyMm = new Date().toISOString().slice(0, 7).replace("-", "/");
  const path = `${yyyyMm}/${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabaseServer.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "signed upload error" }, { status: 500 });
  }

  // public 버킷이면 public URL 반환 가능
  const { data: pub } = supabaseServer.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    bucket,
    path: data.path,
    token: data.token,
    publicUrl: pub.publicUrl,
    contentType: parsed.data.contentType ?? "application/octet-stream",
  });
}