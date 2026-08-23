import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type AdminAccess = {
  state: 'authorized';
  userId: string;
  email: string;
  profileId: string;
  profileName: string;
  role: 'admin';
};

export type AdminAccessResult =
  | AdminAccess
  | { state: 'unauthenticated' }
  | { state: 'forbidden' };

export async function getAdminAccess(): Promise<AdminAccessResult> {
  const sessionClient = await createClient();
  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return { state: 'unauthenticated' };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, full_name, email')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    return { state: 'forbidden' };
  }

  const { data: role } = await adminClient
    .from('admin_roles')
    .select('role')
    .eq('profile_id', profile.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!role) {
    return { state: 'forbidden' };
  }

  return {
    state: 'authorized',
    userId: user.id,
    email: user.email || profile.email,
    profileId: profile.id,
    profileName: profile.full_name,
    role: 'admin',
  };
}
