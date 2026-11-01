import React from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { FileText } from 'lucide-react';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 text-pureWhite border-b-2 border-antiqueGold/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-heading font-bold text-warmGold uppercase tracking-widest">
            <FileText className="w-4 h-4" />
            Institutional Governance
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
            Terms & Conditions of Enrollment
          </h1>
          <p className="text-xs text-slate-300 font-mono">Academic Year 2026–2027</p>
        </div>
      </section>

      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-charcoal font-sans leading-relaxed">
          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">1. Code of Scholastic Conduct</h3>
            <p>
              Enrollment at Sonargaon International School implies solemn adherence to the Student Code of Conduct. Mutual respect, intellectual honesty, regular attendance, and adherence to uniform dress codes are mandatory conditions of continued admission.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">2. Attendance Compliance</h3>
            <p>
              Scholars are expected to maintain a minimum of 85% attendance during the instructional week (Sunday through Thursday). Unexcused absences exceeding institutional thresholds may jeopardize eligibility for term examination entry.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">3. Tuition & Fee Settlements</h3>
            <p>
              All academic fees are denominated in Bangladeshi Taka and must be cleared according to the quarterly billing schedule published in the fee ledger. Overdue invoices are subject to administrative late clearance surcharges.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-midnight uppercase mb-2">4. Disciplinary Authority</h3>
            <p>
              The Principal and Academic Disciplinary Board retain sovereign authority regarding student suspensions, academic probations, and expulsions in cases of serious moral infractions or academic malpractice.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
