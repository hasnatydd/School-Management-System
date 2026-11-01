'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactMessage } from '@/app/actions/school-actions';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessage(formData);

    if (res.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Failed to deliver your message. Please check required fields.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Institutional Communications Desk
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Contact Sonargaon International School
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Our admissions counselors, academic coordinators, and administrative officers are available to assist prospective and current families.
          </p>
        </div>
      </section>

      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Campus Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
                  Direct Inquiries
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-midnight uppercase tracking-tight">
                  Reach Our Campus
                </h2>
                <p className="text-xs sm:text-sm text-steelGrey font-sans leading-relaxed">
                  Located in the premier residential and diplomatic zone of Dhaka, our campus is readily accessible with designated visitor parking.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-midnight text-warmGold flex-shrink-0">
                    <MapPin className="w-5 h-5 text-antiqueGold" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-midnight text-sm">Physical Campus Address</h4>
                    <p className="text-xs text-charcoal/80 mt-0.5">
                      Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-midnight text-warmGold flex-shrink-0">
                    <Phone className="w-5 h-5 text-antiqueGold" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-midnight text-sm">Telephone & Hotline</h4>
                    <p className="text-xs text-charcoal/80 mt-0.5 font-mono">
                      Main Desk: +880 2 8876543 <br />
                      Admissions Hotline: +880 1711 000000
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-midnight text-warmGold flex-shrink-0">
                    <Mail className="w-5 h-5 text-antiqueGold" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-midnight text-sm">Electronic Mail</h4>
                    <p className="text-xs text-charcoal/80 mt-0.5 font-mono">
                      General: info@sonargaon.edu.bd <br />
                      Admissions: admissions@sonargaon.edu.bd
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-midnight text-warmGold flex-shrink-0">
                    <Clock className="w-5 h-5 text-antiqueGold" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-midnight text-sm">Office & Visiting Hours</h4>
                    <p className="text-xs text-charcoal/80 mt-0.5 font-sans">
                      Sunday through Thursday: 08:00 AM – 04:00 PM <br />
                      Friday & Saturday: Official Weekend (Emergency Desk Only)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Validated Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 p-6 sm:p-10 shadow-card">
                <div className="pb-4 border-b border-steelGrey/20 mb-6">
                  <h3 className="font-heading font-extrabold text-xl text-midnight uppercase">
                    Dispatch an Official Inquiry
                  </h3>
                  <p className="text-xs text-steelGrey mt-0.5">
                    Messages are routed directly to the Principal’s Directorate and relevant academic department.
                  </p>
                </div>

                {success ? (
                  <div className="p-8 text-center space-y-3 bg-deepEmerald/10 border border-deepEmerald/30 rounded-xl">
                    <CheckCircle2 className="w-12 h-12 text-deepEmerald mx-auto" />
                    <h4 className="font-heading font-bold text-lg text-midnight">Message Dispatched Successfully!</h4>
                    <p className="text-xs text-charcoal max-w-md mx-auto">
                      Thank you for contacting Sonargaon International School. Our administrative office has recorded your communication and will reply via email or telephone within one business day.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-3 px-5 py-2 bg-midnight text-pureWhite font-heading font-bold text-xs uppercase rounded-lg"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    {error && (
                      <div className="p-3 bg-mutedRed/10 border border-mutedRed/30 text-mutedRed rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-charcoal mb-1">Full Name *</label>
                        <input
                          name="name"
                          required
                          placeholder="e.g. Dr. Zulfiqar Haider"
                          className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-charcoal mb-1">Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-charcoal mb-1">Contact Phone</label>
                        <input
                          name="phone"
                          placeholder="+880 1711 000000"
                          className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-charcoal mb-1">Subject / Department *</label>
                        <input
                          name="subject"
                          required
                          placeholder="e.g. Cambridge Admissions Inquiry / Transfer"
                          className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-charcoal mb-1">Detailed Message *</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder="Please write your inquiry or request for campus tour..."
                        className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-antiqueGold/40 transition disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-antiqueGold" />
                        <span>{submitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
