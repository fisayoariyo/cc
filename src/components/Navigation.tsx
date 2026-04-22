'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { AuthNav, AuthNavMobile } from '@/components/auth-nav';
import type { AuthNavInitialState } from '@/components/auth-nav';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import logoLockupBlack from '@/assets/CC Logo Lockup (black).svg';

export default function Navigation({ initialAuthState }: { initialAuthState: AuthNavInitialState }) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const routesToPrefetch = ['/', '/real-estate', '/travels', '/about', '/contact', '/login', '/register'];

    const warmRoutes = () => {
      routesToPrefetch.forEach((route) => router.prefetch(route));
    };

    if ('requestIdleCallback' in globalThis) {
      const id = globalThis.requestIdleCallback(() => warmRoutes());
      return () => globalThis.cancelIdleCallback(id);
    }

    const timeout = setTimeout(() => warmRoutes(), 800);
    return () => clearTimeout(timeout);
  }, [router]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Real Estate', path: '/real-estate' },
    { name: 'Travels', path: '/travels' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  /** Full-bleed dark heroes need light nav text. */
  const navOnDarkImage = !isScrolled && ['/', '/real-estate', '/travels'].includes(pathname);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              {navOnDarkImage ? (
                <Image
                  src={logoLockupColor}
                  alt="DotCharis Consult"
                  className="h-11 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                  priority
                />
              ) : (
                <Image src={logoLockupBlack} alt="DotCharis Consult" className="h-11 w-auto" priority />
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative text-sm font-medium transition-colors ${
                  pathname === item.path
                    ? navOnDarkImage
                      ? 'text-white'
                      : 'text-primary'
                    : navOnDarkImage
                      ? 'text-white/90 hover:text-white'
                      : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${navOnDarkImage ? 'bg-white' : 'bg-primary'}`}
                  />
                )}
              </Link>
            ))}
            <AuthNav navOnDarkImage={navOnDarkImage} initialState={initialAuthState} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${navOnDarkImage ? 'text-white' : 'text-foreground'}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-base font-medium ${
                    pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <AuthNavMobile onNavigate={() => setIsMobileMenuOpen(false)} initialState={initialAuthState} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
