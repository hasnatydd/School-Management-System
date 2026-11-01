'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Save,
  CheckCheck,
  AlertCircle,
} from 'lucide-react';
import { saveAttendanceBatch } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

interface StudentData {
  id: string;
  rollNumber: string;
  admissionNumber: string;
  user: {
    name: string;
  };
}

interface SectionOption {
  id: string;
  name: string;
  classLevel: {
    name: string;
  };
  students: StudentData[];
}

interface AttendanceLogItem {
  id: string;
  date: string;
  status: string;
  remarks: string | null;
  student: {
    user: {
      name: string;
    };
  };
  section: {
    name: string;
    classLevel: {
      name: string;
    };
  };
}

export function AttendanceView({
  sections,
  initialSectionId,
  existingRecords,
  userRole,
  studentHistory,
}: {
  sections: SectionOption[];
  initialSectionId: string;
  existingRecords: Record<string, { status: string; remarks?: string }>;
  userRole: string;
  studentHistory?: AttendanceLogItem[];
}) {
  const [selectedSectionId, setSelectedSectionId] = useState(initialSectionId || (sections[0]?.id || ''));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusMap, setStatusMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    const currentSec = sections.find((s) => s.id === (initialSectionId || sections[0]?.id));
    if (currentSec) {
      currentSec.students.forEach((st) => {
        map[st.id] = existingRecords[st.id]?.status || 'PRESENT';
      });
    }
    return map;
  });
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    const currentSec = sections.find((s) => s.id === (initialSectionId || sections[0]?.id));
    if (currentSec) {
      currentSec.students.forEach((st) => {
        map[st.id] = existingRecords[st.id]?.remarks || '';
      });
    }
    return map;
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentSection = sections.find((s) => s.id === selectedSectionId);

  // If role is Student or Parent, render personal history view
  if (userRole === 'STUDENT' || userRole === 'PARENT') {
    const history = studentHistory || [];
    const total = history.length;
    const present = history.filter((h) => h.status === 'PRESENT').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;

    return (
      <div className="space-y-6">
        <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-midnight tracking-tight">Attendance Record</h1>
            <p className="text-xs text-steelGrey mt-1">
              Official roll-call presence logs and attendance compliance.
            </p>
          </div>
          <div className="bg-deepEmerald/10 border border-deepEmerald/20 px-5 py-2.5 rounded-xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-deepEmerald">Attendance Rate</span>
            <div className="text-2xl font-heading font-bold text-deepEmerald">{rate}%</div>
          </div>
        </div>

        <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-warmIvory text-midnight uppercase font-heading font-semibold text-[11px] border-b border-steelGrey/20">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steelGrey/10">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-steelGrey">No attendance records found yet.</td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-warmIvory/50 transition">
                      <td className="py-3.5 px-4 font-semibold text-midnight">{formatDate(item.date)}</td>
                      <td className="py-3.5 px-4 font-medium">{item.student.user.name}</td>
                      <td className="py-3.5 px-4 text-steelGrey">
                        {item.section.classLevel.name} - Sec {item.section.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.status === 'PRESENT'
                              ? 'bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/25'
                              : item.status === 'ABSENT'
                              ? 'bg-mutedRed/15 text-mutedRed border border-mutedRed/25'
                              : item.status === 'LATE'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-steelGrey/15 text-steelGrey border border-steelGrey/25'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-steelGrey">{item.remarks || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Admin & Teacher Roll-Call Sheet
  const handleMarkAll = (status: string) => {
    if (!currentSection) return;
    const updated: Record<string, string> = {};
    currentSection.students.forEach((st) => {
      updated[st.id] = status;
    });
    setStatusMap(updated);
  };

  const handleSave = async () => {
    if (!currentSection) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const records = currentSection.students.map((st) => ({
      studentId: st.id,
      sectionId: currentSection.id,
      date: selectedDate,
      status: statusMap[st.id] || 'PRESENT',
      remarks: remarksMap[st.id] || '',
    }));

    const res = await saveAttendanceBatch(records);
    if (res.success) {
      setSuccessMsg('Attendance for ' + currentSection.classLevel.name + ' - Sec ' + currentSection.name + ' saved successfully!');
    } else {
      setErrorMsg(res.error || 'Failed to record attendance');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-midnight tracking-tight">Daily Roll-Call Attendance</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-semibold px-2.5 py-0.5 rounded-full border border-antiqueGold/30">
              Interactive Sheet
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Mark daily classroom attendance, log tardiness, and track authorized leaves.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || !currentSection}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-midnight hover:bg-deepNavy disabled:opacity-50 text-pureWhite text-xs font-semibold rounded-lg shadow-sm border border-antiqueGold/40 transition"
        >
          <Save className="w-4 h-4 text-antiqueGold" />
          {loading ? 'Saving...' : 'Save Attendance Sheet'}
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-deepEmerald/10 border border-deepEmerald/20 text-deepEmerald text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-deepEmerald flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-mutedRed/10 border border-mutedRed/20 text-mutedRed text-xs rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-mutedRed flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Control Bar: Section & Date Selection */}
      <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[10px] font-bold uppercase text-steelGrey mb-1 font-heading">Select Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => {
                setSelectedSectionId(e.target.value);
                setSuccessMsg('');
              }}
              className="bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-medium text-midnight py-2 px-3 focus:outline-none focus:border-antiqueGold"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.classLevel.name} - Section {sec.name} ({sec.students.length} students)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-steelGrey mb-1 font-heading">Attendance Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-medium text-midnight py-2 px-3 focus:outline-none focus:border-antiqueGold"
              />
            </div>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleMarkAll('PRESENT')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-deepEmerald/10 hover:bg-deepEmerald/20 text-deepEmerald text-xs font-semibold rounded-lg border border-deepEmerald/30 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('ABSENT')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mutedRed/10 hover:bg-mutedRed/20 text-mutedRed text-xs font-semibold rounded-lg border border-mutedRed/30 transition"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Roll-Call Sheet Table */}
      <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-warmIvory text-midnight uppercase font-heading font-semibold text-[11px] border-b border-steelGrey/20">
              <tr>
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Adm. ID</th>
                <th className="py-3.5 px-4">Attendance Status</th>
                <th className="py-3.5 px-4">Remarks / Excuse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steelGrey/10">
              {!currentSection || currentSection.students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-steelGrey">
                    No students enrolled in this section.
                  </td>
                </tr>
              ) : (
                currentSection.students.map((st) => {
                  const currentStatus = statusMap[st.id] || 'PRESENT';

                  return (
                    <tr key={st.id} className="hover:bg-warmIvory/40 transition">
                      <td className="py-3.5 px-4 font-bold text-midnight">#{st.rollNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-midnight">{st.user.name}</td>
                      <td className="py-3.5 px-4 font-mono text-steelGrey">{st.admissionNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="inline-flex rounded-lg border border-steelGrey/20 p-0.5 bg-warmIvory/60 gap-0.5">
                          {[
                            { value: 'PRESENT', label: 'Present', active: 'bg-deepEmerald text-pureWhite shadow-sm' },
                            { value: 'ABSENT', label: 'Absent', active: 'bg-mutedRed text-pureWhite shadow-sm' },
                            { value: 'LATE', label: 'Late', active: 'bg-amber-600 text-pureWhite shadow-sm' },
                            { value: 'EXCUSED', label: 'Excused', active: 'bg-steelGrey text-pureWhite shadow-sm' },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setStatusMap({ ...statusMap, [st.id]: opt.value })}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                                currentStatus === opt.value
                                  ? opt.active
                                  : 'text-steelGrey hover:text-midnight'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={remarksMap[st.id] || ''}
                          onChange={(e) => setRemarksMap({ ...remarksMap, [st.id]: e.target.value })}
                          placeholder="Add note..."
                          className="w-full max-w-xs px-2.5 py-1.5 text-xs bg-warmIvory/50 border border-steelGrey/30 rounded-md focus:outline-none focus:border-antiqueGold text-midnight"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
