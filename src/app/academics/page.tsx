import React from 'react';
import prisma from '@/lib/prisma';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Clock, Calendar, CheckCircle2, Award } from 'lucide-react';

export default async function AcademicsPage() {
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

      {/* Header Banner */}
      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Cambridge & National Academic Standard
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Academic Programs & Curriculum
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            A continuous, rigorous educational continuum from Grade 1 through Grade 10 designed to spark inquiry, mathematical fluency, and moral fortitude.
          </p>
        </div>
      </section>

      {/* Overview & Wings */}
      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
              Curricular Architecture
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-midnight uppercase tracking-tight">
              Three Distinct Developmental Wings
            </h2>
            <p className="text-sm text-charcoal leading-relaxed font-sans">
              Our academic structure is compartmentalized into three purposeful developmental phases, ensuring age-appropriate cognitive challenge, psychological support, and subject specialization.
            </p>
          </div>

          {/* Primary Wing */}
          <div id="primary" className="p-8 rounded-2xl bg-warmIvory/50 border border-steelGrey/20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-steelGrey/20">
              <div>
                <span className="text-xs font-heading font-bold uppercase text-antiqueGold tracking-wider">Foundation Tier</span>
                <h3 className="font-heading text-2xl font-bold text-midnight uppercase">Primary Wing (Grades 1–5)</h3>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-deepNavy text-warmGold font-heading text-xs font-bold uppercase">
                Ages 6 to 10 Years
              </div>
            </div>
            <p className="text-sm text-charcoal leading-relaxed">
              Focuses on bilingual literacy in English and Bangla, Singapore mathematics logic, nature study, conversational skills, and art. Small classes enable teachers to identify individual learning paces and cultivate respectful peer collaboration.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-midnight font-heading font-semibold">
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> English Phonics</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Primary Maths</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> General Science</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Bangla Bhasha</div>
            </div>
          </div>

          {/* Junior Secondary Wing */}
          <div id="junior" className="p-8 rounded-2xl bg-warmIvory/50 border border-steelGrey/20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-steelGrey/20">
              <div>
                <span className="text-xs font-heading font-bold uppercase text-antiqueGold tracking-wider">Intermediate Tier</span>
                <h3 className="font-heading text-2xl font-bold text-midnight uppercase">Junior Secondary (Grades 6–8)</h3>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-deepNavy text-warmGold font-heading text-xs font-bold uppercase">
                Ages 11 to 13 Years
              </div>
            </div>
            <p className="text-sm text-charcoal leading-relaxed">
              Disciplinary division into pure physics, chemistry, biology, advanced algebra, geometry, world geography, and computer algorithms. Scholars begin conducting structured experiments in dedicated laboratories.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-midnight font-heading font-semibold">
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Physics Lab</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Chemistry Lab</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Pre-Algebra</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> ICT & Coding</div>
            </div>
          </div>

          {/* Senior Secondary Wing */}
          <div id="secondary" className="p-8 rounded-2xl bg-warmIvory/50 border border-steelGrey/20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-steelGrey/20">
              <div>
                <span className="text-xs font-heading font-bold uppercase text-antiqueGold tracking-wider">Senior Tier</span>
                <h3 className="font-heading text-2xl font-bold text-midnight uppercase">Senior Secondary (Grades 9–10)</h3>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-deepNavy text-warmGold font-heading text-xs font-bold uppercase">
                Ages 14 to 16 Years
              </div>
            </div>
            <p className="text-sm text-charcoal leading-relaxed">
              Rigorous preparation for Cambridge IGCSE and National Board examinations. Scholars choose between Science, Business Studies, and Humanities streams with full diagnostic examinations, university counseling, and academic dissertation projects.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-midnight font-heading font-semibold">
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Additional Maths</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Pure Physics 5054</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Economics & Acct</div>
              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-deepEmerald" /> Bangladesh Studies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Routine, Calendar & Examination System */}
      <section id="calendar" className="py-16 bg-warmIvory/60 border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* School Routine */}
            <div className="p-6 rounded-2xl bg-pureWhite border border-steelGrey/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-midnight">
                <Clock className="w-5 h-5 text-antiqueGold" />
                <h3 className="font-heading font-bold text-lg uppercase">Daily School Routine</h3>
              </div>
              <p className="text-xs text-steelGrey">Instructional schedule (Sunday to Thursday):</p>
              <div className="space-y-2 text-xs divide-y divide-steelGrey/10">
                <div className="pt-1.5 flex justify-between font-mono"><span>08:15 AM</span> <strong className="text-midnight">Assembly & Flag</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>08:30 – 09:20 AM</span> <strong className="text-midnight">Period 1</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>09:25 – 10:15 AM</span> <strong className="text-midnight">Period 2</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>10:15 – 10:30 AM</span> <strong className="text-antiqueGold">Morning Break</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>10:30 – 11:20 AM</span> <strong className="text-midnight">Period 3</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>11:25 – 12:15 PM</span> <strong className="text-midnight">Period 4</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>12:15 – 01:00 PM</span> <strong className="text-antiqueGold">Tiffin & Sports</strong></div>
                <div className="pt-1.5 flex justify-between font-mono"><span>01:00 – 01:50 PM</span> <strong className="text-midnight">Period 5 & Dispersal</strong></div>
              </div>
            </div>

            {/* Academic Calendar */}
            <div className="p-6 rounded-2xl bg-pureWhite border border-steelGrey/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-midnight">
                <Calendar className="w-5 h-5 text-antiqueGold" />
                <h3 className="font-heading font-bold text-lg uppercase">Academic Terms</h3>
              </div>
              <p className="text-xs text-steelGrey">Session {schoolSettings.academicYear} Milestones:</p>
              <div className="space-y-2 text-xs divide-y divide-steelGrey/10">
                <div className="pt-1.5">
                  <span className="font-heading font-bold text-midnight block">Term 1 (Autumn):</span>
                  <span className="text-steelGrey text-[11px]">July 1 – November 15, 2026</span>
                </div>
                <div className="pt-1.5">
                  <span className="font-heading font-bold text-midnight block">Midterm Examinations:</span>
                  <span className="text-steelGrey text-[11px]">October 18 – October 28, 2026</span>
                </div>
                <div className="pt-1.5">
                  <span className="font-heading font-bold text-midnight block">Term 2 (Spring):</span>
                  <span className="text-steelGrey text-[11px]">January 5 – May 25, 2027</span>
                </div>
                <div className="pt-1.5">
                  <span className="font-heading font-bold text-midnight block">Final Annual Examinations:</span>
                  <span className="text-steelGrey text-[11px]">May 10 – May 24, 2027</span>
                </div>
              </div>
            </div>

            {/* Grading Scale */}
            <div className="p-6 rounded-2xl bg-pureWhite border border-steelGrey/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-midnight">
                <Award className="w-5 h-5 text-antiqueGold" />
                <h3 className="font-heading font-bold text-lg uppercase">GPA 5.0 Grading Scale</h3>
              </div>
              <p className="text-xs text-steelGrey">Official grading boundaries:</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 bg-warmIvory/60 px-2 rounded font-mono"><span>90 – 100%</span> <strong className="text-deepEmerald font-bold">A+ (GPA 5.0)</strong></div>
                <div className="flex justify-between py-1 px-2 font-mono"><span>80 – 89%</span> <strong className="text-deepEmerald font-bold">A (GPA 4.5)</strong></div>
                <div className="flex justify-between py-1 bg-warmIvory/60 px-2 rounded font-mono"><span>70 – 79%</span> <strong className="text-midnight font-bold">A- (GPA 4.0)</strong></div>
                <div className="flex justify-between py-1 px-2 font-mono"><span>60 – 69%</span> <strong className="text-charcoal font-bold">B (GPA 3.5)</strong></div>
                <div className="flex justify-between py-1 bg-warmIvory/60 px-2 rounded font-mono"><span>50 – 59%</span> <strong className="text-charcoal font-bold">C (GPA 3.0)</strong></div>
                <div className="flex justify-between py-1 px-2 font-mono"><span>40 – 49%</span> <strong className="text-charcoal font-bold">D (GPA 2.0)</strong></div>
                <div className="flex justify-between py-1 bg-red-50 text-mutedRed px-2 rounded font-mono"><span>&lt; 40%</span> <strong>F (GPA 0.0)</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter schoolSettings={schoolSettings} />
    </div>
  );
}
