import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/agent/:path*',
    '/travel/dashboard',
    '/travel/dashboard/:path*',
    '/travels/dashboard',
    '/travels/dashboard/:path*',
    '/real-estate/dashboard/:path*',
    '/real-estate/construction/dashboard/:path*',
  ],
};
