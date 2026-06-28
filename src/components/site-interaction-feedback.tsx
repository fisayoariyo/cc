import { RouteTransitionFeedback } from '@/components/route-transition-feedback';

export function SiteInteractionFeedback({ children }: { children: React.ReactNode }) {
  return <RouteTransitionFeedback themeScope="web">{children}</RouteTransitionFeedback>;
}
