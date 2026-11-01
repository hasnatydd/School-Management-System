'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What curriculum framework does Sonargaon International School follow?',
      a: 'We follow a comprehensive Cambridge Assessment International Education (CAIE) curriculum framework paired with core national educational requirements, ensuring proficiency in English Language, Literature, Additional Mathematics, and Sciences, alongside rigorous Bengali language and Bangladesh Studies.',
    },
    {
      q: 'What grade continuum is offered at Sonargaon?',
      a: 'We offer a continuous 10-grade continuum starting from Primary Wing (Grade 1 through Grade 5), Junior Secondary (Grade 6 through Grade 8), and Senior Secondary (Grade 9 through Grade 10).',
    },
    {
      q: 'What is the official school instructional schedule?',
      a: 'In alignment with the Bangladesh school calendar, our instructional week runs from Sunday through Thursday. Friday and Saturday are official weekend days. Class hours are 08:30 AM to 01:50 PM.',
    },
    {
      q: 'How does the online application process work?',
      a: 'Parents can fill out the online application form at our Admissions portal (/admissions). Upon submission, you will receive an official Application Tracking ID (e.g. SIS-ADM-2026-101) to monitor review status and interview scheduling.',
    },
    {
      q: 'Does Sonargaon International School provide transport facilities?',
      a: 'Yes. We operate an extensive, air-conditioned fleet of GPS-monitored school buses covering Uttara, Banani, Gulshan, Baridhara, Dhanmondi, and Mirpur with trained security personnel and attendant supervisors on every route.',
    },
    {
      q: 'How does the school assess student performance?',
      a: 'We utilize a GPA 5.0 scale with Cambridge grade equivalents (A+ = 5.0, A = 4.5, A- = 4.0, B = 3.5, C = 3.0, D = 2.0, F = 0.0). Term report cards and official transcripts are published digitally to parent and student portals and are also available for secure public result verification (/results).',
    },
    {
      q: 'How can parents pay school fees?',
      a: 'Fees can be paid online via our fee management portal, through bank wire transfer, or in person at the cashier counter in Bangladeshi Taka. Instant verified clearance receipts are generated for all transactions.',
    },
  ];

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Parent & Scholar Inquiries
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Essential information regarding admissions, Cambridge accreditation, school routines, student life, and tuition vouchers.
          </p>
        </div>
      </section>

      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-steelGrey/20 bg-warmIvory/30 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-midnight hover:text-antiqueGold transition"
              >
                <span>{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-5 h-5 text-antiqueGold flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-steelGrey flex-shrink-0" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans border-t border-steelGrey/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}

          <div className="p-6 rounded-2xl bg-midnight text-pureWhite mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-base text-warmGold">Have a specific question not addressed above?</h4>
              <p className="text-xs text-slate-300 mt-0.5">Our admissions team is available Sunday through Thursday.</p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase rounded-lg shadow-sm whitespace-nowrap"
            >
              Contact Admissions &rarr;
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
