import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured, SUPABASE_ENV_HINT } from '@/lib/supabase/env';

/**
 * Client Components — browser-only session (e.g. Navigation auth state, forms).
 */
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(SUPABASE_ENV_HINT);
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
