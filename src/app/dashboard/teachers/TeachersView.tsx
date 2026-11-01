'use client';

import React, { useState } from 'react';
import { Search, Mail, Phone, Award } from 'lucide-react';

interface TeacherItem {
  id: string;
  employeeId: string;
  designation: string | null;
  qualification: string | null;
  specialization: string | null;
  salary: number | null;
  user: {
    name: string;
    email: string | null;
    identifier: string;
    phone: string | null;
    avatar?: string | null;
  };
  classTeacherOf: {
    name: string;
    classLevel: {
      name: string;
    };
  } | null;
  assignedSubjects: Array<{
    id: string;
    subject: {
      name: string;
      code: string;
    };
    section: {
      name: string;
      classLevel: {
        code: string;
      };
    };
  }>;
}

export function TeachersView({
  teachers,
}: {
  teachers: TeacherItem[];
  userRole?: string;
}) {
  const [search, setSearch] = useState('');

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.user.name.toLowerCase().includes(q) ||
      t.employeeId.toLowerCase().includes(q) ||
      (t.designation && t.designation.toLowerCase().includes(q)) ||
      (t.specialization && t.specialization.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-midnight tracking-tight">Faculty & Academic Directorate</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-heading font-bold px-2.5 py-0.5 rounded border border-antiqueGold/30">
              {teachers.length} Faculty Leads
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-0.5 font-sans">
            Cambridge accredited department heads, homeroom mentors, and advanced laboratory instructors.
          </p>
        </div>
      </div>

      <div className="bg-pureWhite p-4 rounded-xl border border-slate-200 shadow-card flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, qualification, or department..."
            className="w-full pl-9 pr-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold focus:bg-pureWhite transition font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-pureWhite rounded-xl border border-slate-200 shadow-card p-5 hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-midnight text-warmGold font-heading font-bold flex items-center justify-center text-sm shadow-subtle overflow-hidden flex-shrink-0 border border-antiqueGold/30">
                    {t.user.avatar ? (
                      <img src={t.user.avatar} alt={t.user.name} className="w-full h-full object-cover" />
                    ) : (
                      t.user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-midnight">{t.user.name}</h3>
                    <div className="text-[11px] text-antiqueGold font-medium font-sans">{t.designation}</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-warmIvory text-charcoal px-2 py-0.5 rounded border border-slate-200 font-bold">
                  {t.employeeId}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-charcoal/80 bg-warmIvory/60 p-3 rounded-lg border border-slate-200 font-sans">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-antiqueGold flex-shrink-0" />
                  <span className="truncate">{t.qualification || 'Certified Faculty'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-steelGrey flex-shrink-0" />
                  <span className="truncate text-charcoal font-mono">{t.user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-steelGrey flex-shrink-0" />
                  <span className="font-mono">{t.user.phone || 'N/A'}</span>
                </div>
              </div>

              {t.classTeacherOf && (
                <div className="mt-3 p-2.5 rounded-lg bg-deepEmerald/10 border border-deepEmerald/20 text-deepEmerald text-[11px] font-heading font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-deepEmerald" />
                  Homeroom Mentor: {t.classTeacherOf.classLevel.name} - Section {t.classTeacherOf.name}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 font-sans">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey block mb-1.5">
                Assigned Curricular Courses
              </span>
              <div className="flex flex-wrap gap-1">
                {t.assignedSubjects.length > 0 ? (
                  t.assignedSubjects.map((as) => (
                    <span
                      key={as.id}
                      className="text-[10px] font-medium bg-warmIvory text-charcoal px-2 py-0.5 rounded border border-slate-200"
                    >
                      {as.subject.name} ({as.section.classLevel.code}-{as.section.name})
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-steelGrey italic">No active subject courses</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
