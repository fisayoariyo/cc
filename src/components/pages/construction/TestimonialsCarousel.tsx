'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/components/pages/construction/construction-landing-data';

const AUTOPLAY_MS = 6000;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-[#E88A5F] text-[#E88A5F]' : 'text-[#1F2A24]/15'}
        />
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="bg-[#FEFAF4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E88A5F]">Testimonials</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#1F2A24] sm:text-5xl">
              Trusted by developers &amp; owners
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F0EDE6] bg-[#FFFDF9] text-[#1F2A24] transition hover:border-[#E88A5F] hover:text-[#E88A5F]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F0EDE6] bg-[#FFFDF9] text-[#1F2A24] transition hover:border-[#E88A5F] hover:text-[#E88A5F]"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="min-w-0 flex-[0_0_100%] rounded-2xl border border-[#F0EDE6] bg-[#FFFDF9] p-8 shadow-sm sm:flex-[0_0_85%] lg:flex-[0_0_70%] lg:p-12"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#E88A5F]/30">
                    <Image src={item.photo} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <StarRating rating={item.rating} />
                    <blockquote className="mt-6 text-xl leading-relaxed text-[#1F2A24] sm:text-2xl">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <footer className="mt-8">
                      <p className="font-semibold text-[#1F2A24]">{item.name}</p>
                      <p className="text-sm text-[#3F4A44]">{item.company}</p>
                    </footer>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === selected ? 'w-8 bg-[#E88A5F]' : 'w-2 bg-[#1F2A24]/15'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
