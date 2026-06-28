'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { beforeAfter } from '@/components/pages/construction/construction-landing-data';

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section className="bg-[#FFFDF9] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]">Transformations</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
            Before &amp; After
          </h2>
          <p className="mt-4 text-lg text-[#3F4A44]">
            Drag to compare — {beforeAfter.title}, {beforeAfter.location}.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          ref={containerRef}
          className="relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-2xl border border-[#F0EDE6] shadow-sm"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="slider"
          aria-label="Before and after comparison"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <Image
            src={beforeAfter.after}
            alt="After renovation"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            priority={false}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={beforeAfter.before}
              alt="Before renovation"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          </div>

          <div
            className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-white shadow-lg"
            style={{ left: `${position}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#E88A5F] text-xs font-bold text-white shadow-lg">
              ↔
            </div>
          </div>

          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Before
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-[#E88A5F]/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            After
          </span>
        </motion.div>
      </div>
    </section>
  );
}
