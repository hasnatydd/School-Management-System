import React from 'react';
import prisma from '@/lib/prisma';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { AdmissionPageClient } from '@/components/public/AdmissionPageClient';
import { CheckCircle2 } from 'lucide-react';

export default async function AdmissionsPage() {
  const setting = await prisma.schoolSetting.findUnique({
    where: { id: 'default' },
  });

  const schoolSettings = {
    schoolName: setting?.schoolName || 'SONARGAON INTERNATIONAL SCHOOL',
    tagline: setting?.tagline || 'Building Character. Inspiring Excellence.',
    email: setting?.email || 'admissions@sonargaon.edu.bd',
    phone: setting?.phone || '+880 2 8876543',
    address: setting?.address || 'Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh',
    academicYear: setting?.academicYear || '2026-2027',
    currency: setting?.currency || '৳',
    timeZone: setting?.timeZone || 'Asia/Dhaka',
    country: setting?.country || 'Bangladesh',
  };

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar schoolSettings={schoolSettings} />

      {/* Banner */}
      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Admissions Circular AY {schoolSettings.academicYear}
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Scholar Admissions & Enrollment
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Welcoming ambitious scholars from Grade 1 through Grade 10. Review criteria, submit applications online, and track progress through our digital directorate.
          </p>
        </div>
      </section>

      {/* Admission Circulars & Criteria */}
      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-warmIvory/50 border border-steelGrey/20 space-y-3">
              <span className="text-xs font-heading font-bold text-antiqueGold uppercase tracking-wider">Criteria 01</span>
              <h3 className="font-heading font-bold text-lg text-midnight uppercase">Age & Eligibility</h3>
              <p className="text-xs text-charcoal leading-relaxed">
                Candidate must fulfill minimum age requirements as of July 1st of the intake academic year: Grade 1 (Age 6+), Grade 6 (Age 11+), Grade 9 (Age 14+).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-warmIvory/50 border border-steelGrey/20 space-y-3">
              <span className="text-xs font-heading font-bold text-antiqueGold uppercase tracking-wider">Criteria 02</span>
              <h3 className="font-heading font-bold text-lg text-midnight uppercase">Diagnostic Assessment</h3>
              <p className="text-xs text-charcoal leading-relaxed">
                Applicants undergo age-appropriate diagnostic evaluations in English Literacy, Mathematics, and General Analytical Inquiry conducted by department leads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-warmIvory/50 border border-steelGrey/20 space-y-3">
              <span className="text-xs font-heading font-bold text-antiqueGold uppercase tracking-wider">Criteria 03</span>
              <h3 className="font-heading font-bold text-lg text-midnight uppercase">Parent Interview</h3>
              <p className="text-xs text-charcoal leading-relaxed">
                A warm, collaborative consultation with the Director of Academics to align institutional expectations, mutual values, and scholar developmental goals.
              </p>
            </div>
          </div>

          {/* Interactive Online Form & Tracker Component */}
          <AdmissionPageClient schoolSettings={schoolSettings} />

          {/* Required Documents Section */}
          <div className="p-8 rounded-2xl bg-warmIvory/60 border border-steelGrey/20 space-y-4 max-w-4xl mx-auto font-sans">
            <h4 className="font-heading font-bold text-base text-midnight uppercase">
              Mandatory Documentation Checklist for In-Person Verification:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Attested Photocopy of Scholar Birth Certificate</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> 4 Copies of Recent Passport Size Photographs</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Academic Transcripts / Report Cards from Previous 2 Years</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Official Transfer Certificate (TC) from Previous School</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Parents' National ID (NID) or Passport Copies</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Scholar Immunization & Blood Group Certificate</div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter schoolSettings={schoolSettings} />
    </div>
  );
}
