'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'motion/react';
import PropertyCard from '@/components/PropertyCard';
import { ArrowRight, Building2, Home, MapPin } from 'lucide-react';
import type { PropertyRecord } from '@/data/properties';

const CinematicHero = dynamic(() => import('@/components/CinematicHero'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-muted/40 animate-pulse" />,
});

export default function RealEstatePage({ featuredProperties }: { featuredProperties: PropertyRecord[] }) {
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1762568702039-9ef749e06152?w=1920&q=80',
      title: 'Luxury on an Endless Horizon',
      subtitle: 'Discover exceptional waterfront properties across Nigeria',
      cta: 'Explore Properties',
      ctaHref: '/real-estate/properties',
    },
    {
      image: 'https://images.unsplash.com/photo-1775466989637-a142f04aa2ad?w=1920&q=80',
      title: 'Modern Living Redefined',
      subtitle: "Premium estates nestled in nature's embrace",
      cta: 'View Collection',
      ctaHref: '/real-estate/properties',
    },
    {
      image: 'https://images.unsplash.com/photo-1775466989717-6ca5a1943c6a?w=1920&q=80',
      title: 'Your Dream Home Awaits',
      subtitle: 'Curated selection of luxury real estate',
      cta: 'Start Your Journey',
      ctaHref: '/real-estate/properties',
    },
  ];

  const cities = [
    { name: 'Ibadan', count: '120+ Properties', image: 'https://images.unsplash.com/photo-1775794006766-a8b8fe0d8763?w=600&q=80' },
    { name: 'Lagos', count: '250+ Properties', image: 'https://images.unsplash.com/photo-1765439178218-e54dcbb64bcb?w=600&q=80' },
    { name: 'Abuja', count: '180+ Properties', image: 'https://images.unsplash.com/photo-1771466883495-a65f9aedf39a?w=600&q=80' },
    { name: 'Ogun', count: '95+ Properties', image: 'https://images.unsplash.com/photo-1758526116315-361575027838?w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CinematicHero slides={heroSlides} autoPlayInterval={7000} />

      <section className="py-24 px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Featured Properties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked luxury estates from our premium collection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PropertyCard
                  image={property.image}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  sqm={property.sqm}
                  type={property.type}
                  slug={property.slug}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/real-estate/properties"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/15"
            >
              View All Properties
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/register?role=agent"
              className="inline-flex items-center px-8 py-4 bg-card text-foreground text-sm font-medium rounded-full border border-border hover:bg-muted transition-colors"
            >
              Become Agent
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Browse by Type</h2>
            <p className="text-lg text-muted-foreground">Find the perfect property for your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Home, title: 'Residential', desc: 'Apartments, Villas, Duplexes', count: '450+' },
              { icon: Building2, title: 'Commercial', desc: 'Offices, Shops, Warehouses', count: '180+' },
            ].map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/80 p-12 cursor-pointer shadow-sm"
              >
                <type.icon size={48} className="text-primary mb-6" />
                <h3 className="text-3xl font-light text-foreground mb-2">{type.title}</h3>
                <p className="text-muted-foreground mb-4">{type.desc}</p>
                <span className="text-primary font-medium">{type.count} Properties</span>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Explore by Location</h2>
            <p className="text-lg text-muted-foreground">Properties across Nigeria&apos;s premium locations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer border border-border shadow-sm"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${city.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a24]/75 via-[#1f2a24]/35 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center text-white/90 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{city.count}</span>
                  </div>
                  <h3 className="text-2xl font-light text-white">{city.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground">Your trusted partner in real estate excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Verified Listings',
                desc: 'Every property is thoroughly vetted and verified before listing',
              },
              {
                title: 'Expert Guidance',
                desc: 'Professional support throughout your property journey',
              },
              {
                title: 'Nationwide Coverage',
                desc: 'Premium properties across all major Nigerian cities',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/20">
                  <div className="w-8 h-8 bg-primary rounded-full" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#fff5eb] via-background to-[#e8f6f1] border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Let&apos;s help you discover the perfect space for your next chapter
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/real-estate/properties"
                className="inline-flex px-8 py-4 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/15"
              >
                Browse Properties
              </Link>
              <Link
                href="/register?role=client&service=real_estate"
                className="inline-flex px-8 py-4 bg-card text-foreground text-sm font-medium rounded-full border border-border hover:bg-muted transition-colors"
              >
                Start as Client
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
