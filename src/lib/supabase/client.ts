import { createBrowserClient } from '@supabase/ssr';

/**
 * Client Components — browser-only session (e.g. Navigation auth state, forms).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
