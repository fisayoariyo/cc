import type { AuthNavInitialState } from '@/components/auth-nav';
import { SiteShellClient } from '@/components/site-shell-client';

/**
 * Public pages must NOT block on a server-side Supabase auth round-trip.
 * Calling `getViewerContext()` here used `headers()` (forcing every public
 * route into per-request dynamic rendering) plus a live `auth.getUser()` hop
 * on every load. The nav's client `AuthNav` resolves auth on its own when
 * `resolved` is false, so we hand it an unresolved state and let public pages
 * stay static/cacheable.
 */
const initialAuthState: AuthNavInitialState = {
  userId: null,
  role: null,
  resolved: false,
};

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <SiteShellClient initialAuthState={initialAuthState}>{children}</SiteShellClient>;
}
