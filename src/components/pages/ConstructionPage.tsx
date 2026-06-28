'use client';

import dynamic from 'next/dynamic';
import { ConstructionHero } from '@/components/pages/construction/ConstructionHero';
import { ServicesGrid } from '@/components/pages/construction/ServicesGrid';
import { FeaturedProjects } from '@/components/pages/construction/FeaturedProjects';
import { BeforeAfterSlider } from '@/components/pages/construction/BeforeAfterSlider';
import { TestimonialsCarousel } from '@/components/pages/construction/TestimonialsCarousel';
import { WhyChooseUs } from '@/components/pages/construction/WhyChooseUs';
import { ConstructionCtaBanner } from '@/components/pages/construction/ConstructionCtaBanner';

const TrustMetrics = dynamic(
  () => import('@/components/pages/construction/TrustMetrics').then((m) => m.TrustMetrics),
  { ssr: false, loading: () => <div className="h-48 animate-pulse bg-black/5" /> },
);

const ProcessTimeline = dynamic(
  () => import('@/components/pages/construction/ProcessTimeline').then((m) => m.ProcessTimeline),
  { ssr: false, loading: () => <div className="h-96 animate-pulse bg-black/5" /> },
);

export default function ConstructionPage() {
  return (
    <div className="scroll-smooth bg-[#FEFAF4] text-[#1F2A24] antialiased">
      <main>
        <ConstructionHero />
        <TrustMetrics />
        <ServicesGrid />
        <FeaturedProjects />
        <ProcessTimeline />
        <BeforeAfterSlider />
        <TestimonialsCarousel />
        <WhyChooseUs />
        <ConstructionCtaBanner />
      </main>
    </div>
  );
}
