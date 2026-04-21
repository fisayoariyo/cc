'use client';

import { useActionState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { submitInquiry, type InquirySubmitState } from '@/app/(site)/contact/actions';

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState<InquirySubmitState, FormData>(submitInquiry, null);

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#fff8f0] via-background to-[#e8f6f1] border-b border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-4">Get In Touch</h1>
            <p className="text-xl text-muted-foreground">Let&apos;s discuss your property or travel needs</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-light text-foreground mb-8">Send Us a Message</h2>

              <form action={formAction} className="space-y-6">
                {state && 'error' in state && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {state.error}
                  </div>
                )}
                {state && 'success' in state && (
                  <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
                    Message sent successfully. Our team will contact you shortly.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Inquiry Type</label>
                  <select
                    name="inquiry_type"
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Real Estate - Purchase">Real Estate - Purchase</option>
                    <option value="Real Estate - Rent">Real Estate - Rent</option>
                    <option value="Real Estate - Sell">Real Estate - Sell</option>
                    <option value="Construction">Construction</option>
                    <option value="Travel Services">Travel Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isPending}
                  className="w-full px-8 py-4 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/15"
                >
                  {isPending ? 'Sending…' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-light text-foreground mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin size={24} className="text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Our Office</h3>
                      <p className="text-muted-foreground">
                        Jofat Shopping Plaza
                        <br />
                        Ring Road, Ibadan
                        <br />
                        Oyo State, Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone size={24} className="text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground">+234 XXX XXX XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail size={24} className="text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">info@dotcharisconsult.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock size={24} className="text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-2xl h-80 flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground">
                  <MapPin size={48} className="mx-auto mb-2 text-primary" />
                  <p>Map Integration</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {['Facebook', 'Instagram', 'YouTube', 'LinkedIn'].map((platform) => (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-muted rounded-full flex items-center justify-center hover:bg-primary/15 transition-colors border border-border"
                    >
                      <span className="text-xs text-muted-foreground">{platform[0]}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
