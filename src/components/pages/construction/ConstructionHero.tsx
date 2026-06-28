'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { landingHeroTitle } from '@/components/landing/landing-hero-title';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';
import {
  CONSTRUCTION_HERO_POSTER,
  CONSTRUCTION_VIDEO_SRC,
} from '@/components/pages/construction/construction-landing-data';

export function ConstructionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Defer the heavy remote video until after hydration, and skip it entirely
  // for reduced-motion users. The poster image is the server-rendered LCP.
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowVideo(true);
    }
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#0a0a0a]"
    >
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-110">
        <Image
          src={CONSTRUCTION_HERO_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
        {showVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={CONSTRUCTION_HERO_POSTER}
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          >
            <source src={CONSTRUCTION_VIDEO_SRC} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]"
        >
          Charis Construction
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={landingHeroTitle('on-dark', 'max-w-4xl')}
        >
          From Blueprint to Reality.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          Commercial and residential construction built with precision, delivered on time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <a
            href={CONSTRUCTION_CONSULTATION_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#E88A5F] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#d97a4f]"
          >
            Get a Free Estimate
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <Link
            href="#projects"
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#E88A5F] hover:bg-[#E88A5F] hover:text-white"
          >
            View Projects
          </Link>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="h-10 w-6 rounded-full border border-white/30 p-1.5"
        >
          <div className="mx-auto h-2 w-1 rounded-full bg-white/70" />
        </motion.div>
      </div>
    </section>
  );
}
