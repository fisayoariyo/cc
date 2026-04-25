'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Building2, Plane, Hammer, MapPin, Phone, Mail, Instagram, Facebook, Linkedin } from 'lucide-react';
import logoLockupBlack from '@/assets/CC Logo Lockup (black).svg';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';

const SOCIAL_LINKS = [
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
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <Image src={logoLockupBlack} alt="Charis Consult" className="mb-4 h-12 w-auto" />
            <p className="mb-4 text-muted-foreground">Your Property. Your Journey. One Consultant.</p>
            <div className="flex space-x-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary/15 hover:text-primary"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/real-estate"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Building2 size={16} className="mr-2" />
                  Real Estate
                </Link>
              </li>
              <li>
                <Link
                  href="/travel"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Plane size={16} className="mr-2" />
                  Travel & Mobility
                </Link>
              </li>
              <li>
                <a
                  href={CONSTRUCTION_CONSULTATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <Hammer size={16} className="mr-2" />
                  Construction Consultation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={CONSTRUCTION_CONSULTATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Book Consultation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-medium">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-3 mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <MapPin size={18} />
                </span>
                <span className="text-sm">
                  Suite 5, Jofat Shopping Plaza, Joyce B Junction, opposite Mobil Filling Station, Ringroad, Ibadan
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Phone size={18} />
                </span>
                <a href="tel:+2348105844946" className="text-sm transition-colors hover:text-primary">
                  +234 810 584 4946
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <Mail size={18} />
                </span>
                <a
                  href="mailto:info@dotcharisconsult.com"
                  className="text-sm transition-colors hover:text-primary"
                >
                  info@dotcharisconsult.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Charis Consult. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
