# Orange Smile Dental — เว็บไซต์ (Next.js + Supabase)

เว็บไซต์คลินิกทันตกรรม Orange Smile Dental — 7 สาขา กรุงเทพฯ–พัทยา
พอร์ตมาจากไฟล์ HTML ต้นฉบับใน `Website creation request/` แบบดีไซน์ตรงกัน 100%

- **Next.js 15** (App Router) + **TypeScript**
- **สองภาษา TH/EN** สลับได้ทุกหน้า (จำค่าไว้ใน `localStorage` คีย์ `osd_lang`)
- **รูปภาพทั้งหมดเก็บบน Supabase Storage** (บีบอัดเป็น WebP: 501MB → 17MB)

## หน้าเว็บ

| Route | ไฟล์ต้นฉบับ |
|---|---|
| `/` | Orange Smile Dental.dc.html |
| `/services` | Services.dc.html |
| `/doctors` | Doctors.dc.html |
| `/branches` | Branches.dc.html |
| `/reviews` | Reviews.dc.html |
| `/articles` | Articles.dc.html |

## เริ่มใช้งาน

```bash
npm install
npm run media:prepare   # บีบอัดรูปจาก "Website creation request/" -> public/media
npm run dev
```

เปิด http://localhost:3000 — ตอนนี้รูปจะเสิร์ฟจาก `public/media` (local) ยังไม่ต้องมี Supabase

## ต่อ Supabase

รูปทุกใบเก็บใน Storage bucket ชื่อ `media` และมีตาราง `media_assets` ทำหน้าที่ index
(เก็บ key, หมวด, ขนาด, ที่มาของไฟล์) เพื่อให้ query รูปได้โดยไม่ต้องเดา path

1. สร้าง project ใหม่บน Supabase
2. รัน SQL: `supabase/migrations/0001_media.sql` (ผ่าน SQL Editor หรือ `supabase db push`)
   → สร้าง bucket `media` (public read, เขียนได้เฉพาะ service role) + ตาราง `media_assets`
3. `cp .env.example .env` แล้วกรอกค่า:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (ใช้ตอนอัปโหลดเท่านั้น ห้ามหลุดไปฝั่ง browser)
4. `npm run media:upload` → ดัน `public/media` ทั้งหมดขึ้น Storage + เขียนแถวลง `media_assets`
5. `npm run dev` ใหม่

**วิธีสลับแหล่งรูป:** `src/lib/media.ts` จะใช้ Supabase อัตโนมัติเมื่อมี `NEXT_PUBLIC_SUPABASE_URL`
ถ้าไม่มีจะ fallback ไป `public/media` — เว็บจึงรันได้ทั้งก่อนและหลังมี Supabase

## โครงสร้าง

```
src/
  app/                 # 6 หน้า (ทุกหน้าเป็น client component เพราะมี state ภาษา/ฟิลเตอร์)
  components/          # SiteNav, SiteFooter, Icon, PageStyles
  content/             # เนื้อหา TH/EN ทั้งหมด — แก้ข้อความ/หมอ/สาขา/บทความ ที่นี่ที่เดียว
    gallery.generated.ts   # ← generate อัตโนมัติ อย่าแก้มือ
  lib/                 # lang (TH/EN), reveal (scroll animation), beforeAfter (slider), media (URL)
scripts/
  prepare-media.mjs    # บีบอัดรูป + ดึง hero cover ที่ฝัง base64 มาจาก .image-slots.state.json
  upload-media.mjs     # อัปโหลดขึ้น Supabase
supabase/migrations/   # SQL
```

### แก้เนื้อหา

ข้อความ ชื่อหมอ ข้อมูลสาขา บทความ ราคา — อยู่ใน `src/content/*.ts` ทั้งหมด
ทุกอย่างเป็นคู่ `{ th, en }` เช่น:

```ts
name: { th: 'สาขาบางกะปิ', en: 'Bang Kapi' },
```

> **หมายเหตุ:** ตอนนี้ Supabase เก็บ *เฉพาะรูป* ส่วนเนื้อหาอยู่ในโค้ด
> ถ้าอนาคตจะย้ายบทความไปเก็บใน DB ด้วย ให้เพิ่มตาราง `articles` แล้วเปลี่ยนแค่
> `src/content/articles.ts` ให้ไปดึงจาก Supabase — หน้าเว็บไม่ต้องแก้

### เพิ่ม/เปลี่ยนรูป

วางไฟล์ใน `Website creation request/assets/...` แล้ว `npm run media:prepare && npm run media:upload`
(สคริปต์ข้ามไฟล์ที่ไม่เปลี่ยน จึงรันซ้ำได้เร็ว)

## รายละเอียดที่พอร์ตมาครบ

- สไลเดอร์ **ก่อน–หลัง** ลากเทียบได้ (pointer capture, แยก state ต่อการ์ด)
- **Marquee รีวิว** เลื่อนอัตโนมัติ หยุดเมื่อ hover
- **Scroll reveal** พร้อม failsafe กันเนื้อหาค้างไม่โผล่
- **ฟิลเตอร์** หมวดเคส (Reviews) และหมวดบทความ (Articles)
- **แกลเลอรีเคสจริง 150 รูป** จัดเรียงตามลำดับเดิมเป๊ะ
- Google Maps embed รายสาขา, ปุ่ม LINE/โทร/Facebook, chat dock ลอย, เมนู drawer มือถือ

## Deploy

Deploy บน Vercel ได้เลย — ตั้ง env 3 ตัว (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET`) ใน Project Settings
`SUPABASE_SERVICE_ROLE_KEY` ไม่ต้องใส่บน Vercel (ใช้เฉพาะตอนอัปโหลดรูปจากเครื่อง)

เมื่อรูปอยู่บน Supabase แล้ว `public/media` ไม่ถูกใช้ (และ `.gitignore` ไว้แล้ว)
