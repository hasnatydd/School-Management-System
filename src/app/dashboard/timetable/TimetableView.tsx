'use client';

import React, { useState } from 'react';
import { Printer, Filter } from 'lucide-react';

interface TimetableSlotItem {
  id: string;
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: {
    name: string;
    code: string;
  };
  teacher: {
    user: {
      name: string;
    };
  };
  section: {
    id: string;
    name: string;
    classLevel: {
      name: string;
    };
  };
}

interface SectionOption {
  id: string;
  name: string;
  classLevel: {
    name: string;
  };
}

export function TimetableView({
  slots,
  sections,
}: {
  slots: TimetableSlotItem[];
  sections: SectionOption[];
  userRole?: string;
}) {
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || '');

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];
  const periods = [1, 2, 3, 4, 5];

  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const sectionSlots = slots.filter((sl) => sl.section.id === selectedSectionId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-midnight tracking-tight">Class Routine & Timetable</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-semibold px-2.5 py-0.5 rounded-full border border-antiqueGold/30">
              Sunday – Thursday Routine
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Weekly instructional schedule, period hours, and faculty subject assignments.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-midnight hover:bg-deepNavy text-pureWhite text-xs font-semibold rounded-lg shadow-sm border border-antiqueGold/40 transition"
        >
          <Printer className="w-4 h-4 text-antiqueGold" />
          Print Timetable
        </button>
      </div>

      {/* Filter by Section */}
      <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-steelGrey" />
          <label className="text-xs font-heading font-semibold text-midnight">Display Section:</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-medium text-midnight py-2 px-3 focus:outline-none focus:border-antiqueGold"
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.classLevel.name} - Section {sec.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-steelGrey hidden sm:block">
          Class Hours: <strong className="text-midnight font-heading">08:30 AM — 01:50 PM</strong> (Sun–Thu)
        </div>
      </div>

      {/* Timetable Grid View */}
      <div className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-sm p-6 print:border-none print:shadow-none print:p-0">
        <div className="mb-4 text-center pb-3 border-b border-steelGrey/15">
          <h2 className="text-base font-heading font-bold text-midnight">
            {currentSection?.classLevel.name} — Section {currentSection?.name} Schedule
          </h2>
          <p className="text-xs text-steelGrey mt-0.5 font-sans">
            SONARGAON INTERNATIONAL SCHOOL • AY 2026–2027 (Asia/Dhaka)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-warmIvory text-midnight uppercase font-heading font-bold text-[11px] border border-steelGrey/20">
                <th className="py-3 px-3 w-28 border-r border-steelGrey/20">Day / Period</th>
                {periods.map((p) => (
                  <th key={p} className="py-3 px-3 text-center border-r border-steelGrey/20 last:border-r-0">
                    <div>Period {p}</div>
                    <div className="text-[10px] text-steelGrey font-mono font-normal">
                      {p === 1 && '08:30 - 09:20'}
                      {p === 2 && '09:25 - 10:15'}
                      {p === 3 && '10:30 - 11:20'}
                      {p === 4 && '11:25 - 12:15'}
                      {p === 5 && '01:00 - 01:50'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-steelGrey/15 border border-steelGrey/20">
              {days.map((day) => (
                <tr key={day} className="hover:bg-warmIvory/30">
                  <td className="py-3 px-3 font-heading font-bold text-midnight bg-warmIvory/50 border-r border-steelGrey/20">
                    {day}
                  </td>
                  {periods.map((p) => {
                    const slot = sectionSlots.find(
                      (s) => s.dayOfWeek === day && s.periodNumber === p
                    );

                    return (
                      <td
                        key={p}
                        className="p-2 border-r border-steelGrey/20 last:border-r-0 text-center align-top min-w-[130px]"
                      >
                        {slot ? (
                          <div className="p-2.5 rounded-lg bg-deepNavy/5 border border-deepNavy/10 text-left hover:border-antiqueGold/40 transition">
                            <span className="font-heading font-bold text-midnight block text-xs">
                              {slot.subject.name}
                            </span>
                            <span className="text-[10px] text-antiqueGold font-medium block mt-0.5">
                              {slot.teacher.user.name}
                            </span>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-warmIvory/40 text-steelGrey text-[11px] italic">
                            Free Period
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
