import { createClient } from '@/lib/supabase/server';
import type { AuthNavInitialState } from '@/components/auth-nav';
import { SiteShellClient } from '@/components/site-shell-client';

export async function SiteShell({ children }: { children: React.ReactNode }) {
  let initialAuthState: AuthNavInitialState = { userId: null, role: null, resolved: true };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      initialAuthState = {
        userId: user.id,
        role: (profile?.role as AuthNavInitialState['role']) ?? 'client',
        resolved: true,
      };
    }
  } catch {
    initialAuthState = { userId: null, role: null, resolved: true };
  }

  return (
    <SiteShellClient initialAuthState={initialAuthState}>{children}</SiteShellClient>
  );
}