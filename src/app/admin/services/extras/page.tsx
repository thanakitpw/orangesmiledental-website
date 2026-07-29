import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { listRows, type AdminRow } from '@/lib/admin/rows';
import { PairField } from '@/components/admin/PairField';
import { ColorField } from '@/components/admin/ColorField';
import { IconField } from '@/components/admin/IconField';
import { InlineRowForm } from './InlineRowForm';
import { savePerk, deletePerk, saveStep, deleteStep } from '../actions';

export const dynamic = 'force-dynamic';

function PerkFields({ row }: { row?: AdminRow }) {
  return (
    <>
      <PairField name="title" label="หัวข้อ" th={row?.title_th} en={row?.title_en} required />
      <PairField name="body" label="คำอธิบาย" th={row?.body_th} en={row?.body_en} textarea rows={2} />
      <div className="a-row">
        <IconField
          name="icon"
          label="ไอคอน"
          defaultValue={row?.icon ?? 'card'}
          accent={row?.accent ?? '#FF7A00'}
        />
        <ColorField name="accent" label="สีไอคอน" defaultValue={row?.accent ?? '#FF7A00'} />
        <ColorField name="tint" label="สีพื้น" defaultValue={row?.tint ?? '#FFF3E8'} />
      </div>
      <label className="a-check">
        <input type="checkbox" name="is_active" defaultChecked={row ? row.is_active : true} />
        <span>แสดงบนหน้าเว็บ</span>
      </label>
    </>
  );
}

function StepFields({ row, scope }: { row?: AdminRow; scope: 'home' | 'services' }) {
  return (
    <>
      <input type="hidden" name="scope" value={row?.scope ?? scope} />
      <div className="a-field" style={{ maxWidth: 120 }}>
        <label>ลำดับที่</label>
        <input name="number" className="a-input" defaultValue={row?.number ?? ''} placeholder="01" />
      </div>
      <PairField name="title" label="หัวข้อ" th={row?.title_th} en={row?.title_en} required />
      <PairField name="body" label="คำอธิบาย" th={row?.body_th} en={row?.body_en} textarea rows={2} />
    </>
  );
}

export default async function ServiceExtrasPage() {
  await requireStaff();

  const [perks, steps] = await Promise.all([
    listRows('service_perks', { order: ['sort_order', 'id'] }),
    listRows('service_steps', { order: ['scope', 'sort_order', 'id'] }),
  ]);

  const homeSteps = steps.filter((s) => s.scope === 'home');
  const serviceSteps = steps.filter((s) => s.scope === 'services');

  return (
    <>
      <div className="a-head">
        <div>
          <h1>ขั้นตอนและจุดเด่น</h1>
          <p>ข้อความประกอบรอบ ๆ รายการบริการ — ข้อความโปรโมชันอยู่ตรงนี้ด้วย แก้ได้ทันทีไม่ต้องรอ deploy</p>
        </div>
        <div className="a-actions">
          <Link className="a-btn" href="/admin/services">
            ← กลับรายการบริการ
          </Link>
        </div>
      </div>

      <div className="a-panel">
        <h2>จุดเด่น 3 ข้อ (หน้าบริการ)</h2>
        <p>การ์ดสามใบใต้ส่วนขั้นตอนการรักษา เช่น “ผ่อน 0% นานสูงสุด 10 เดือน”</p>

        <div className="a-repeat">
          {perks.map((perk, i) => (
            <InlineRowForm
              key={perk.id}
              id={perk.id}
              heading={`จุดเด่นที่ ${i + 1} — ${perk.title_th}`}
              saveAction={savePerk}
              deleteAction={deletePerk}
              deleteLabel={perk.title_th}
            >
              <PerkFields row={perk} />
            </InlineRowForm>
          ))}

          <InlineRowForm id={null} heading="เพิ่มจุดเด่นใหม่" saveAction={savePerk}>
            <PerkFields />
          </InlineRowForm>
        </div>
      </div>

      <div className="a-panel">
        <h2>ขั้นตอนการรักษา — หน้าแรก</h2>
        <p>
          หน้าแรกกับหน้าบริการใช้ข้อความคนละชุด เพราะดีไซน์ต้นฉบับเขียนต่างกันเล็กน้อย
          แก้ชุดหนึ่งจะไม่กระทบอีกชุด
        </p>

        <div className="a-repeat">
          {homeSteps.map((step) => (
            <InlineRowForm
              key={step.id}
              id={step.id}
              heading={`${step.number} — ${step.title_th}`}
              saveAction={saveStep}
              deleteAction={deleteStep}
              deleteLabel={step.title_th}
            >
              <StepFields row={step} scope="home" />
            </InlineRowForm>
          ))}

          <InlineRowForm id={null} heading="เพิ่มขั้นตอน (หน้าแรก)" saveAction={saveStep}>
            <StepFields scope="home" />
          </InlineRowForm>
        </div>
      </div>

      <div className="a-panel">
        <h2>ขั้นตอนการรักษา — หน้าบริการ</h2>

        <div className="a-repeat">
          {serviceSteps.map((step) => (
            <InlineRowForm
              key={step.id}
              id={step.id}
              heading={`${step.number} — ${step.title_th}`}
              saveAction={saveStep}
              deleteAction={deleteStep}
              deleteLabel={step.title_th}
            >
              <StepFields row={step} scope="services" />
            </InlineRowForm>
          ))}

          <InlineRowForm id={null} heading="เพิ่มขั้นตอน (หน้าบริการ)" saveAction={saveStep}>
            <StepFields scope="services" />
          </InlineRowForm>
        </div>
      </div>
    </>
  );
}
