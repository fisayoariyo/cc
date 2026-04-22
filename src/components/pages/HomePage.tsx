'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Plane, Hammer, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';

/** Deterministic layout/animation — avoids Math.random() hydration mismatch (SSR vs client). */
const HERO_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 37 + 11) % 92) + 4,
  top: ((i * 61 + 7) % 88) + 6,
  dx: ((i * 19) % 60) - 30,
  dy: ((i * 29) % 60) - 30,
  duration: 5 + (i % 5) * 0.9,
}));

export default function HomePage() {
  const router = useRouter();
  const [heroParticlesMounted, setHeroParticlesMounted] = useState(false);
  useEffect(() => {
    setHeroParticlesMounted(true);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Hero — dark cinematic direction */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07192f]"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_72%,rgba(244,141,32,0.32),transparent_36%),radial-gradient(circle_at_28%_22%,rgba(56,112,206,0.22),transparent_34%),linear-gradient(180deg,#0A1F3A_0%,#0B2444_58%,#132B4D_100%)]"
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {heroParticlesMounted &&
            HERO_PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.15, 0.45, 0.15],
                  scale: [1, 1.5, 1],
                  x: [0, p.dx, 0],
                  y: [0, p.dy, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="absolute h-1.5 w-1.5 rounded-full bg-[#f39a1d]/40 blur-[0.2px]"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                }}
              />
            ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.07),transparent_48%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.h1 className="mb-5 text-5xl font-light leading-[1.14] tracking-[-0.02em] text-white md:text-7xl lg:text-8xl">
              <span className="block">Your Property. Your</span>
              <span className="block">Journey.</span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="mt-2 block text-[#f39a1d]"
              >
                One Consultant.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mx-auto mb-10 max-w-3xl text-base text-white/85 md:text-xl"
            >
              Real Estate • Construction • Travel & Mobility
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="flex flex-col justify-center gap-3 sm:flex-row"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, backgroundColor: '#e48915' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/real-estate')}
                className="group inline-flex cursor-pointer items-center rounded-full bg-[#f39a1d] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(243,154,29,0.26)] transition-all"
              >
                Browse Properties
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1.5" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/travels')}
                className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/14 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm"
              >
                Plan Your Trip
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.1 }}
              className="mt-5 flex flex-wrap justify-center gap-2"
            >
              <Link href="/register?role=client&service=travel" className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/90 hover:bg-white/10">
                New Travel Client
              </Link>
              <Link href="/register?role=client&service=real_estate" className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/90 hover:bg-white/10">
                New Real Estate Client
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center p-2">
            <motion.div className="w-1.5 h-3 bg-primary/50 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-32 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-medium text-foreground mb-6">
              Three Services, One Partner
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need under one roof
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Link href="/real-estate">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#fff5eb] to-[#ffe8d4] p-12 h-96 cursor-pointer shadow-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-60 bg-primary/25"
                />
                <Building2 size={64} className="text-primary mb-6" />
                <h3 className="text-4xl font-medium text-foreground mb-4">Real Estate</h3>
                <p className="text-foreground/85 text-lg mb-6">
                  Premium properties across Nigeria. Buy, sell, rent, or invest with confidence.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    Residential & Commercial
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    Verified Listings
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    Expert Guidance
                  </li>
                </ul>
                <motion.div whileHover={{ x: 10 }} className="absolute bottom-12 right-12">
                  <ArrowRight size={32} className="text-primary" />
                </motion.div>
              </motion.div>
            </Link>

            <Link href="/travels">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#e8f6f1] to-[#d4ebe3] p-12 h-96 cursor-pointer shadow-sm"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-trust/25 rounded-full blur-3xl opacity-70"
                />
                <Plane size={64} className="text-brand-trust mb-6" />
                <h3 className="text-4xl font-medium text-foreground mb-4">Travel & Mobility</h3>
                <p className="text-foreground/85 text-lg mb-6">
                  International travel, visa advisory, education, and relocation services.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-trust rounded-full mr-3" />
                    Educational Pathways
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-trust rounded-full mr-3" />
                    Work & Immigration
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-brand-trust rounded-full mr-3" />
                    Tourism Planning
                  </li>
                </ul>
                <motion.div whileHover={{ x: 10 }} className="absolute bottom-12 right-12">
                  <ArrowRight size={32} className="text-brand-trust" />
                </motion.div>
              </motion.div>
            </Link>

            <Link href="/register?role=client&service=construction" className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#f0faf5] via-card to-[#fff8f0] p-12 cursor-pointer shadow-sm"
              >
              <div className="flex flex-col md:flex-row items-start justify-between">
                <div className="max-w-2xl">
                  <Hammer size={64} className="text-primary mb-6" />
                  <h3 className="text-4xl font-medium text-foreground mb-4">Construction</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Full construction project management and design-build advisory. From land to luxury.
                  </p>
                  <ul className="grid grid-cols-2 gap-3 text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Residential Builds
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Commercial Projects
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Design Advisory
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      Project Management
                    </li>
                  </ul>
                </div>
                <motion.div whileHover={{ x: 10 }} className="mt-8 md:mt-0">
                  <ArrowRight size={40} className="text-primary" />
                </motion.div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 lg:px-8 bg-muted/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Users, value: '500+', label: 'Happy Clients', color: 'text-sky-600' },
              { icon: Award, value: '1200+', label: 'Properties Sold', color: 'text-primary' },
              { icon: TrendingUp, value: '850+', label: 'Successful Applications', color: 'text-brand-trust' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <stat.icon size={48} className={`${stat.color} mx-auto mb-4`} />
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                  className="text-5xl font-medium text-foreground mb-2"
                >
                  {stat.value}
                </motion.h3>
                <p className="text-lg text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-medium text-foreground mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Let&apos;s help you find your dream property or plan your next adventure
            </p>
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-primary text-primary-foreground text-base font-medium rounded-full hover:bg-primary/90 transition-colors inline-flex items-center shadow-md shadow-primary/20 cursor-pointer"
              >
                Get Started Today
                <ArrowRight size={20} className="ml-2" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
