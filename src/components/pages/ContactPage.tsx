'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, X } from 'lucide-react';
import { submitInquiry, type InquirySubmitState } from '@/app/(site)/contact/actions';
import { LandingHeroTitle } from '@/components/landing/landing-hero-title';

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState<InquirySubmitState, FormData>(submitInquiry, null);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && 'success' in state) {
      setShowSuccess(true);
      formRef.current?.reset();
    }
  }, [state]);

  useEffect(() => {
    if (!showSuccess) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSuccess(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSuccess]);

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
            <LandingHeroTitle tone="on-light" className="mb-4">
              Get In Touch
            </LandingHeroTitle>
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

              <form ref={formRef} action={formAction} className="space-y-6">
                {state && 'error' in state && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {state.error}
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
                        Suite 5, Jofat Shopping Plaza, Joyce B Junction
                        <br /> 
                        Opposite Mobil Filling Station
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
                      <a href="tel:+2340000000000" className="text-muted-foreground transition-colors hover:text-primary">
                        +234 810 584 4946
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail size={24} className="text-primary mr-4 mt-1" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:info@dotcharisconsult.com"
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        info@dotcharisconsult.com
                      </a>
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

              <div className="rounded-2xl h-80 overflow-hidden border border-border">
                <iframe
                  title="Charis Consult office location"
                  src="https://www.google.com/maps?q=Jofat%20Shopping%20Plaza%2C%20Ring%20Road%2C%20Ibadan%2C%20Oyo%20State%2C%20Nigeria&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSuccess(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-success-title"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.3 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <CheckCircle2 className="h-9 w-9 text-primary" />
              </motion.div>

              <h3 id="contact-success-title" className="mb-2 text-2xl font-semibold text-foreground">
                Message sent!
              </h3>
              <p className="text-muted-foreground">
                Thank you for reaching out to Charis Consult. Our team will reach out to you soon.
              </p>

              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="mt-6 w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/15 transition-colors hover:bg-primary/90"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
