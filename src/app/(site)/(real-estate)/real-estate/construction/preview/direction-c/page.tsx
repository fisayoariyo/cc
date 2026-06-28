import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ConstructionDirectionCPage = dynamic(
  () => import('@/components/pages/ConstructionDirectionCPage'),
  { loading: () => <div className="min-h-screen animate-pulse bg-[#0a0a0a]" /> },
);

export const metadata: Metadata = {
  title: 'Construction landing preview C',
};

export default function ConstructionDirectionCPreviewPage() {
  return <ConstructionDirectionCPage />;
}
