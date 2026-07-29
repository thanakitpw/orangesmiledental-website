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

## หลังบ้าน (`/admin`)

เนื้อหาทั้งเว็บแก้ได้จากหลังบ้านโดยไม่ต้อง deploy ใหม่ — บทความ รูปภาพ รีวิว เคส before/after
แกลเลอรี ทีมหมอ สาขา บริการ และข้อมูลติดต่อ

### เปิดใช้ครั้งแรก

1. **ปิดการสมัครสมาชิกสาธารณะ** — Supabase Dashboard → Authentication → Sign In / Providers →
   ปิด *Allow new users to sign up*
2. เพิ่มอีเมลทีมงานลง allowlist ก่อน (เป็นด่านที่สอง เผื่อข้อ 1 ถูกเปิดกลับโดยไม่ตั้งใจ):
   ```sql
   insert into public.staff_allowlist (email, note)
   values ('someone@clinic.com', 'ชื่อ-หน้าที่');
   ```
3. Dashboard → Authentication → Users → **Add user** ด้วยอีเมลเดียวกัน
4. เข้า `/admin/login`

อีเมลที่ไม่อยู่ใน `staff_allowlist` จะ login ผ่านแต่ไม่ได้ profile → เข้าหลังบ้านไม่ได้
และ RLS ปฏิเสธทุกการเขียน (ทดสอบไว้แล้วใน migration 0005/0007)

ทีมงานทุกคนมีสิทธิ์เท่ากัน ไม่มีระบบแยก role — เหมาะกับทีม 2–5 คนที่ทำงานด้วยกัน

### เนื้อหาอยู่ที่ไหน

| ข้อมูล | ตาราง | เมนูหลังบ้าน |
|---|---|---|
| บทความ | `articles` + `article_translations` | บทความ |
| รูปทั้งหมด | Storage `media` + `media_assets` | คลังรูปภาพ |
| รีวิวลูกค้า | `reviews` | รีวิวลูกค้า |
| เคส before/after | `cases` | เคส Before/After |
| แกลเลอรีผลงาน | `gallery_items` + `gallery_categories` | แกลเลอรีผลงาน |
| ทีมทันตแพทย์ | `doctors` | ทีมทันตแพทย์ |
| สาขา | `branches` | สาขา |
| บริการ / ขั้นตอน / จุดเด่น | `services`, `service_steps`, `service_perks` | บริการ |
| เบอร์ · LINE · ที่อยู่ · เวลาทำการ | `site_settings` | ตั้งค่าเว็บไซต์ |

`src/content/*.ts` **ยังอยู่ แต่กลายเป็น fallback** — ใช้เมื่อ Supabase ล่มหรือยังไม่ได้ตั้ง env
เว็บจึงยังรันได้บนเครื่องเปล่า ไม่ได้เป็นแหล่งข้อมูลจริงอีกต่อไป

สิ่งเดียวที่ยังต้องแก้ในโค้ด: **ไอคอน SVG** (`src/content/icons.ts`) — หลังบ้านให้เลือกจาก dropdown
ที่ลงทะเบียนไว้ เพราะช่องกรอกที่ต้องพิมพ์ `M19 14c1.49-1.46…` ไม่ใช่ของที่ใครใช้งานได้จริง

### รูปอัปเดตหน้าเว็บทันที

ทุกหน้าเป็น ISR (`revalidate = 3600`) และหลังบ้านจะสั่ง `revalidatePath()` ทุกครั้งที่บันทึก
แก้แล้วเห็นผลทันที ส่วนตัวจับเวลา 1 ชั่วโมงเป็นตาข่ายรองรับกรณีที่ลืมสั่ง

## โครงสร้าง

```
src/
  app/
    (หน้าเว็บ)         # page.tsx = server component ดึงข้อมูล, *View.tsx = client component วาด UI
    admin/             # หลังบ้าน — layout, login, และหนึ่งโฟลเดอร์ต่อหนึ่งชนิดเนื้อหา
  components/          # SiteNav, SiteFooter, Icon, PageStyles
    admin/             # ฟิลด์ที่ใช้ซ้ำ: PairField (TH/EN), MediaField, ColorField, IconField…
  content/             # ค่า fallback + ไอคอน SVG (ไม่ใช่แหล่งข้อมูลจริงแล้ว)
  lib/
    site-content.ts    # อ่านเนื้อหาจาก DB สำหรับหน้าเว็บ (fallback ไป src/content เสมอ)
    site-data.tsx      # context ส่งข้อมูลติดต่อ + สาขา ให้ nav/footer ทุกหน้า
    supabase/          # client ฝั่ง server (session ทีมงาน) และฝั่ง browser (เฉพาะหน้า login)
    admin/             # helper ของหลังบ้าน: crud, form parsing, revalidate
scripts/
  prepare-media.mjs    # บีบอัดรูป + ดึง hero cover ที่ฝัง base64 มาจาก .image-slots.state.json
  upload-media.mjs     # อัปโหลดขึ้น Supabase
  seed-content.mjs     # ย้ายเนื้อหาจาก src/content/*.ts ลง DB (รันครั้งเดียว ข้ามตารางที่มีข้อมูลแล้ว)
supabase/migrations/   # SQL
```

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

`SUPABASE_SERVICE_ROLE_KEY` **ไม่ต้องใส่บน Vercel** — ใช้เฉพาะสคริปต์ที่รันจากเครื่อง dev
หลังบ้านเขียนข้อมูลด้วย session ของคนที่ล็อกอินอยู่ ไม่ใช่ service role ดังนั้นถึงโค้ดฝั่ง server
จะมีบั๊ก ก็ทำได้ไม่เกินสิทธิ์ของคนที่กดปุ่มนั้น

เมื่อรูปอยู่บน Supabase แล้ว `public/media` ไม่ถูกใช้ (และ `.gitignore` ไว้แล้ว)
