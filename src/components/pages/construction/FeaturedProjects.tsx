'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { featuredProjects } from '@/components/pages/construction/construction-landing-data';

export function FeaturedProjects() {
  return (
    <section id="projects" className="bg-[#FFFDF9] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]">Portfolio</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-[#3F4A44]">
              A selection of recent builds across residential, commercial, and industrial sectors.
            </p>
          </div>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
                <motion.article
                  key={project.name}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
                      <span className="inline-block rounded-full bg-[#E88A5F]/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        {project.category}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold text-white">{project.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
                        <MapPin size={14} />
                        {project.location}
                      </p>
                      <p className="text-sm text-white/50">{project.year}</p>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                        View Case Study
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
