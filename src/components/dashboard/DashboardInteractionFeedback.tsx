import { RouteTransitionFeedback } from '@/components/route-transition-feedback';

export function DashboardInteractionFeedback({ children }: { children: React.ReactNode }) {
  return <RouteTransitionFeedback themeScope="app">{children}</RouteTransitionFeedback>;
}
