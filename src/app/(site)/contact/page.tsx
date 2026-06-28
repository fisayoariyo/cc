import { createMarketingPageLoader } from '@/components/landing/lazy-marketing-page';

const ContactPage = createMarketingPageLoader(() => import('@/components/pages/ContactPage'));

export default function Page() {
  return <ContactPage />;
}
