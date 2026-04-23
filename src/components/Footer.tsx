'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Building2, Plane, Hammer, MapPin, Phone, Mail } from 'lucide-react';
import logoLockupBlack from '@/assets/CC Logo Lockup (black).svg';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Image src={logoLockupBlack} alt="DotCharis Consult" className="h-12 w-auto mb-4" />
            <p className="text-muted-foreground mb-4">Your Property. Your Journey. One Consultant.</p>
            <div className="flex space-x-3">
              {['F', 'I', 'Y', 'L'].map((letter) => (
                <motion.div
                  key={letter}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm transition-colors hover:bg-primary/15 text-foreground"
                >
                  {letter}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/real-estate"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <Building2 size={16} className="mr-2" />
                  Real Estate
                </Link>
              </li>
              <li>
                <Link
                  href="/travels"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
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
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <Hammer size={16} className="mr-2" />
                  Construction Consultation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/real-estate/properties"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={CONSTRUCTION_CONSULTATION_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Book Consultation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-primary" />
                <span className="text-sm">Ring Road, Ibadan, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 flex-shrink-0 text-primary" />
                <a href="tel:+2340000000000" className="text-sm transition-colors hover:text-primary">
                  +234 XXX XXX XXXX
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 flex-shrink-0 text-primary" />
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} DotCharis Global Consult Limited. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
