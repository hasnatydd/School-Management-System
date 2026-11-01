import React from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 text-pureWhite border-b-2 border-antiqueGold/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-heading font-bold text-warmGold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Institutional Compliance
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Educational Data Privacy Policy
          </h1>
          <p className="text-xs text-slate-300 font-mono">Effective Session: AY 2026–2027</p>
        </div>
      </section>

      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-charcoal font-sans leading-relaxed">
          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">1. Scope of Policy</h3>
            <p>
              Sonargaon International School is committed to maintaining the confidentiality, integrity, and security of personal and academic data pertaining to scholars, parents, faculty, and prospective applicants.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">2. Information Collection</h3>
            <p>
              We collect information strictly necessary for academic administration, admissions evaluations, emergency medical contacts, roll-call attendance logs, examination performance, and tuition fee ledgers.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">3. Public Result Verification Privacy</h3>
            <p>
              Our public examination result lookup portal (/results) is engineered under strict privacy-first guidelines. Personal addresses, phone numbers, email addresses, and parent credentials are completely masked and never disclosed through public verification queries.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">4. Third-Party Disclosures</h3>
            <p>
              Student information is never sold or shared with commercial entities. Disclosures occur solely for statutory educational compliance, Cambridge International examination registration, or medical emergency treatment.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
