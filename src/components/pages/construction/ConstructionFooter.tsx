'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Play } from 'lucide-react';

const SOCIAL = [
  { label: 'YouTube', href: 'https://www.youtube.com/@dotcharisconsult', icon: Play },
  { label: 'Instagram', href: 'https://www.instagram.com/charis_consult/', icon: Instagram },
  { label: 'Facebook', href: 'https://web.facebook.com/charisconsultdtn/', icon: Facebook },
  { label: 'LinkedIn', href: 'https://ng.linkedin.com/company/dotcharisconsult', icon: Linkedin },
] as const;

const QUICK_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Real Estate', href: '/real-estate' },
  { label: 'Travel', href: '/travel' },
] as const;

export function ConstructionFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-white/10 bg-[#080808] text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-lg font-semibold text-white">Charis Construction</p>
            <p className="mt-4 text-sm leading-relaxed">
              Premium commercial and residential construction across Nigeria — built with precision, delivered on
              time.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#E88A5F]/50 hover:text-[#E88A5F]"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</p>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition hover:text-[#E88A5F]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Contact</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#E88A5F]" />
                <span>Lagos &amp; Abuja, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-[#E88A5F]" />
                <a href="tel:+2348000000000" className="transition hover:text-[#E88A5F]">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-[#E88A5F]" />
                <a href="mailto:info@dotcharisconsult.com" className="transition hover:text-[#E88A5F]">
                  info@dotcharisconsult.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Newsletter</p>
            <p className="mt-4 text-sm">Project insights and industry updates, monthly.</p>
            <form
              className="mt-5 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="construction-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="construction-newsletter"
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#E88A5F]/50"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#E88A5F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d97a4f]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Charis Consult. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition hover:text-[#E88A5F]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#E88A5F]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
