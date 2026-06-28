import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { SuccessStoryForm } from '../story-form';

export default function NewSuccessStoryPage() {
  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <DashboardPageTitle as="h2">Create success story</DashboardPageTitle>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Add a polished proof point for the public site with a cover image, optional video, and media gallery links.
        </p>
      </section>

      <SuccessStoryForm />
    </div>
  );
}
