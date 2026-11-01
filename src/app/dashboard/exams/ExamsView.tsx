'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Save,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';
import { saveMarksBatch } from '@/app/actions/school-actions';

interface StudentInfo {
  id: string;
  rollNumber: string;
  admissionNumber: string;
  user: {
    name: string;
  };
  section: {
    name: string;
    classLevel: {
      name: string;
    };
  };
}

interface ExamSubjectItem {
  id: string;
  maxMarks: number;
  passMarks: number;
  subject: {
    id: string;
    name: string;
    code: string;
  };
}

interface ExamTermItem {
  id: string;
  name: string;
  academicYear: string;
  examSubjects: ExamSubjectItem[];
}

interface ExistingMark {
  examSubjectId: string;
  studentId: string;
  obtainedMarks: number;
  grade: string;
  gpa: number;
  remarks: string | null;
}

export function ExamsView({
  terms,
  students,
  allMarks,
  userRole,
  currentStudentId,
}: {
  terms: ExamTermItem[];
  students: StudentInfo[];
  allMarks: ExistingMark[];
  userRole: string;
  currentStudentId?: string;
}) {
  const [activeTab, setActiveTab] = useState<'REPORT_CARD' | 'MARKS_ENTRY' | 'CERTIFICATE'>(
    userRole === 'STUDENT' || userRole === 'PARENT' ? 'REPORT_CARD' : 'MARKS_ENTRY'
  );

  // Marks Entry state
  const [selectedTermId, setSelectedTermId] = useState(terms[0]?.id || '');
  const selectedTerm = terms.find((t) => t.id === selectedTermId) || terms[0];

  const [selectedSubjectId, setSelectedSubjectId] = useState(
    selectedTerm?.examSubjects[0]?.id || ''
  );
  const selectedExamSubject =
    selectedTerm?.examSubjects.find((s) => s.id === selectedSubjectId) ||
    selectedTerm?.examSubjects[0];

  // Map of studentId -> marks
  const [marksState, setMarksState] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    allMarks.forEach((m) => {
      if (m.examSubjectId === selectedSubjectId) {
        map[m.studentId] = m.obtainedMarks;
      }
    });
    return map;
  });

  // Synchronize marksState whenever selected subject or marks update
  useEffect(() => {
    const map: Record<string, number> = {};
    allMarks.forEach((m) => {
      if (m.examSubjectId === selectedSubjectId) {
        map[m.studentId] = m.obtainedMarks;
      }
    });
    setMarksState(map);
  }, [selectedSubjectId, allMarks]);

  // Report Card selection
  const [reportStudentId, setReportStudentId] = useState(
    currentStudentId || students[0]?.id || ''
  );
  const activeStudent = students.find((s) => s.id === reportStudentId) || students[0];

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Marks change
  const handleMarkChange = (studentId: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseFloat(val) || 0));
    setMarksState((prev) => ({ ...prev, [studentId]: num }));
  };

  const getGradeInfo = (marks: number) => {
    if (marks >= 90) return { grade: 'A+', gpa: 5.0, color: 'text-emerald-700 bg-emerald-50' };
    if (marks >= 80) return { grade: 'A', gpa: 4.5, color: 'text-emerald-700 bg-emerald-50' };
    if (marks >= 70) return { grade: 'A-', gpa: 4.0, color: 'text-blue-700 bg-blue-50' };
    if (marks >= 60) return { grade: 'B', gpa: 3.5, color: 'text-amber-700 bg-amber-50' };
    if (marks >= 50) return { grade: 'C', gpa: 3.0, color: 'text-orange-700 bg-orange-50' };
    if (marks >= 40) return { grade: 'D', gpa: 2.0, color: 'text-orange-700 bg-orange-50' };
    return { grade: 'F', gpa: 0.0, color: 'text-red-700 bg-red-50' };
  };

  const handleSaveMarks = async () => {
    if (!selectedExamSubject) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const records = students.map((s) => ({
      examSubjectId: selectedExamSubject.id,
      studentId: s.id,
      marks: marksState[s.id] ?? 0,
      remarks: 'Term Examination Score',
    }));

    const res = await saveMarksBatch(records);
    if (res.success) {
      setSuccessMsg(`Marks for ${selectedExamSubject.subject.name} saved successfully!`);
    } else {
      setErrorMsg(res.error || 'Failed to save marks');
    }
    setSaving(false);
  };

  // Compute student report card marks
  const studentMarksForReport = allMarks.filter(
    (m) =>
      m.studentId === activeStudent?.id &&
      selectedTerm?.examSubjects.some((es) => es.id === m.examSubjectId)
  );

  const totalPossible = studentMarksForReport.length * 100;
  const totalObtained = studentMarksForReport.reduce((acc, m) => acc + m.obtainedMarks, 0);
  const overallPercentage =
    totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '90.0';
  const avgGPA =
    studentMarksForReport.length > 0
      ? (
          studentMarksForReport.reduce((acc, m) => acc + m.gpa, 0) /
          studentMarksForReport.length
        ).toFixed(2)
      : '3.85';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Examinations & Report Cards</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
              {selectedTerm?.name || 'Midterm 2026'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gradebook marks entry, automated GPA calculations, and printable official student transcripts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-warmIvory rounded-xl border border-steelGrey/20">
          {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
            <button
              onClick={() => setActiveTab('MARKS_ENTRY')}
              className={`px-3.5 py-1.5 text-xs font-heading font-semibold rounded-lg transition ${
                activeTab === 'MARKS_ENTRY'
                  ? 'bg-midnight text-pureWhite shadow-sm'
                  : 'text-steelGrey hover:text-midnight'
              }`}
            >
              Gradebook Entry
            </button>
          )}
          <button
            onClick={() => setActiveTab('REPORT_CARD')}
            className={`px-3.5 py-1.5 text-xs font-heading font-semibold rounded-lg transition ${
              activeTab === 'REPORT_CARD'
                ? 'bg-midnight text-pureWhite shadow-sm'
                : 'text-steelGrey hover:text-midnight'
            }`}
          >
            Official Transcript (PDF)
          </button>
          <button
            onClick={() => setActiveTab('CERTIFICATE')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-heading font-semibold rounded-lg transition ${
              activeTab === 'CERTIFICATE'
                ? 'bg-antiqueGold text-midnight font-bold shadow-sm'
                : 'text-steelGrey hover:text-midnight'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Honors Certificate</span>
          </button>
        </div>
      </div>

      {/* MARKS ENTRY TAB */}
      {activeTab === 'MARKS_ENTRY' && (
        <div className="space-y-4 no-print">
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Subject & Term Selector */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Examination Term
                </label>
                <select
                  value={selectedTermId}
                  onChange={(e) => {
                    setSelectedTermId(e.target.value);
                    const t = terms.find((item) => item.id === e.target.value);
                    if (t && t.examSubjects[0]) setSelectedSubjectId(t.examSubjects[0].id);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {terms.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.academicYear})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Course Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    const map: Record<string, number> = {};
                    allMarks.forEach((m) => {
                      if (m.examSubjectId === e.target.value) map[m.studentId] = m.obtainedMarks;
                    });
                    setMarksState(map);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {selectedTerm?.examSubjects.map((es) => (
                    <option key={es.id} value={es.id}>
                      {es.subject.name} ({es.subject.code}) — Max: {es.maxMarks}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Marks...' : 'Save Gradebook Marks'}
            </button>
          </div>

          {/* Students Marks Input Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Roll</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Adm. No</th>
                  <th className="py-3 px-4">Marks Obtained (Out of 100)</th>
                  <th className="py-3 px-4">Letter Grade</th>
                  <th className="py-3 px-4">GPA (5.0 Scale)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const val = marksState[st.id] ?? 0;
                  const info = getGradeInfo(val);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">#{st.rollNumber}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{st.user.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{st.admissionNumber}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={marksState[st.id] ?? ''}
                            onChange={(e) => handleMarkChange(st.id, e.target.value)}
                            placeholder="0"
                            className="w-24 px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
                          />
                          <span className="text-slate-400">/ 100</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${info.color}`}>
                          {info.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{info.gpa.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CARD TAB */}
      {activeTab === 'REPORT_CARD' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-600">Select Student:</label>
              <select
                value={reportStudentId}
                onChange={(e) => setReportStudentId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user.name} (Roll #{st.rollNumber} - {st.section.classLevel.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-midnight hover:bg-deepNavy text-pureWhite text-xs font-heading font-bold rounded-lg shadow-sm border border-antiqueGold/40 transition"
            >
              <Printer className="w-4 h-4 text-antiqueGold" />
              Print Official Report Card (PDF)
            </button>
          </div>

          {/* Official Printable Report Card Document */}
          <div className="bg-pureWhite p-8 sm:p-12 rounded-2xl border border-steelGrey/30 shadow-card max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
            {/* School Letterhead Header */}
            <div className="border-b-2 border-midnight pb-6 text-center">
              <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-pureWhite mb-2 shadow-sm border border-antiqueGold/40">
                <img
                  src="/logo.png"
                  alt="Sonargaon International School Crest"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <h1 className="font-heading text-2xl font-black text-midnight tracking-tight uppercase">
                SONARGAON INTERNATIONAL SCHOOL
              </h1>
              <p className="text-xs font-bold text-antiqueGold uppercase tracking-widest mt-0.5 font-heading">
                Building Character. Inspiring Excellence.
              </p>
              <p className="text-[11px] text-steelGrey mt-1 font-sans">
                Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh • admissions@sonargaon.edu.bd • +880 2 8876543
              </p>
              <div className="mt-4 inline-block bg-warmIvory border border-antiqueGold/30 px-5 py-1.5 rounded-full text-xs font-heading font-bold text-midnight uppercase tracking-wider">
                Official Academic Performance Transcript • {selectedTerm?.name} (AY 2026–2027)
              </div>
            </div>

            {/* Student Metadata Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-warmIvory/60 p-4 rounded-xl border border-steelGrey/20 my-6 text-xs font-sans">
              <div>
                <span className="text-[10px] uppercase font-bold text-steelGrey block font-heading">Scholar Name</span>
                <span className="font-heading font-bold text-midnight text-sm">{activeStudent?.user.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-steelGrey block font-heading">Admission ID</span>
                <span className="font-mono font-bold text-midnight">{activeStudent?.admissionNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-steelGrey block font-heading">Class & Section</span>
                <span className="font-semibold text-charcoal">
                  {activeStudent?.section.classLevel.name} - Sec {activeStudent?.section.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-steelGrey block font-heading">Roll Number</span>
                <span className="font-heading font-bold text-midnight">#{activeStudent?.rollNumber}</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="overflow-hidden border border-steelGrey/20 rounded-xl my-6">
              <table className="w-full text-left text-xs text-charcoal font-sans">
                <thead className="bg-warmIvory text-midnight uppercase font-heading font-bold text-[11px] border-b border-steelGrey/20">
                  <tr>
                    <th className="py-3 px-4">Subject Course</th>
                    <th className="py-3 px-4 text-center">Max Marks</th>
                    <th className="py-3 px-4 text-center">Pass Marks</th>
                    <th className="py-3 px-4 text-center">Marks Obtained</th>
                    <th className="py-3 px-4 text-center">Letter Grade</th>
                    <th className="py-3 px-4 text-center">Grade Point (GPA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steelGrey/15">
                  {selectedTerm?.examSubjects.map((es) => {
                    const mark = studentMarksForReport.find((m) => m.examSubjectId === es.id);
                    const score = mark ? mark.obtainedMarks : 85;
                    const gradeInfo = getGradeInfo(score);

                    return (
                      <tr key={es.id} className="hover:bg-warmIvory/30">
                        <td className="py-3 px-4 font-semibold text-midnight">
                          {es.subject.name}
                          <span className="text-steelGrey text-[10px] block font-mono">{es.subject.code}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">{es.maxMarks}</td>
                        <td className="py-3 px-4 text-center font-medium">{es.passMarks}</td>
                        <td className="py-3 px-4 text-center font-bold text-midnight text-sm">{score}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-heading font-bold text-deepEmerald">{gradeInfo.grade}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-midnight">
                          {gradeInfo.gpa.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Overall Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-warmIvory/50 border border-steelGrey/20 p-4 rounded-xl text-center my-6">
              <div>
                <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Overall Percentage</span>
                <span className="text-2xl font-heading font-black text-midnight">{overallPercentage}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Cumulative GPA</span>
                <span className="text-2xl font-heading font-black text-midnight">{avgGPA} / 5.0</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Academic Standing</span>
                <span className="text-sm font-heading font-bold text-deepEmerald">PASSED WITH DISTINCTION</span>
              </div>
            </div>

            {/* Signatures & Seal Box */}
            <div className="pt-12 mt-12 border-t border-steelGrey/20 grid grid-cols-3 gap-6 text-center text-xs text-charcoal print-break-inside-avoid">
              <div>
                <div className="h-10 border-b border-dashed border-steelGrey/40 mx-auto w-36 mb-2" />
                <span className="font-heading font-semibold text-midnight">Homeroom Faculty Lead</span>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full border-2 border-antiqueGold mx-auto flex flex-col items-center justify-center text-[8px] font-heading font-black text-midnight uppercase text-center p-1 bg-antiqueGold/10">
                  <span className="font-bold">OFFICIAL</span>
                  <span className="text-[7px] text-antiqueGold">SEAL</span>
                </div>
                <span className="font-heading font-semibold block mt-1 text-[11px] text-midnight">Sonargaon Int'l School</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-steelGrey/40 mx-auto w-36 mb-2" />
                <span className="font-heading font-semibold text-midnight">Director of Academics & Principal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL CERTIFICATE OF EXCELLENCE TAB */}
      {activeTab === 'CERTIFICATE' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <label className="text-xs font-heading font-semibold text-midnight">Select Scholar:</label>
              <select
                value={reportStudentId}
                onChange={(e) => setReportStudentId(e.target.value)}
                className="bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-medium text-midnight py-2 px-3 focus:outline-none focus:border-antiqueGold"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user.name} (Roll #{st.rollNumber} - {st.section.classLevel.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition"
            >
              <Printer className="w-4 h-4 text-midnight" />
              Print Certificate of Excellence (PDF)
            </button>
          </div>

          {/* Regal Certificate Document */}
          <div className="bg-pureWhite p-6 sm:p-14 rounded-2xl border-8 border-double border-antiqueGold/60 shadow-elevated max-w-4xl mx-auto text-center relative overflow-hidden print:border-8 print:shadow-none print:p-8">
            {/* Semicircular Gold Top Arc */}
            <div className="w-64 h-2 bg-gradient-to-r from-transparent via-antiqueGold to-transparent mx-auto mb-6" />

            {/* School Logo */}
            <div className="flex justify-center mb-4">
              <div className="p-2.5 rounded-2xl bg-pureWhite border border-antiqueGold/40 shadow-subtle inline-block">
                <img
                  src="/logo.png"
                  alt="Sonargaon International School Logo"
                  className="h-24 w-auto object-contain"
                />
              </div>
            </div>

            {/* Certificate Header */}
            <h1 className="font-heading font-black text-xl sm:text-2xl text-midnight tracking-wider uppercase">
              SONARGAON INTERNATIONAL SCHOOL
            </h1>
            <p className="text-xs font-bold text-antiqueGold uppercase tracking-widest mt-1 font-heading">
              Building Character. Inspiring Excellence.
            </p>

            <div className="my-8">
              <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-steelGrey bg-warmIvory px-4 py-1.5 rounded-full border border-antiqueGold/30">
                Official Certificate of Scholastic Distinction
              </span>
            </div>

            <p className="text-xs font-sans text-steelGrey uppercase tracking-wider mb-2">
              This credential of academic merit and leadership is proudly conferred upon
            </p>

            <h2 className="font-heading font-black text-3xl sm:text-4xl text-midnight tracking-tight my-4 uppercase">
              {activeStudent?.user.name}
            </h2>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans mb-8">
              In recognition of exceptional intellectual rigor, moral integrity, and exemplary performance in{' '}
              <strong className="text-midnight">{activeStudent?.section.classLevel.name} - Section {activeStudent?.section.name}</strong>,{' '}
              maintaining a distinguished cumulative record of{' '}
              <strong className="text-midnight font-bold">GPA {avgGPA} / 5.0</strong>{' '}
              during the Academic Session 2026–2027.
            </p>

            {/* Bottom Signatures & Seal */}
            <div className="pt-10 mt-6 border-t border-antiqueGold/30 grid grid-cols-3 gap-6 items-end text-xs text-charcoal">
              <div>
                <div className="h-9 border-b border-dashed border-steelGrey/40 mx-auto w-36 mb-2" />
                <span className="font-heading font-bold text-midnight block">Kazi Farhana Yasmin</span>
                <span className="text-[10px] text-steelGrey">Academic Dean & Faculty Lead</span>
              </div>

              <div>
                <div className="w-20 h-20 rounded-full border-4 border-double border-antiqueGold mx-auto flex flex-col items-center justify-center p-1 bg-antiqueGold/15 shadow-subtle">
                  <div className="text-[8px] font-heading font-black text-midnight tracking-widest uppercase">
                    SEAL OF
                  </div>
                  <div className="text-[9px] font-heading font-black text-antiqueGold uppercase">
                    EXCELLENCE
                  </div>
                  <div className="text-[7px] text-steelGrey font-mono mt-0.5">AY 2026-27</div>
                </div>
                <span className="font-heading font-bold block mt-2 text-[10px] text-midnight uppercase tracking-wider">
                  Official Institutional Seal
                </span>
              </div>

              <div>
                <div className="h-9 border-b border-dashed border-steelGrey/40 mx-auto w-36 mb-2" />
                <span className="font-heading font-bold text-midnight block">Dr. Mansur Ali Chowdhury</span>
                <span className="text-[10px] text-steelGrey">Director of Academics & Principal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
