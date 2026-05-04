'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Target, Eye, Award, Users } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Idowu Dotun',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    },
    {
      name: 'Adefunke Popoola',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    },
    {
      name: 'Fatunmbi Oluwasegun',
      role: 'Customer Relations Manager',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    },
    {
      name: 'Bello Olayinka',
      role: 'Secretary',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    },
    {
      name: 'Oshinowo Kofoworola',
      role: 'Construction Manager',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    },
    {
      name: 'Ayodeji Ogundele',
      role: 'International Consultant',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    },
    {
      name: 'Ngozi Eze',
      role: 'Construction Manager',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="relative py-32 px-6 lg:px-8 bg-gradient-to-br from-background via-[#fff8f0] to-[#e8f6f1] overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFmMmEyNCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-light text-foreground mb-6">
              Your Property. Your Journey.
              <br />
              <span className="text-primary">One Consultant.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DotCharis Global Consult Limited is Nigeria&apos;s premier integrated consultancy, delivering excellence in
              real estate, construction, and international travel services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#fff5eb] to-[#ffe8d4] rounded-3xl p-12 border border-border shadow-sm"
            >
              <Target size={48} className="text-primary mb-6" />
              <h2 className="text-3xl font-light text-foreground mb-4">Our Mission</h2>
              <p className="text-foreground/85 text-lg leading-relaxed">
                To provide world-class consultancy services that empower individuals and businesses to achieve their real
                estate, construction, and global mobility goals with confidence and ease.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#e8f6f1] to-[#d4ebe3] rounded-3xl p-12 border border-border shadow-sm"
            >
              <Eye size={48} className="text-brand-trust mb-6" />
              <h2 className="text-3xl font-light text-foreground mb-4">Our Vision</h2>
              <p className="text-foreground/85 text-lg leading-relaxed">
                To be the most trusted and innovative consultancy firm in Nigeria, recognized for seamlessly connecting
                people with exceptional properties and global opportunities.
              </p>
            </motion.div>
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
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                desc: 'We deliver nothing but the highest quality in every service',
                icon: Award,
              },
              {
                title: 'Integrity',
                desc: 'Transparency and honesty form the foundation of our relationships',
                icon: Users,
              },
              {
                title: 'Innovation',
                desc: 'We embrace technology and creative solutions to serve you better',
                icon: Target,
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-sm"
              >
                <value.icon size={40} className="text-primary mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
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
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-muted-foreground">Experienced professionals dedicated to your success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 border border-border shadow-sm">
                  <div
                    className="aspect-square bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a24]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-1">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-[#fff8f0] via-background to-[#e8f6f1] border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">Serving Nigeria, Reaching the World</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Based in Ibadan, we operate across Lagos, Abuja, Ogun, Osun, and beyond. Our international network extends
              to Turkey, Northern Cyprus, UK, Dubai, Canada, and more.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '6+', label: 'States Covered' },
                { number: '15+', label: 'Countries Served' },
                { number: '500+', label: 'Happy Clients' },
                { number: '1200+', label: 'Properties Sold' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-5xl font-light text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-border/70 bg-[#fbfafc] p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
                Success Stories
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
                See the projects and client journeys behind our reputation.
              </h2>
              <p className="text-[16px] leading-7 text-muted-foreground">
                Explore selected travel, property, and construction outcomes through photos, videos, and story-led highlights from our recent work.
              </p>
            </div>

            <Link
              href="/success-stories"
              className="inline-flex items-center justify-center rounded-full bg-[#c88a2d] px-5 py-3 text-sm font-medium text-white hover:bg-[#b67b25]"
            >
              Browse stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
