import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Privacy</p>
          <h1 className="text-4xl font-light text-foreground sm:text-5xl">Privacy Policy</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            We collect only the information needed to deliver real estate, travel, and consultation
            services, respond to inquiries, and support authenticated dashboards.
          </p>
        </div>

        <div className="mt-12 space-y-10 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">What we collect</h2>
            <p>
              This can include contact details, account information, inquiry submissions, and service
              workflow data such as saved properties, travel applications, or onboarding records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">How we use it</h2>
            <p>
              We use your information to operate the platform, respond to support requests, process
              applications, and improve service delivery. We do not needlessly request information that
              is unrelated to your selected service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Need a formal copy?</h2>
            <p>
              If you need the latest signed legal version or want to ask a privacy question, contact the
              Charis Consult team directly.
            </p>
            <Link href="/contact" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">
              Contact us
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
