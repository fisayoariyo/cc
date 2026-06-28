import { SiteInteractionFeedback } from '@/components/site-interaction-feedback';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteInteractionFeedback>
      <div className="min-h-screen bg-white font-sans">{children}</div>
    </SiteInteractionFeedback>
  );
}
