import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Agent support',
};

const FAQS = [
  {
    question: 'Why am I still under review?',
    answer:
      'Your onboarding stays under review until the admin team confirms your profile and payment status. Updates appear in your dashboard notifications.',
  },
  {
    question: 'When can I start creating listings?',
    answer:
      'Listing controls unlock after verification and onboarding payment are completed. If either step is pending, the dashboard will keep the workspace locked.',
  },
  {
    question: 'What should I do if a listing needs edits?',
    answer:
      'Open the listing, review the admin note, update the details, and save the changes. The status will stay visible in your dashboard.',
  },
] as const;

export default async function AgentHelpPage() {
  const viewer = await getViewerContext();

  if (!viewer) {
    redirect('/login?next=/agent/help');
  }

  if (viewer.role !== 'agent') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
          Help & support
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Find quick answers for verification and listing questions, then contact the team if you still need help.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">
            Frequently asked questions
          </h3>
          <Accordion type="single" collapsible className="mt-4">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`agent-faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">Contact support</h3>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Use the main support form for verification, payment, or listing issues that need a response.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
            >
              Send support message
            </Link>
          </div>

          <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">Best message format</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Include your full name and the page where the issue happened.</p>
              <p>Add the listing title or ID if the issue is tied to a property.</p>
              <p>Keep the message short so the team can route it faster.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
