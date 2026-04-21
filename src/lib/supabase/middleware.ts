import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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
  const isApiRoute = path.startsWith('/api');
  const isProtectedRoute =
    isAdminRoute ||
    isDashboardRoute ||
    isTravelClientRoute ||
    isRealEstateClientRoute ||
    isConstructionClientRoute ||
    isAgentRoute ||
    isApiRoute;

  if (!isProtectedRoute) {
    return NextResponse.next({ request });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
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

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      url.searchParams.set('error', 'Please sign in as an admin account.');
      return NextResponse.redirect(url);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      url.searchParams.set('error', 'Could not read your profile role. Please sign in again.');
      return NextResponse.redirect(url);
    }

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.set('error', 'Admin access required.');
      return NextResponse.redirect(url);
    }
  }

  if (
    isDashboardRoute ||
    isTravelClientRoute ||
    isRealEstateClientRoute ||
    isConstructionClientRoute ||
    isAgentRoute
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      url.searchParams.set('error', 'Please sign in to continue.');
      return NextResponse.redirect(url);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname);
      url.searchParams.set('error', 'Could not read your profile role. Please sign in again.');
      return NextResponse.redirect(url);
    }

    if (isAgentRoute && profile?.role !== 'agent') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if ((isTravelClientRoute || isRealEstateClientRoute || isConstructionClientRoute) && profile?.role !== 'client') {
      if (profile?.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
      if (profile?.role === 'agent') return NextResponse.redirect(new URL('/agent', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return supabaseResponse;
}
