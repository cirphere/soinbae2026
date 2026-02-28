import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabaseServer.storage.createBucket('gallery', {
    public: true,
    fileSizeLimit: 1024 * 1024 * 10,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/*']
  });
  return NextResponse.json({ data, error });
}
