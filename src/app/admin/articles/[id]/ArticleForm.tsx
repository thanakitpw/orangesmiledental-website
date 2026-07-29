'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { saveArticle, deleteArticle } from '../actions';
import {
  ARTICLE_CATEGORIES,
  ARTICLE_STATUSES,
  STATUS_LABEL,
  type AdminArticle,
} from '@/lib/admin/article-meta';
import { toDateInput, type FormState } from '@/lib/admin/form';
import { MediaField } from '@/components/admin/MediaField';
import { PairField } from '@/components/admin/PairField';
import { JsonListEditor } from '@/components/admin/JsonListEditor';
import { SubmitButton } from '@/components/admin/SubmitButton';

export function ArticleForm({
  article,
  justCreated,
}: {
  article: AdminArticle | null;
  justCreated: boolean;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveArticle, null);
  const [deleteState, deleteAction] = useActionState<FormState, FormData>(deleteArticle, null);

  // Drives whether the reviewer fields are shown as required and whether the
  // licence box is offered at all — a licence belongs to a person, and migration
  // 0004 makes attaching one to the clinic's team impossible at the database level.
  const [reviewerName, setReviewerName] = useState(article?.reviewer_name ?? '');
  const [reviewerType, setReviewerType] = useState(article?.reviewer_type ?? 'person');

  const isNew = !article;

  return (
    <>
      <div className="a-head">
        <div>
          <h1>{isNew ? 'เขียนบทความใหม่' : 'แก้ไขบทความ'}</h1>
          <p>{isNew ? 'กรอกเนื้อหาทั้งไทยและอังกฤษ บทความจะยังไม่ขึ้นเว็บจนกว่าจะตั้งสถานะเป็น “เผยแพร่แล้ว”' : article.slug}</p>
        </div>
        <div className="a-actions">
          <Link className="a-btn" href="/admin/articles">
            ← กลับรายการ
          </Link>
          {article?.status === 'published' && (
            <a className="a-btn" href={`/articles/${article.slug}`} target="_blank" rel="noreferrer">
              ดูหน้าเว็บ ↗
            </a>
          )}
        </div>
      </div>

      {justCreated && <div className="a-note a-note--ok">สร้างบทความเรียบร้อยแล้ว</div>}
      {state?.error && <div className="a-note a-note--err">{state.error}</div>}
      {state?.ok && <div className="a-note a-note--ok">{state.ok}</div>}
      {deleteState?.error && <div className="a-note a-note--err">{deleteState.error}</div>}

      <form action={action}>
        <input type="hidden" name="id" value={article?.id ?? ''} />
        <input type="hidden" name="previous_slug" value={article?.slug ?? ''} />

        {/* ---------------------------------------------------------- settings */}
        <div className="a-panel">
          <h2>การตั้งค่า</h2>
          <p>slug คือที่อยู่ของบทความบนเว็บ เปลี่ยนแล้วลิงก์เดิมจะใช้ไม่ได้ ควรเปลี่ยนเฉพาะตอนที่ยังไม่เผยแพร่</p>

          <div className="a-row">
            <div className="a-field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                className="a-input"
                defaultValue={article?.slug ?? ''}
                placeholder="signs-you-need-braces"
              />
              <small>เว้นว่างไว้ได้ ระบบจะสร้างจากหัวข้อภาษาอังกฤษให้</small>
            </div>

            <div className="a-field">
              <label htmlFor="category">หมวดหมู่</label>
              <select id="category" name="category" className="a-select" defaultValue={article?.category ?? 'general'}>
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="a-field">
              <label htmlFor="status">สถานะ</label>
              <select id="status" name="status" className="a-select" defaultValue={article?.status ?? 'draft'}>
                {ARTICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>

            <div className="a-field">
              <label htmlFor="published_at">วันที่เผยแพร่</label>
              <input
                id="published_at"
                name="published_at"
                type="date"
                className="a-input"
                defaultValue={toDateInput(article?.published_at)}
              />
              <small>เว้นว่างแล้วกดเผยแพร่ = ใช้วันนี้</small>
            </div>

            <div className="a-field">
              <label htmlFor="sort_order">ลำดับ</label>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                className="a-input"
                defaultValue={article?.sort_order ?? 0}
              />
            </div>
          </div>

          <MediaField
            name="cover_key"
            label="รูปหน้าปก"
            category="blog"
            required
            defaultValue={article?.cover_key ?? ''}
            hint="ใช้ทั้งบนการ์ดหน้ารวมบทความ หน้าแรก และเป็นรูปตัวอย่างตอนแชร์ลงโซเชียล"
          />

          <label className="a-check">
            <input type="checkbox" name="featured" defaultChecked={article?.featured ?? false} />
            <span>
              ปักหมุดเป็นบทความเด่น
              <small>บทความที่ปักหมุดจะถูกจัดขึ้นก่อนเสมอ ทั้งหน้ารวมบทความและการ์ด 3 ใบบนหน้าแรก</small>
            </span>
          </label>
        </div>

        {/* ------------------------------------------------------ attribution */}
        <div className="a-panel">
          <h2>ผู้เขียนและผู้ตรวจทาน</h2>
          <p>
            นี่คือส่วนที่บอกว่าใครรับผิดชอบเนื้อหานี้ บทความสุขภาพที่อ้างว่ามีทันตแพทย์ตรวจทานทั้งที่ไม่มีจริง
            เป็นความเสียหายที่แก้ทีหลังไม่ได้ ระบบจึงบังคับว่าต้องมีชื่อและวันที่จริงเท่านั้น
          </p>

          <div className="a-row">
            <div className="a-field">
              <label htmlFor="author_name">ชื่อผู้เขียน</label>
              <input
                id="author_name"
                name="author_name"
                className="a-input"
                defaultValue={article?.author_name ?? ''}
                placeholder="ทีมงาน Orange Smile Dental"
              />
              <small>ต้องมีก่อนจึงจะเผยแพร่ได้</small>
            </div>

            <div className="a-field">
              <label htmlFor="author_credentials">ตำแหน่ง / คุณวุฒิ</label>
              <input
                id="author_credentials"
                name="author_credentials"
                className="a-input"
                defaultValue={article?.author_credentials ?? ''}
                placeholder="ผู้อำนวยการ · จัดฟัน"
              />
            </div>
          </div>

          <div className="a-row">
            <div className="a-field">
              <label htmlFor="reviewer_type">ผู้ตรวจทานเป็น</label>
              <select
                id="reviewer_type"
                name="reviewer_type"
                className="a-select"
                value={reviewerType}
                onChange={(e) => setReviewerType(e.target.value as 'person' | 'organization')}
              >
                <option value="person">ทันตแพทย์ (ระบุชื่อ)</option>
                <option value="organization">ทีมทันตแพทย์ของคลินิก</option>
              </select>
              <small>
                {reviewerType === 'person'
                  ? 'หน้าเว็บจะขึ้นว่า “ตรวจทานทางการแพทย์โดย …” และส่งเป็น Person ให้ Google'
                  : 'หน้าเว็บจะขึ้นว่า “ตรวจทานโดยทีมทันตแพทย์ …” — เป็นคำกล่าวอ้างที่อ่อนกว่าการระบุชื่อหมอ'}
              </small>
            </div>

            <div className="a-field">
              <label htmlFor="reviewer_name">ชื่อผู้ตรวจทาน</label>
              <input
                id="reviewer_name"
                name="reviewer_name"
                className="a-input"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder={reviewerType === 'person' ? 'ทพญ. เอมอร ฤทธี' : 'ทีมทันตแพทย์ Orange Smile Dental'}
              />
              <small>เว้นว่าง = ยังไม่มีใครตรวจทาน</small>
            </div>

            <div className="a-field">
              <label htmlFor="reviewed_at">วันที่ตรวจทาน</label>
              <input
                id="reviewed_at"
                name="reviewed_at"
                type="date"
                className="a-input"
                required={Boolean(reviewerName)}
                defaultValue={toDateInput(article?.reviewed_at)}
              />
            </div>

            {reviewerType === 'person' && (
              <div className="a-field">
                <label htmlFor="reviewer_license">เลขใบอนุญาต (ถ้ามี)</label>
                <input
                  id="reviewer_license"
                  name="reviewer_license"
                  className="a-input"
                  defaultValue={article?.reviewer_license ?? ''}
                  placeholder="ท.12345"
                />
                <small>
                  ไม่บังคับ — แต่ถ้าใส่ ต้องเป็นเลขที่คลินิกให้มาจริงเท่านั้น เพราะตรวจสอบย้อนหลังได้จากทะเบียนทันตแพทยสภา
                </small>
              </div>
            )}
          </div>

          <label className="a-check">
            <input
              type="checkbox"
              name="medically_reviewed"
              defaultChecked={article?.medically_reviewed ?? false}
              disabled={!reviewerName}
            />
            <span>
              ตรวจทานทางการแพทย์แล้ว
              <small>
                {reviewerName
                  ? 'ติ๊กแล้วหน้าบทความจะแสดงว่าผ่านการตรวจทาน — ติ๊กเฉพาะเมื่อมีคนอ่านจริง'
                  : 'ต้องกรอกชื่อผู้ตรวจทานก่อน จึงจะติ๊กช่องนี้ได้'}
              </small>
            </span>
          </label>
        </div>

        {/* ---------------------------------------------------------- content */}
        <div className="a-panel">
          <h2>เนื้อหา</h2>
          <p>
            ไทยและอังกฤษต้องมีครบทั้งคู่ ถ้าขาดภาษาใดภาษาหนึ่ง บทความจะไม่ขึ้นหน้าเว็บเลย
            (ระบบตัดทิ้งเงียบ ๆ ดีกว่าปล่อยหน้าครึ่งใบ)
          </p>

          <PairField name="title" label="หัวข้อ" th={article?.th?.title} en={article?.en?.title} required />
          <PairField
            name="excerpt"
            label="คำโปรย"
            hint="ข้อความสั้นบนการ์ดบทความ 1–2 บรรทัด"
            th={article?.th?.excerpt}
            en={article?.en?.excerpt}
            textarea
            rows={3}
            required
          />
          <PairField
            name="body_md"
            label="เนื้อหา (Markdown)"
            hint="ใส่รูปด้วย ![คำอธิบาย](assets/media/blog/content/ชื่อไฟล์.webp) — ใช้ media key ไม่ต้องใส่ URL เต็ม"
            th={article?.th?.body_md}
            en={article?.en?.body_md}
            textarea
            rows={22}
            required
          />
        </div>

        {/* -------------------------------------------------------------- SEO */}
        <div className="a-panel">
          <h2>SEO และคำถามที่พบบ่อย</h2>
          <p>
            หัวข้อที่ชนะใน Google กับหัวข้อที่อ่านสวยบนการ์ด มักไม่ใช่ประโยคเดียวกัน จึงแยกช่องกันไว้
            — เว้นว่างได้ ระบบจะใช้หัวข้อและคำโปรยแทน
          </p>

          <PairField name="meta_title" label="Meta title" th={article?.th?.meta_title} en={article?.en?.meta_title} />
          <PairField
            name="meta_description"
            label="Meta description"
            th={article?.th?.meta_description}
            en={article?.en?.meta_description}
            textarea
            rows={2}
          />
          <PairField
            name="keywords"
            label="คีย์เวิร์ด"
            hint="คั่นด้วยเครื่องหมายจุลภาค เช่น จัดฟัน, จัดฟันใส, ราคาจัดฟัน"
            th={article?.th?.keywords?.join(', ')}
            en={article?.en?.keywords?.join(', ')}
          />

          <div className="a-pair">
            <div className="a-field">
              <label htmlFor="reading_minutes_th">
                <span className="a-lang">TH</span> เวลาอ่าน (นาที)
              </label>
              <input
                id="reading_minutes_th"
                name="reading_minutes_th"
                type="number"
                min={1}
                className="a-input"
                defaultValue={article?.th?.reading_minutes ?? 3}
              />
            </div>
            <div className="a-field">
              <label htmlFor="reading_minutes_en">
                <span className="a-lang">EN</span> เวลาอ่าน (นาที)
              </label>
              <input
                id="reading_minutes_en"
                name="reading_minutes_en"
                type="number"
                min={1}
                className="a-input"
                defaultValue={article?.en?.reading_minutes ?? 3}
              />
            </div>
          </div>

          <div className="a-pair">
            <JsonListEditor
              name="faq_th"
              label="คำถามที่พบบ่อย (ไทย)"
              hint="แสดงท้ายบทความ และส่งเป็น FAQ ให้ Google ด้วย"
              initial={(article?.th?.faq ?? []) as unknown as Record<string, string>[]}
              fields={[
                { key: 'q', label: 'คำถาม' },
                { key: 'a', label: 'คำตอบ', textarea: true },
              ]}
              addLabel="เพิ่มคำถาม"
            />
            <JsonListEditor
              name="faq_en"
              label="คำถามที่พบบ่อย (อังกฤษ)"
              hint="ควรมีจำนวนข้อเท่ากับภาษาไทย"
              initial={(article?.en?.faq ?? []) as unknown as Record<string, string>[]}
              fields={[
                { key: 'q', label: 'Question' },
                { key: 'a', label: 'Answer', textarea: true },
              ]}
              addLabel="Add question"
            />
          </div>
        </div>

        <div className="a-actions">
          <SubmitButton>{isNew ? 'สร้างบทความ' : 'บันทึกการแก้ไข'}</SubmitButton>
          <Link className="a-btn" href="/admin/articles">
            ยกเลิก
          </Link>
        </div>
      </form>

      {/* Outside the form above — HTML forbids nesting one form inside another,
          and a delete button that silently submitted the save form would be worse
          than no delete button at all. */}
      {article && (
        <form action={deleteAction} className="a-panel" style={{ marginTop: 24 }}>
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="slug" value={article.slug} />
          <h2>ลบบทความนี้</h2>
          <p>ลบแล้วกู้คืนไม่ได้ ถ้าแค่ต้องการเอาลงจากหน้าเว็บชั่วคราว ให้เปลี่ยนสถานะเป็นฉบับร่างแทน</p>
          <SubmitButton
            className="a-btn a-btn--danger"
            pendingLabel="กำลังลบ…"
            confirm={`ลบบทความ "${article.th?.title ?? article.slug}" อย่างถาวร?`}
          >
            ลบถาวร
          </SubmitButton>
        </form>
      )}
    </>
  );
}
