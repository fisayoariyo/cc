'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap, registerCharisGsap } from '@/lib/gsap/register-client';
import { trustMetrics } from '@/components/pages/construction/construction-landing-data';

registerCharisGsap();

function Counter({
  value,
  suffix,
  prefix = '',
}: {
  value: number;
  suffix: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(obj.val)),
    });

    return () => {
      tween.kill();
    };
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function TrustMetrics() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('[data-metric]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative border-y border-[#F0EDE6] bg-[#FFFDF9] py-16 sm:py-20"
      aria-label="Trust metrics"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
        {trustMetrics.map((metric) => (
          <motion.div
            key={metric.label}
            data-metric
            className="text-center"
          >
            <p className="text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
              <Counter value={metric.value} suffix={metric.suffix} prefix={'prefix' in metric ? metric.prefix : ''} />
            </p>
            <p className="mt-3 text-sm font-medium uppercase tracking-wider text-[#3F4A44]">
              {metric.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
