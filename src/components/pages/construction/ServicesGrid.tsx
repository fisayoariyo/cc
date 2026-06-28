'use client';

import { useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Building2,
  ClipboardList,
  Hammer,
  HardHat,
  Home,
  Paintbrush,
  type LucideIcon,
} from 'lucide-react';
import { services, type ServiceIconName } from '@/components/pages/construction/construction-landing-data';

const SERVICE_ICONS: Record<ServiceIconName, LucideIcon> = {
  home: Home,
  building: Building2,
  hammer: Hammer,
  clipboard: ClipboardList,
  paintbrush: Paintbrush,
  'hard-hat': HardHat,
};

export function ServicesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="services" ref={sectionRef} className="bg-[#FEFAF4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]">Services</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
            Built for every scale of project
          </h2>
          <p className="mt-4 text-lg text-[#3F4A44]">
            From single-family homes to commercial campuses — precision delivery at every stage.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-[#F0EDE6] bg-[#FFFDF9] p-8 shadow-sm transition-shadow hover:border-[#E88A5F]/40 hover:shadow-xl hover:shadow-[#E88A5F]/10"
              >
                <div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-[#E88A5F]/20 bg-[#E88A5F]/10 text-[#E88A5F] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#E88A5F]/40 group-hover:bg-[#E88A5F]/20"
                  aria-hidden
                >
                  <Icon className="h-6 w-6 shrink-0" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2A24]">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3F4A44]">{service.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#E88A5F] opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
