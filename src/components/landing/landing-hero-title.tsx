import { cn } from '@/components/ui/utils';

/** Matches the main home landing hero heading scale + Creato Display. */
export const landingHeroTitleClassName =
  'font-sans text-4xl font-light leading-[1.14] tracking-[-0.02em] md:text-6xl lg:text-7xl';

export function landingHeroTitle(
  tone: 'on-dark' | 'on-light' = 'on-dark',
  className?: string,
) {
  return cn(
    landingHeroTitleClassName,
    tone === 'on-dark' ? 'text-white' : 'text-foreground',
    className,
  );
}

type LandingHeroTitleProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2';
  tone?: 'on-dark' | 'on-light';
  className?: string;
};

export function LandingHeroTitle({
  children,
  as: Tag = 'h1',
  tone = 'on-dark',
  className,
}: LandingHeroTitleProps) {
  return <Tag className={landingHeroTitle(tone, className)}>{children}</Tag>;
}
