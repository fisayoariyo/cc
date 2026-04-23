import type { AuthNavInitialState } from '@/components/auth-nav';
import { SiteShellClient } from '@/components/site-shell-client';

const UNRESOLVED_AUTH_STATE: AuthNavInitialState = {
  userId: null,
  role: null,
  resolved: false,
};

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SiteShellClient initialAuthState={UNRESOLVED_AUTH_STATE}>{children}</SiteShellClient>
  );
}
