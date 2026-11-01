'use client';

import React from 'react';
import { UserSquare2 } from 'lucide-react';

interface ClassItem {
  id: string;
  name: string;
  code: string;
  order: number;
  sections: Array<{
    id: string;
    name: string;
    classTeacher: {
      user: {
        name: string;
      };
    } | null;
    students: Array<{
      id: string;
    }>;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    code: string;
  }>;
}

export function ClassesView({
  classes,
}: {
  classes: ClassItem[];
  userRole?: string;
}) {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-midnight tracking-tight">Academic Grade Levels & Sections</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-heading font-bold px-2.5 py-0.5 rounded border border-antiqueGold/30">
              {classes.length} Grade Levels (Grades 1–10)
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-0.5 font-sans">
            K-10 grade hierarchy, Cambridge section allocations, homeroom faculty mentors, and course syllabi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => {
          const totalStudents = cls.sections.reduce((acc, sec) => acc + sec.students.length, 0);

          return (
            <div
              key={cls.id}
              className="bg-pureWhite rounded-xl border border-slate-200 shadow-card p-5 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-midnight text-warmGold font-heading font-bold flex items-center justify-center text-xs shadow-subtle">
                    {cls.code}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-midnight">{cls.name}</h3>
                    <span className="text-[11px] text-steelGrey font-mono">Academic Tier: Level #{cls.order}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-heading text-xs font-bold text-midnight">{totalStudents}</span>
                  <span className="text-[11px] text-steelGrey block font-sans">Enrolled Scholars</span>
                </div>
              </div>

              {/* Sections list */}
              <div className="mt-4">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey block mb-2">
                  Sections & Homeroom Faculty Mentors
                </span>
                <div className="space-y-2">
                  {cls.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-3 bg-warmIvory/60 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded bg-pureWhite font-heading font-bold text-midnight flex items-center justify-center border border-slate-300 text-xs">
                          {sec.name}
                        </span>
                        <div>
                          <div className="font-heading font-bold text-midnight">Section {sec.name}</div>
                          <div className="text-[11px] text-steelGrey flex items-center gap-1 font-sans">
                            <UserSquare2 className="w-3 h-3 text-antiqueGold" />
                            {sec.classTeacher ? sec.classTeacher.user.name : 'No Mentor Assigned'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-heading font-semibold text-charcoal bg-pureWhite px-2 py-0.5 rounded border border-slate-200">
                        {sec.students.length} scholars
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjects in this Grade */}
              <div className="mt-4 pt-3 border-t border-slate-100 font-sans">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey block mb-1.5">
                  Curriculum Subjects ({cls.subjects.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cls.subjects.map((sub) => (
                    <span
                      key={sub.id}
                      className="text-[10px] font-medium bg-warmIvory text-charcoal px-2 py-0.5 rounded border border-slate-200"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {cls.subjects.length === 0 && (
                    <span className="text-[10px] text-steelGrey italic">Syllabus structured per academic session</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
