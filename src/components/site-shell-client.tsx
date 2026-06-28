'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import type { AuthNavInitialState } from '@/components/auth-nav';
import { SiteInteractionFeedback } from '@/components/site-interaction-feedback';

function isAppShellRoute(pathname: string): boolean {
  return (
    pathname === '/dashboard' ||
    pathname.startsWith('/travel/dashboard') ||
    pathname.startsWith('/real-estate/dashboard') ||
    pathname.startsWith('/real-estate/construction/dashboard') ||
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
    return <div className="min-h-screen font-sans">{children}</div>;
  }

  return (
    <SiteInteractionFeedback>
      <div className="min-h-screen bg-background font-sans">
        <Navigation initialAuthState={initialAuthState} />
        {children}
        <Footer />
      </div>
    </SiteInteractionFeedback>
  );
}
