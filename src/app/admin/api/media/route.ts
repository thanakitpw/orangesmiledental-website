import { NextResponse, type NextRequest } from 'next/server';
import { getStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Backs the media picker dialog. The library page reads the table directly. */
export async function GET(req: NextRequest) {
  if (!(await getStaff())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const category = params.get('category');
  const q = params.get('q')?.trim();
  const limit = Math.min(Number(params.get('limit')) || 120, 300);

  const supabase = await supabaseServer();
  let query = supabase
    .from('media_assets')
    .select('key, category, gallery_cat, alt_th, alt_en, width, height')
    .order('category')
    .order('key')
    .limit(limit);

  if (category) query = query.eq('category', category);
  // Keys are the only thing an editor can search on that they actually see; alt
  // text is mostly empty on the 278 rows imported from the original handoff.
  if (q) query = query.ilike('key', `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });
}
