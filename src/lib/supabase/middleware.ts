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

/**
 * Refreshes the Supabase session on each matched request and returns the response
 * with updated Set-Cookie headers. Use only from root `middleware.ts`.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isDashboardRoute = path.startsWith('/dashboard');
  const isTravelClientRoute = path.startsWith('/travels/dashboard');
  const isRealEstateClientRoute = path.startsWith('/real-estate/dashboard');
  const isConstructionClientRoute = path.startsWith('/construction/dashboard');
  const isAgentRoute = path.startsWith('/agent');
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
    return NextResponse.next({ request });
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
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    url.searchParams.set(
      'error',
      isAdminRoute ? 'Please sign in as an admin account.' : 'Please sign in to continue.',
    );
    return NextResponse.redirect(url);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, role, status, onboarding_paid')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    url.searchParams.set('error', 'Could not read your profile role. Please sign in again.');
    return NextResponse.redirect(url);
  }

  requestHeaders.set(VIEWER_HEADER_NAMES.userId, user.id);
  requestHeaders.set(VIEWER_HEADER_NAMES.email, encodeViewerHeaderValue(user.email ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.fullName, encodeViewerHeaderValue(profile?.full_name ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.role, encodeViewerHeaderValue(profile?.role ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.status, encodeViewerHeaderValue(profile?.status ?? null));
  requestHeaders.set(VIEWER_HEADER_NAMES.onboardingPaid, profile?.onboarding_paid ? '1' : '0');
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

    if (!isVerifiedAgent && !isAgentUnderReviewRoute) {
      return NextResponse.redirect(new URL('/agent/under-review', request.url));
    }

    if (isVerifiedAgent && isAgentUnderReviewRoute) {
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
  }

  return supabaseResponse;
}
