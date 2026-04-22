'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { AuthNavInitialState } from '@/components/auth-nav';

function isAppShellRoute(pathname: string): boolean {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/travels/dashboard') ||
    pathname.startsWith('/real-estate/dashboard') ||
    pathname.startsWith('/construction/dashboard') ||
    pathname.startsWith('/agent')
  );
}

export function SiteShellClient({
  children,
  initialAuthState,
}: {
  children: React.ReactNode;
  initialAuthState: AuthNavInitialState;
}) {
  const pathname = usePathname();
  const appShell = isAppShellRoute(pathname);

  if (appShell) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation initialAuthState={initialAuthState} />
      {children}
      <Footer />
    </div>
  );
}

