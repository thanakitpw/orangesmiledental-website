import { requireStaff } from '@/lib/auth';
import { listRows } from '@/lib/admin/rows';
import { GalleryAdder } from './GalleryAdder';
import { GalleryItem } from './GalleryItem';
import { CategoryForm } from './CategoryForm';

export const dynamic = 'force-dynamic';

export default async function GalleryAdminPage() {
  await requireStaff();

  const [categories, items] = await Promise.all([
    listRows('gallery_categories', { order: ['sort_order', 'key'] }),
    listRows('gallery_items', { order: ['sort_order', 'id'] }),
  ]);

  const byCategory = categories.map((cat) => ({
    cat,
    items: items.filter((i) => i.cat === cat.key),
  }));

  // A category that was deleted from `gallery_categories` cannot leave items
  // behind — the foreign key sees to that — so anything unmatched here means a
  // key was renamed out from under its rows. Worth showing rather than hiding.
  const orphans = items.filter((i) => !categories.some((c) => c.key === i.cat));

  return (
    <>
      <div className="a-head">
        <div>
          <h1>แกลเลอรีผลงาน</h1>
          <p>
            รูปผลงานบนหน้า /reviews แยกตามประเภทการรักษา ปุ่มกรองบนหน้าเว็บจะแสดงเฉพาะประเภทที่มีรูปอยู่จริง
            ประเภทที่ไม่มีรูปจะไม่ขึ้นให้ผู้ใช้กดแล้วเจอหน้าว่าง
          </p>
        </div>
      </div>

      <GalleryAdder categories={categories.map((c) => ({ key: c.key, label_th: c.label_th }))} />

      {byCategory.map(({ cat, items: catItems }) => (
        <div className="a-panel" key={cat.key}>
          <h2>
            {cat.label_th}{' '}
            <span className="a-badge">{catItems.length} รูป</span>
          </h2>
          <p>{cat.label_en}</p>

          {catItems.length === 0 ? (
            <p className="a-empty">ยังไม่มีรูปในประเภทนี้</p>
          ) : (
            <div className="a-mediagrid">
              {catItems.map((item, i) => (
                <GalleryItem
                  key={item.id}
                  id={item.id}
                  img={item.img}
                  cat={item.cat}
                  isActive={item.is_active}
                  first={i === 0}
                  last={i === catItems.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {orphans.length > 0 && (
        <div className="a-panel">
          <h2>รูปที่ไม่มีประเภท</h2>
          <p>รูปเหล่านี้อ้างถึงรหัสประเภทที่ไม่มีอยู่แล้ว จะไม่แสดงบนหน้าเว็บ</p>
          <div className="a-mediagrid">
            {orphans.map((item, i) => (
              <GalleryItem
                key={item.id}
                id={item.id}
                img={item.img}
                cat={item.cat}
                isActive={item.is_active}
                first={i === 0}
                last={i === orphans.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      <div className="a-panel">
        <h2>ประเภทการรักษา</h2>
        <p>ชื่อที่ตั้งไว้ตรงนี้คือข้อความบนปุ่มกรองในหน้ารีวิว</p>

        <div className="a-repeat">
          {categories.map((cat) => (
            <CategoryForm
              key={cat.key}
              category={{
                key: cat.key,
                label_th: cat.label_th,
                label_en: cat.label_en,
                sort_order: cat.sort_order,
              }}
              count={items.filter((i) => i.cat === cat.key).length}
            />
          ))}
          <CategoryForm />
        </div>
      </div>
    </>
  );
}
