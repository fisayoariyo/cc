import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  VIEWER_HEADER_NAMES,
  encodeViewerHeaderValue,
} from '@/lib/supabase/viewer-headers';
import {
  LAST_CLIENT_SERVICE_COOKIE,
  LAST_CLIENT_SERVICE_MAX_AGE,
} from '@/lib/last-client-service';
import { applyLoginContextParams } from '@/lib/auth/login-redirect';

/**
 * Refreshes the Supabase session on each matched request and returns the response
 * with updated Set-Cookie headers. Use only from root `middleware.ts`.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminLoginRoute = path === '/admin/login';
  const isAdminRoute = path.startsWith('/admin') && !isAdminLoginRoute;
  const isDashboardRoute = path.startsWith('/dashboard');
  const isTravelClientRoute = path.startsWith('/travel/dashboard');
  const isRealEstateClientRoute = path.startsWith('/real-estate/dashboard');
  const isConstructionClientRoute = path.startsWith('/real-estate/construction/dashboard');
  const isAgentRoute = path.startsWith('/agent');
  const isAgentOnboardingRoute = path.startsWith('/agent/onboarding');
  const isAgentUnderReviewRoute = path === '/agent/under-review';
  const isProtectedRoute =
    isAdminRoute ||
    isDashboardRoute ||
    isTravelClientRoute ||
    isRealEstateClientRoute ||
    isConstructionClientRoute ||
    isAgentRoute;

  if (!isProtectedRoute) {
    return NextResponse.next({ request });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminRoute ? '/admin/login' : '/login';
    const nextPath = request.nextUrl.pathname;
    if (!isAdminRoute) {
      url.searchParams.set('next', nextPath);
      applyLoginContextParams(url, nextPath);
    } else if (nextPath !== '/admin') {
      url.searchParams.set('next', nextPath);
    }
    url.searchParams.set('error', 'Authentication is not configured. Contact support.');
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  const createResponse = () =>
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  let supabaseResponse = createResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = createResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminRoute ? '/admin/login' : '/login';
    const nextPath = request.nextUrl.pathname;
    if (!isAdminRoute) {
      url.searchParams.set('next', nextPath);
      applyLoginContextParams(url, nextPath);
    } else if (nextPath !== '/admin') {
      url.searchParams.set('next', nextPath);
    }
    url.searchParams.set(
      'error',
      isAdminRoute ? 'Please sign in with an admin account.' : 'Please sign in to continue.',
    );
    return NextResponse.redirect(url);
  }

  type ProfileRow = {
    full_name?: string | null;
    role?: string | null;
    status?: string | null;
    onboarding_paid?: boolean | null;
    onboarding_step?: string | null;
    photo_url?: string | null;
    phone_number?: string | null;
    agent_state?: string | null;
    agent_lga?: string | null;
  };

  let profile: ProfileRow | null = null;
  let profileError: { message: string } | null = null;

  const fullProfile = await supabase
    .from('profiles')
    .select(
      'full_name, role, status, onboarding_paid, onboarding_step, photo_url, phone_number, agent_state, agent_lga',
    )
    .eq('id', user.id)
    .maybeSingle();

  if (fullProfile.error) {
    // Safety net: if the production DB hasn't run the latest profile migrations
    // (e.g. the onboarding columns from 015+), fall back to the core columns so
    // auth still works and role checks are still enforced instead of locking the
    // user out. Apply the pending migrations to restore full behavior.
    const coreProfile = await supabase
      .from('profiles')
      .select('full_name, role, status')
      .eq('id', user.id)
      .maybeSingle();
    profile = coreProfile.data;
    profileError = coreProfile.error;
  } else {
    profile = fullProfile.data;
  }

  if (profileError || !profile?.role) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminRoute ? '/admin/login' : '/login';
    const nextPath = request.nextUrl.pathname;
    url.searchParams.set('next', nextPath);
    if (!isAdminRoute) {
      applyLoginContextParams(url, nextPath);
    }
    url.searchParams.set(
      'error',
      profileError
        ? 'Could not read your profile role. Please sign in again.'
        : 'Your account profile is incomplete. Contact support.',
    );
    return NextResponse.redirect(url);
  }

  requestHeaders.set(VIEWER_HEADER_NAMES.userId, user.id);
  requestHeaders.set(VIEWER_HEADER_NAMES.email, encodeViewerHeaderValue(user.email ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.fullName, encodeViewerHeaderValue(profile?.full_name ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.role, encodeViewerHeaderValue(profile?.role ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.status, encodeViewerHeaderValue(profile?.status ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.onboardingPaid, profile?.onboarding_paid ? '1' : '0');
  requestHeaders.set(
    VIEWER_HEADER_NAMES.photoUrl,
    encodeViewerHeaderValue(profile?.status === 'verified' ? profile?.photo_url ?? null : null),
  );
  requestHeaders.set(VIEWER_HEADER_NAMES.phone, encodeViewerHeaderValue(profile?.phone_number ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.agentState, encodeViewerHeaderValue(profile?.agent_state ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.agentLga, encodeViewerHeaderValue(profile?.agent_lga ?? null));
  supabaseResponse = createResponse();

  if (isAdminRoute && profile?.role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.searchParams.set('error', 'Admin access required.');
    return NextResponse.redirect(url);
  }

  if (isAgentRoute && profile?.role !== 'agent') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isAgentRoute && profile?.role === 'agent') {
    const isVerifiedAgent = profile.status === 'verified';
    const onboardingStep = profile.onboarding_step ?? 'location';
    const onboardingSubmitted = onboardingStep === 'submitted';

    if (!onboardingSubmitted && !isAgentOnboardingRoute) {
      return NextResponse.redirect(new URL('/agent/onboarding', request.url));
    }

    if (onboardingSubmitted && isAgentOnboardingRoute) {
      return NextResponse.redirect(new URL('/agent/under-review', request.url));
    }

    if (!isVerifiedAgent) {
      const allowedPendingRoutes = isAgentUnderReviewRoute || isAgentOnboardingRoute;
      if (!allowedPendingRoutes) {
        return NextResponse.redirect(new URL('/agent/under-review', request.url));
      }
    }

    if (isVerifiedAgent && isAgentOnboardingRoute) {
      return NextResponse.redirect(new URL('/agent', request.url));
    }
  }

  if ((isTravelClientRoute || isRealEstateClientRoute || isConstructionClientRoute) && profile?.role !== 'client') {
    if (profile?.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (profile?.role === 'agent') return NextResponse.redirect(new URL('/agent', request.url));
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (profile?.role === 'client') {
    if (isTravelClientRoute) {
      supabaseResponse.cookies.set(LAST_CLIENT_SERVICE_COOKIE, 'travel', {
        path: '/',
        maxAge: LAST_CLIENT_SERVICE_MAX_AGE,
        sameSite: 'lax',
      });
    }

    if (isRealEstateClientRoute) {
      supabaseResponse.cookies.set(LAST_CLIENT_SERVICE_COOKIE, 'real_estate', {
        path: '/',
        maxAge: LAST_CLIENT_SERVICE_MAX_AGE,
        sameSite: 'lax',
      });
    }

    if (isConstructionClientRoute) {
      supabaseResponse.cookies.set(LAST_CLIENT_SERVICE_COOKIE, 'construction', {
        path: '/',
        maxAge: LAST_CLIENT_SERVICE_MAX_AGE,
        sameSite: 'lax',
      });
    }
  }

  return supabaseResponse;
}
