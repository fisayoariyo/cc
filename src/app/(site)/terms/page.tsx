import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Terms</p>
          <h1 className="text-4xl font-light text-foreground sm:text-5xl">Terms of Service</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            By using Charis Consult, you agree to provide accurate information, use the platform lawfully,
            and respect the service-specific workflows for real estate, travel, and agent onboarding.
          </p>
        </div>

        <div className="mt-12 space-y-10 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Accounts and access</h2>
            <p>
              Dashboard access is tied to your registered role and service path. Agent access may remain
              under review until verification and onboarding requirements are complete.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Use of services</h2>
            <p>
              Property information, travel guidance, and consultations are provided to help you make informed
              decisions, but final eligibility, approvals, and transactions can still depend on third parties
              and formal agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-foreground">Need clarification?</h2>
            <p>
              For a full legal version or clarification about any term, reach out through the contact page.
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
