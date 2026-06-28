'use client';

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';

export function ConstructionCtaBanner() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-[#E88A5F] to-[#d97a4f] py-24 sm:py-32">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Ready to Build Something Exceptional?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/85"
        >
          Schedule a free consultation with our project team. We&apos;ll assess your site, scope, and timeline —
          no obligation.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10"
        >
          <a
            href={CONSTRUCTION_CONSULTATION_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-base font-semibold text-[#1F2A24] shadow-lg transition hover:bg-white/90"
          >
            Request a Free Consultation
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
