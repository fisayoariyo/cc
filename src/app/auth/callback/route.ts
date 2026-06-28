import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAgentPostAuthPath } from '@/lib/agent-onboarding';

/**
 * Supabase email confirmation / OAuth redirects here with ?code=… (PKCE).
 * Add this URL to Supabase → Authentication → URL Configuration → Redirect URLs:
 *   http://localhost:3000/auth/callback
 *   https://your-domain.com/auth/callback
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get('code');
  const nextRaw = url.searchParams.get('next') ?? '/dashboard';
  const next = nextRaw.startsWith('/') && !nextRaw.startsWith('//') ? nextRaw : '/dashboard';

  const err =
    url.searchParams.get('error_description') ?? url.searchParams.get('error');
  if (err) {
    const login = new URL('/login', origin);
    login.searchParams.set('error', err);
    return NextResponse.redirect(login);
  }

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      const login = new URL('/login', origin);
      login.searchParams.set('error', 'Authentication is not configured.');
      return NextResponse.redirect(login);
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status, onboarding_step')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', origin));
        }

        if (profile?.role === 'agent') {
          return NextResponse.redirect(
            new URL(
              getAgentPostAuthPath(profile ?? { status: 'pending', onboarding_step: 'location' }),
              origin,
            ),
          );
        }
      }

      return NextResponse.redirect(new URL(next, origin));
    }
    const login = new URL('/login', origin);
    login.searchParams.set('error', error.message);
    return NextResponse.redirect(login);
  }

  const login = new URL('/login', origin);
  login.searchParams.set('error', 'Missing confirmation code. Try signing in with your email and password.');
  return NextResponse.redirect(login);
}
