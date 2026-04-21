'use client';

import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import Link from 'next/link';
import { GraduationCap, Plane, Briefcase, Home as HomeIcon, Globe, Users } from 'lucide-react';

const CinematicHero = dynamic(() => import('@/components/CinematicHero'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-muted/40 animate-pulse" />,
});

export default function TravelPage() {
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1768069794857-9306ac167c6e?w=1920&q=80',
      title: 'Your Journey Starts Here',
      subtitle: 'Expert guidance for education, work, and travel abroad',
      cta: 'Explore Services',
      ctaHref: '/travels#services',
    },
    {
      image: 'https://images.unsplash.com/photo-1773829126358-1e5f4e5aa532?w=1920&q=80',
      title: 'Global Opportunities Await',
      subtitle: 'Visa advisory, relocation, and mobility solutions',
      cta: 'How It Works',
      ctaHref: '/travels#how-it-works',
    },
  ];

  const services = [
    {
      icon: GraduationCap,
      title: 'Educational Advancements',
      description: 'Study abroad pathways, school selection, and student visa support',
      color: 'from-sky-400/90 to-cyan-500/90',
      features: ['University Placement', 'Student Visas', 'Scholarship Guidance'],
    },
    {
      icon: Briefcase,
      title: 'Work & Immigration',
      description: 'Professional migration, work permits, and permanent residency',
      color: 'from-violet-400/90 to-fuchsia-500/80',
      features: ['Work Permits', 'PR Applications', 'Job Placement'],
    },
    {
      icon: Plane,
      title: 'Tourism & Travel',
      description: 'Complete travel planning, itineraries, and booking services',
      color: 'from-primary to-orange-400/90',
      features: ['Custom Itineraries', 'Flight Booking', 'Hotel Reservations'],
    },
    {
      icon: Globe,
      title: 'Visa Advisory',
      description: 'Expert visa guidance for all destinations and purposes',
      color: 'from-emerald-400/90 to-brand-trust',
      features: ['Document Review', 'Application Support', 'Interview Prep'],
    },
    {
      icon: HomeIcon,
      title: 'Relocation Services',
      description: 'End-to-end support for permanent moves and specialized travel',
      color: 'from-rose-400/85 to-orange-400/80',
      features: ['Housing Assistance', 'Logistics Support', 'Settlement Help'],
    },
    {
      icon: Users,
      title: 'Flight Reservations',
      description: 'Competitive rates and personalized ticketing services',
      color: 'from-indigo-400/85 to-sky-500/85',
      features: ['Best Prices', 'Flexible Options', 'Group Bookings'],
    },
  ];

  const destinations = [
    {
      name: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
      highlights: ['Study Programs', 'Work Visas', 'Tourism'],
    },
    {
      name: 'Dubai',
      image: 'https://images.unsplash.com/photo-1722379528856-b96fbbb5ce38?w=600&q=80',
      highlights: ['Business Travel', 'Tourism', 'Relocation'],
    },
    {
      name: 'Canada',
      image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=80',
      highlights: ['PR Programs', 'Study Permits', 'Work Opportunities'],
    },
    {
      name: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
      highlights: ['Cultural Exchange', 'Study Abroad', 'Tourism'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <CinematicHero slides={heroSlides} autoPlayInterval={8000} />

      <section id="services" className="py-24 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
              Comprehensive Travel Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From visa applications to relocation support, we handle every aspect of your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-500 border border-border"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}
                >
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Popular Destinations</h2>
            <p className="text-lg text-muted-foreground">We facilitate travel to destinations worldwide</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl h-96 cursor-pointer border border-border shadow-sm"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${destination.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a24]/85 via-[#1f2a24]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-light text-white mb-4">{destination.name}</h3>
                  <ul className="space-y-2">
                    {destination.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center text-sm text-white/90">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple, transparent process from consultation to departure</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'Book a free consultation to discuss your goals' },
              { step: '02', title: 'Documentation', desc: 'We guide you through required documents' },
              { step: '03', title: 'Application', desc: 'Submit applications with our expert support' },
              { step: '04', title: 'Approval', desc: 'Celebrate your successful approval and departure' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-light text-border mb-4">{item.step}</div>
                <h3 className="text-xl font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#e8f6f1] via-background to-[#fff5eb] border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Book a free consultation today and take the first step toward your goals
            </p>
            <Link href="/register?role=client&service=travel">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex px-10 py-4 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 cursor-pointer"
              >
                Create Travel Account
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
