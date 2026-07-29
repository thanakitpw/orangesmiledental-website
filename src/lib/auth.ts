import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export interface Staff {
  id: string;
  email: string;
  fullName: string | null;
}

/**
 * The signed-in staff member, or null.
 *
 * Two conditions, not one: a valid auth session AND a row in `profiles`. An
 * invited user whose address was never put on `staff_allowlist` gets a session
 * but no profile, and lands here as null — which is the whole point of the
 * allowlist. `getUser()` rather than `getSession()`, because only the former
 * revalidates the JWT with Supabase instead of trusting the cookie.
 */
export async function getStaff(): Promise<Staff | null> {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('id', user.id)
    .maybeSingle();

  if (!data) return null;
  return { id: data.id, email: data.email, fullName: data.full_name };
}

/** Same, but sends anyone who is not staff to the login screen. */
export async function requireStaff(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect('/admin/login');
  return staff;
}
