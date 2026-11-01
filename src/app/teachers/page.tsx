import React from 'react';
import prisma from '@/lib/prisma';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Mail, Award, BookOpen, GraduationCap } from 'lucide-react';

export default async function TeachersPublicPage() {
  const [teachers, setting] = await Promise.all([
    prisma.teacherProfile.findMany({
      include: {
        user: true,
        classTeacherOf: { include: { classLevel: true } },
        assignedSubjects: { include: { subject: true } },
      },
    }),
    prisma.schoolSetting.findUnique({ where: { id: 'default' } }),
  ]);

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
            Academic Directorate & Faculty
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Our Distinguished Faculty
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Cambridge-accredited subject matter leads, experienced department heads, and compassionate homeroom mentors guiding scholars toward academic mastery.
          </p>
        </div>
      </section>

      {/* Faculty Directory */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 overflow-hidden shadow-sm hover:border-antiqueGold/60 transition duration-300 flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-midnight text-warmGold border-2 border-antiqueGold/60 overflow-hidden shadow-subtle flex-shrink-0">
                      {t.user.avatar ? (
                        <img
                          src={t.user.avatar}
                          alt={t.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-heading font-bold text-xl">
                          {t.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-midnight">{t.user.name}</h3>
                      <div className="text-xs font-heading font-semibold text-antiqueGold mt-0.5">
                        {t.designation || 'Senior Faculty'}
                      </div>
                      <span className="text-[10px] text-steelGrey font-mono block">
                        Code: {t.employeeId}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-charcoal font-sans pt-2 border-t border-steelGrey/15">
                    <div>
                      <span className="text-steelGrey font-medium block">Qualifications:</span>
                      <strong className="text-midnight">{t.qualification || 'M.Sc., Cambridge Certified'}</strong>
                    </div>
                    <div>
                      <span className="text-steelGrey font-medium block">Specialization:</span>
                      <span>{t.specialization || 'Pure Mathematics & Sciences'}</span>
                    </div>
                    {t.classTeacherOf && (
                      <div className="inline-block px-2.5 py-1 rounded bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30 font-heading text-[10px] font-bold">
                        Homeroom Mentor: {t.classTeacherOf.classLevel.name} - Sec {t.classTeacherOf.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-warmIvory border-t border-steelGrey/15 text-[11px] text-steelGrey flex items-center justify-between font-mono">
                  <span>{t.user.email || 'faculty@sonargaon.edu.bd'}</span>
                  <span className="text-antiqueGold font-bold">Sonargaon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter schoolSettings={schoolSettings} />
    </div>
  );
}
