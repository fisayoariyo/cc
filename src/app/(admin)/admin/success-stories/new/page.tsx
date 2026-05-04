import { SuccessStoryForm } from '../story-form';

export default function NewSuccessStoryPage() {
  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.7rem]">
          Create success story
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Add a polished proof point for the public site with a cover image, optional video, and media gallery links.
        </p>
      </section>

      <SuccessStoryForm />
    </div>
  );
}
