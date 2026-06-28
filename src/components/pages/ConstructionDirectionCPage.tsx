'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';
import { LandingHeroTitle } from '@/components/landing/landing-hero-title';

const featuredProjects = [
  {
    name: 'Twinview Residence',
    location: 'Lekki, Lagos',
    image: '/images/construction-hero-bk.jpg',
  },
  {
    name: 'Cedar Courtyard',
    location: 'Ibeju-Lekki, Lagos',
    image: '/screenshots-construction-previews/current-dashboard.png',
  },
  {
    name: 'Oceanline Duplex',
    location: 'Victoria Island, Lagos',
    image: '/screenshots-construction-previews/direction-a-dashboard.png',
  },
  {
    name: 'Meridian Court',
    location: 'Ikoyi, Lagos',
    image: '/screenshots-construction-previews/direction-b-dashboard.png',
  },
];

const performanceStats = [
  {
    figure: '$1B+',
    label: 'Asset value supervised',
    detail: 'Capex governance from concept to handover.',
  },
  {
    figure: '48+',
    label: 'Builds delivered',
    detail: 'Private residential and commercial programs.',
  },
  {
    figure: '120+',
    label: 'Site milestones tracked',
    detail: 'Evidence-linked reporting for each stage.',
  },
  {
    figure: '96%',
    label: 'Client confidence score',
    detail: 'Post-handover survey average across projects.',
  },
];

const flowSteps = [
  {
    title: 'Vision Brief',
    summary: 'We translate your target lifestyle, budget guardrails, and schedule constraints into a build map.',
  },
  {
    title: 'Budget Lock',
    summary: 'BOQ and scope are frozen before mobilization so spend and approvals remain transparent.',
  },
  {
    title: 'Build Execution',
    summary: 'Milestone updates, inspections, and payment checkpoints are surfaced in one control view.',
  },
  {
    title: 'Precision Handover',
    summary: 'Snagging, documentation, and compliance sign-offs are wrapped into one closeout sprint.',
  },
];

export default function ConstructionDirectionCPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = featuredProjects.length;
  const activeProject = featuredProjects[activeIndex];
  const nextProject = featuredProjects[(activeIndex + 1) % slideCount];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [slideCount]);

  return (
    <main className="bg-[#FEFAF4] text-[#1F2A24]">
      <section className="border-b border-[#E9E2F2]">
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="relative min-h-[84vh] overflow-hidden rounded-[2rem] border border-[#D8CCE8]">
            {featuredProjects.map((project, index) => (
              <Image
                key={project.name}
                src={project.image}
                alt={project.name}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover transition-opacity duration-700 ${
                  index === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/38 to-black/28" />

            <div className="relative z-10 flex min-h-[84vh] items-end p-6 sm:p-8 lg:p-12">
              <div className="max-w-3xl">
                <p className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                  Direction C - Luxury Minimal
                </p>
                <LandingHeroTitle className="mt-6">
                  Building narratives for high-value construction.
                </LandingHeroTitle>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">
                  A cleaner light-mode shell with an inspiration-style corner slider that auto-cycles project
                  scenes.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/register?role=client&service=construction"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white bg-white px-7 text-sm font-semibold uppercase tracking-[0.08em] text-black transition hover:bg-white/90"
                  >
                    Start Project
                  </Link>
                  <a
                    href={CONSTRUCTION_CONSULTATION_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/16"
                  >
                    Speak to Craig
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/30 bg-black/35 p-4 text-white backdrop-blur-xl md:left-auto md:w-[430px]">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold tracking-[-0.03em]">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-white/35">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${((activeIndex + 1) / slideCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-white/75">{String(slideCount).padStart(2, '0')}</span>
              </div>

              <div className="mt-4 grid grid-cols-[5.5rem_1fr_5.5rem] items-center gap-3">
                <div className="relative h-20 overflow-hidden rounded-xl">
                  <Image src={activeProject.image} alt={activeProject.name} fill className="object-cover" sizes="100px" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-semibold tracking-[-0.03em]">{activeProject.name}</p>
                  <p className="text-base text-white/78">{activeProject.location}</p>
                </div>
                <div className="relative h-20 overflow-hidden rounded-xl opacity-75">
                  <Image src={nextProject.image} alt={nextProject.name} fill className="object-cover" sizes="100px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E9E2F2]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {performanceStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#E9E2F2] bg-white p-6">
                <p className="text-4xl font-semibold tracking-[-0.04em]">{item.figure}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#6E5B80]">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-[#4A5850]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#E9E2F2]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6E5B80]">How It Unfolds</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Structured flow. Cinematic delivery.
            </h2>
          </div>
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-[#DCCFEB] md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-8 md:space-y-12">
              {flowSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="relative grid grid-cols-[2.5rem_1fr] items-start md:grid-cols-[1fr_auto_1fr] md:gap-x-8"
                >
                  <div
                    className={`col-start-2 rounded-2xl border border-[#E9E2F2] bg-white p-6 ${
                      index % 2 === 0 ? 'md:col-start-3' : 'md:col-start-1'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-[#7B7391]">Step {index + 1}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#4A5850]">{step.summary}</p>
                  </div>
                  <div className="relative z-10 mt-6 flex justify-center md:col-start-2 md:mt-8">
                    <div className="h-3.5 w-3.5 rounded-full border border-[#3B0063] bg-white" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6E5B80]">Final CTA</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Let&apos;s shape your construction flagship.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4A5850]">
            Every standout project starts with one sharp conversation around outcomes, budget discipline, and
            execution standards.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={CONSTRUCTION_CONSULTATION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#3B0063] px-8 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#2E004D]"
            >
              Book Advisory Call
            </a>
            <Link
              href="/real-estate/construction"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#3B0063]/25 bg-white px-8 text-sm font-semibold uppercase tracking-[0.08em] text-[#3B0063] transition hover:bg-[#F3EBFA]"
            >
              Back to Current Landing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
