'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Building2, Plane, Hammer, MapPin, Phone, Mail } from 'lucide-react';
import logoLockupBlack from '@/assets/CC Logo Lockup (black).svg';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image src={logoLockupBlack} alt="DotCharis Consult" className="h-12 w-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Your Property. Your Journey. One Consultant.
            </p>
            <div className="flex space-x-3">
              {['F', 'I', 'Y', 'L'].map((letter) => (
                <motion.button
                  key={letter}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm transition-colors hover:bg-primary/15 text-foreground"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-medium mb-4">Services</h4>
            <ul className="space-y-3">
              {[
                { name: 'Real Estate', path: '/real-estate', icon: Building2 },
                { name: 'Travel & Mobility', path: '/travels', icon: Plane },
                { name: 'Construction', path: '/real-estate', icon: Hammer },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                  >
                    <service.icon size={16} className="mr-2" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Properties', href: '/real-estate/properties' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-primary" />
                <span className="text-sm">Ring Road, Ibadan, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 flex-shrink-0 text-primary" />
                <span className="text-sm">+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 flex-shrink-0 text-primary" />
                <span className="text-sm">info@dotcharisconsult.com</span>
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
