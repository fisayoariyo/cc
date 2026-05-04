'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
}

interface CinematicHeroProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export default function CinematicHero({ slides, autoPlayInterval = 6000 }: CinematicHeroProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a1612]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Ken Burns Zoom Effect on Image */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              sizes="100vw"
              priority={currentSlide === 0}
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1f2a24]/55 via-[#1f2a24]/35 to-[#1f2a24]/70" />
          </motion.div>

          {/* Content with Parallax Effect */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
          >
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-normal leading-tight max-w-5xl"
              style={{ textShadow: '0 3px 22px rgba(0, 0, 0, 0.45)' }}
            >
              {slides[currentSlide].title.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-6 text-lg md:text-xl text-white/95 max-w-2xl font-normal tracking-normal"
              style={{ textShadow: '0 2px 16px rgba(0, 0, 0, 0.4)' }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {slides[currentSlide].cta && (
              <motion.button
                type="button"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(232, 138, 95, 1)' }}
                whileTap={{ scale: 0.95 }}
                className="mt-10 px-10 py-4 bg-primary text-primary-foreground text-sm font-medium tracking-wider uppercase rounded-full transition-all cursor-pointer"
                onClick={() => router.push(slides[currentSlide].ctaHref ?? '/contact')}
              >
                {slides[currentSlide].cta}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide ? 'w-12 bg-white' : 'w-8 bg-white/40'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors"
      >
        <ChevronDown size={32} />
      </motion.button>
    </div>
  );
}
