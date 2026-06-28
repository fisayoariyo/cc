'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { whyChooseUsImage, whyChooseUsPoints } from '@/components/pages/construction/construction-landing-data';

export function WhyChooseUs() {
  return (
    <section id="about" className="bg-[#FFFDF9] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] overflow-hidden rounded-2xl"
        >
          <Image
            src={whyChooseUsImage}
            alt="Construction team on site"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]">Why Charis</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#3F4A44]">
            Two decades of delivering complex builds across Nigeria with an uncompromising focus on safety,
            transparency, and craftsmanship.
          </p>

          <ul className="mt-10 space-y-5">
            {whyChooseUsPoints.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E88A5F]/15 text-[#E88A5F]">
                  <CheckCircle2 size={20} />
                </span>
                <span className="text-lg font-medium text-[#1F2A24]">{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
