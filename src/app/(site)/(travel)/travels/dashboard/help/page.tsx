import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Travel help',
  description: 'Help, FAQs, and support guidance for Charis Consult travel clients.',
};

const FAQS = [
  {
    question: 'What should I do after starting an application?',
    answer:
      'Upload the first set of documents for that application. Once our team reviews them, your dashboard will tick the reviewed step and show the next stage.',
  },
  {
    question: 'Can I upload all my documents at once?',
    answer:
      'Yes. You can upload documents early and the team will use what is needed at each stage. This helps avoid delays later in the process.',
  },
  {
    question: 'Why is my document not approved yet?',
    answer:
      'Documents stay under review until a team member checks them. If something needs to be replaced, the application card and updates page will show the note.',
  },
  {
    question: 'What if my upload keeps failing?',
    answer:
      'Keep each file under 1MB. If the issue continues, message support with your application destination, document type, and a short note about what happened.',
  },
  {
    question: 'How do I start another travel type later?',
    answer:
      'Go back to the travel dashboard and use the main starter prompt there. Each travel type should be created as a separate application.',
  },
] as const;

export default function TravelHelpPage() {
  return (
    <div className="space-y-8">
      <Link
        href="/travel/dashboard/profile"
        className="inline-flex items-center gap-1.5 text-sm text-foreground/90 hover:text-foreground sm:hidden"
      >
        <ArrowLeft size={16} />
        Go back
      </Link>

      <section className="max-w-3xl space-y-2">
        <h1 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">Help & support</h1>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Find quick answers, upload guidance, and the best way to contact support when you need help.
        </p>
      </section>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold text-foreground">Frequently asked questions</h2>
          <p className="mt-1 text-[15px] text-muted-foreground">
            These cover the common dashboard, document, and stage update questions.
          </p>
          <Accordion type="single" collapsible className="mt-4">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-semibold text-foreground">Contact support</h2>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Use this for timing questions, clarification on updates, or any case issue that needs a human response.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex rounded-full bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
            >
              Send support message
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-semibold text-foreground">Upload issue instructions</h2>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <p>Before contacting support, confirm that:</p>
              <ul className="space-y-1">
                <li>Your file is 1MB or smaller.</li>
                <li>The document type name is clear.</li>
                <li>You are uploading into the correct application card.</li>
              </ul>
              <p>
                If it still fails, send one short message with your application destination, document type, and what
                happened on screen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
