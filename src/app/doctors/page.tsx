import { getDoctors } from '@/lib/site-content';
import { DoctorsView } from './DoctorsView';

/**
 * The roster used to be a literal in `src/content/doctors.ts`, which meant hiring
 * a dentist was a code change. It comes from the database now, so this had to
 * become a server component: the names must be in the HTML Google receives, not
 * fetched in afterwards by the browser.
 */
export const revalidate = 3600;

export default async function DoctorsPage() {
  const { doctors } = await getDoctors();
  return <DoctorsView doctors={doctors} />;
}
