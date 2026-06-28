import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

export function LandingPageSkeleton({ className = 'min-h-screen animate-pulse bg-[#FEFAF4]' }: { className?: string }) {
  return <div className={className} />;
}

export function createMarketingPageLoader<P extends object = Record<string, never>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  className?: string,
) {
  return dynamic<P>(importFn, {
    loading: () => <LandingPageSkeleton className={className} />,
  });
}
