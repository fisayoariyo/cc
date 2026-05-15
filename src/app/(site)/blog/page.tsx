import Link from 'next/link';

const BLOG_POSTS = [
  {
    title: 'How To Choose The Right Property Investment In Nigeria',
    excerpt:
      'A practical checklist for evaluating location, legal documentation, developer credibility, and projected returns before you buy.',
    href: '/contact',
  },
  {
    title: 'Travel Documentation Essentials For First-Time Applicants',
    excerpt:
      'Understand timelines, common rejection reasons, and how to prepare a complete file for smoother travel processing.',
    href: '/travel',
  },
  {
    title: 'Construction Planning: What To Finalize Before Groundbreaking',
    excerpt:
      'From budget buffers to consultant coordination, this guide covers key decisions that prevent costly delays.',
    href: '/contact',
  },
];

export default function BlogPage() {
  return (
    <main className="bg-background pt-28 pb-16">
      <section className="mx-auto max-w-5xl px-6 lg:px-8">
        <p className="text-sm font-medium text-primary">Charis Blog</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">Insights for property and travel</h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground">
          Practical updates, guides, and explainers from our consultants. New long-form articles will be published here.
        </p>

        <div className="mt-10 grid gap-5">
          {BLOG_POSTS.map((post) => (
            <article key={post.title} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-xl font-medium text-foreground">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
              <Link
                href={post.href}
                className="mt-5 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
