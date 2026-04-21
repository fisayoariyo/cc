'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Bath, Bed, ChevronLeft, MapPin, Share2, Square } from 'lucide-react';
import type { PropertyRecord } from '@/data/properties';
import { Button } from '@/components/ui/button';

type Props = { property: PropertyRecord };

export default function PropertyDetailView({ property }: Props) {
  const [active, setActive] = useState(0);
  const imgs = property.images.length ? property.images : [property.image];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Link
          href="/real-estate/properties"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-muted shadow-sm"
            >
              <Image
                src={imgs[active]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </motion.div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imgs.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-20 w-28 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    active === i ? 'border-primary' : 'border-transparent ring-1 ring-border'
                  }`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="112px" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">{property.type}</span>
                <button
                  type="button"
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <h1 className="text-3xl font-light text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground text-sm mb-6">
                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                {property.location}
              </div>
              <p className="text-3xl font-semibold text-foreground mb-6">{property.price}</p>
              {(property.beds > 0 || property.baths > 0 || property.sqm > 0) && (
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                  <div className="text-center">
                    <Bed className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-medium text-foreground">{property.beds}</div>
                    <div className="text-xs text-muted-foreground">Beds</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-medium text-foreground">{property.baths}</div>
                    <div className="text-xs text-muted-foreground">Baths</div>
                  </div>
                  <div className="text-center">
                    <Square className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-medium text-foreground">{property.sqm}</div>
                    <div className="text-xs text-muted-foreground">m²</div>
                  </div>
                </div>
              )}
              <Button className="w-full mt-6 rounded-full" asChild>
                <Link href="/contact">Book a viewing</Link>
              </Button>
              <Button variant="outline" className="w-full mt-3 rounded-full bg-transparent" asChild>
                <Link href="/contact">Make an inquiry</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl">
          <h2 className="text-xl font-medium text-foreground mb-4">About this property</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>
      </div>
    </div>
  );
}
