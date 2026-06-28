import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client for trusted server-only flows (e.g. public contact form
 * submissions) that must bypass RLS. NEVER import this in Client Components and
 * never expose the service-role key to the browser.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY (or the project URL) is not set.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    return null;
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
