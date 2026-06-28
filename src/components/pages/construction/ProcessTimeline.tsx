'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, registerCharisGsap } from '@/lib/gsap/register-client';
import { processSteps } from '@/components/pages/construction/construction-landing-data';

registerCharisGsap();

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current || !trackRef.current) return;

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 1,
          },
        },
      );

      gsap.from('[data-step]', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#FEFAF4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]">Process</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
            How we build
          </h2>
          <p className="mt-4 text-lg text-[#3F4A44]">
            A proven six-stage workflow from first consultation to keys in hand.
          </p>
        </motion.div>

        <div ref={trackRef} className="relative mt-16">
          <div className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-[#F0EDE6] lg:block">
            <div
              ref={lineRef}
              className="h-full w-full origin-left bg-gradient-to-r from-[#E88A5F] to-[#E88A5F]/40"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {processSteps.map((step) => (
              <article key={step.step} data-step className="relative">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#E88A5F]/40 bg-[#FFFDF9] text-lg font-semibold text-[#E88A5F] shadow-sm">
                  {String(step.step).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold text-[#1F2A24]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3F4A44]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
