import { NextResponse, type NextRequest } from 'next/server';
import sharp from 'sharp';
import { getStaff } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase/server';
import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  buildMediaKey,
} from '@/lib/admin/media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? 'media';

/** Long enough that two same-day uploads of `cover.jpg` cannot collide. */
function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Accepts an image, converts it, stores it, and indexes it.
 *
 * The conversion is the point. The original handoff was 501 MB of PNG and JPEG
 * that `scripts/prepare-media.mjs` squeezed to 17 MB of WebP — and nothing about
 * that saving survives if the admin then lets someone upload a 4 MB phone photo
 * straight through. So every raster upload gets the same treatment the batch
 * script applies: capped at 2000px on the long edge and re-encoded as WebP.
 *
 * SVG passes through untouched: it is already small, and rasterising a logo would
 * be a downgrade. It is also the one accepted type that can carry script, so it
 * is served from a bucket on a different origin to the app — never inlined.
 */
export async function POST(req: NextRequest) {
  if (!(await getStaff())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  const category = (form.get('category') ?? 'media').toString();
  const galleryCat = (form.get('gallery_cat') ?? '').toString() || null;
  const altTh = (form.get('alt_th') ?? '').toString().trim() || null;
  const altEn = (form.get('alt_en') ?? '').toString().trim() || null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 });
  }
  if (!ACCEPTED_UPLOAD_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'รองรับเฉพาะไฟล์ WebP, PNG, JPEG และ SVG' }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'ไฟล์ใหญ่เกิน 10 MB' }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());

  let body: Buffer;
  let contentType: string;
  let extension: string;
  let width: number | null = null;
  let height: number | null = null;

  if (file.type === 'image/svg+xml') {
    body = input;
    contentType = 'image/svg+xml';
    extension = 'svg';
  } else {
    try {
      const pipeline = sharp(input)
        // Phone photos carry orientation in EXIF; without this they land sideways.
        .rotate()
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 });

      const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
      body = data;
      width = info.width;
      height = info.height;
    } catch {
      return NextResponse.json({ error: 'อ่านไฟล์รูปไม่ได้ ไฟล์อาจเสียหาย' }, { status: 400 });
    }
    contentType = 'image/webp';
    extension = 'webp';
  }

  const key = buildMediaKey({
    category,
    galleryCat,
    filename: file.name,
    suffix: randomSuffix(),
    extension,
  });

  const supabase = await supabaseServer();

  // upsert:false so a key collision surfaces instead of silently replacing an
  // image that some other page is already pointing at.
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(key, body, { contentType, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: `อัปโหลดไม่สำเร็จ: ${uploadError.message}` }, { status: 500 });
  }

  const row = {
    key,
    category,
    gallery_cat: category === 'gallery' ? galleryCat : null,
    width,
    height,
    bytes: body.byteLength,
    alt_th: altTh,
    alt_en: altEn,
    source_path: `admin-upload/${file.name}`,
  };

  const { data, error } = await supabase.from('media_assets').insert(row).select().single();

  if (error) {
    // The object is already in the bucket; leaving it there with no index row
    // would make it invisible to every screen that lists media.
    await supabase.storage.from(BUCKET).remove([key]);
    return NextResponse.json({ error: `บันทึกข้อมูลรูปไม่สำเร็จ: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
