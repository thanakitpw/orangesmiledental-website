/**
 * One idea, both languages, side by side.
 *
 * Every string on this site is authored as a TH/EN pair, and the failure mode is
 * never a missing field — it is a filled-in Thai box next to an empty English one
 * that nobody notices until an English visitor hits the page. Putting them in the
 * same row makes that gap impossible to miss while typing.
 *
 * Emits `${name}_th` and `${name}_en`, matching the column pairs in the schema.
 */
export function PairField({
  name,
  label,
  th = '',
  en = '',
  hint,
  textarea,
  rows = 3,
  required,
  placeholderTh,
  placeholderEn,
}: {
  name: string;
  label: string;
  th?: string | null;
  en?: string | null;
  hint?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  placeholderTh?: string;
  placeholderEn?: string;
}) {
  const field = (locale: 'th' | 'en', value: string, placeholder?: string) => {
    const id = `${name}_${locale}`;
    const shared = {
      id,
      name: id,
      defaultValue: value,
      required,
      placeholder,
      'aria-label': `${label} (${locale === 'th' ? 'ไทย' : 'อังกฤษ'})`,
    };

    return (
      <div key={locale}>
        <label htmlFor={id} style={{ display: 'block', marginBottom: 4 }}>
          <span className="a-lang">{locale === 'th' ? 'TH' : 'EN'}</span>
        </label>
        {textarea ? (
          <textarea className="a-textarea" rows={rows} {...shared} />
        ) : (
          <input className="a-input" type="text" {...shared} />
        )}
      </div>
    );
  };

  return (
    <div className="a-field">
      <span className="a-legend">
        {label}
        {required && <span style={{ color: '#c02626' }}> *</span>}
      </span>
      {hint && <small>{hint}</small>}
      <div className="a-pair">
        {field('th', th ?? '', placeholderTh)}
        {field('en', en ?? '', placeholderEn)}
      </div>
    </div>
  );
}
