'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Facebook, Globe, HelpCircle, Instagram, Linkedin, Play } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@dotcharisconsult',
    icon: Play,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/charis_consult/',
    icon: Instagram,
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/charisconsultdtn/',
    icon: Facebook,
  },
  {
    label: 'LinkedIn',
    href: 'https://ng.linkedin.com/company/dotcharisconsult',
    icon: Linkedin,
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#FFFDF9] text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-base text-muted-foreground">
            <Link href="/blog" className="font-medium transition-colors hover:text-primary">
              Follow our Blog
            </Link>
            <span aria-hidden className="text-border">|</span>
            <a
              href="https://dotcharisconsult.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              dotcharisconsult.com
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ y: -1 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About Charis
            </Link>
            <Link href="/contact" className="transition-colors hover:text-primary">
              Help
            </Link>
            <Link href="/blog" className="transition-colors hover:text-primary">
              Blog
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <HelpCircle size={15} />
              Help
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe size={15} />
              English
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">© {year} Charis Consult</p>
      </div>
    </footer>
  );
}
