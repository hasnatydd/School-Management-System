'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  FileSpreadsheet,
  Receipt,
  Users,
  CheckCircle2,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ReportsView({
  markRecords,
  invoices,
  attendanceRecords,
  stats,
}: {
  markRecords: any[];
  invoices: any[];
  attendanceRecords: any[];
  stats: {
    studentCount: number;
    teacherCount: number;
    classCount: number;
    inquiryCount: number;
  };
  userRole: string;
}) {
  const [activeTab, setActiveTab] = useState<'academic' | 'finance' | 'attendance' | 'admin'>('academic');

  // Academic computations
  const totalMarksCount = markRecords.length;
  const passedCount = markRecords.filter((m) => m.grade !== 'F').length;
  const passRate = totalMarksCount > 0 ? ((passedCount / totalMarksCount) * 100).toFixed(1) : '100.0';
  const gpaSum = markRecords.reduce((acc, curr) => acc + curr.gpa, 0);
  const avgGPA = totalMarksCount > 0 ? (gpaSum / totalMarksCount).toFixed(2) : '5.00';

  // Financial computations
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const recoveryRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

  // Attendance computations
  const totalAtt = attendanceRecords.length;
  const presentAtt = attendanceRecords.filter((a) => a.status === 'PRESENT').length;
  const attRate = totalAtt > 0 ? ((presentAtt / totalAtt) * 100).toFixed(1) : '94.2';

  const handleExportCSV = (filename: string, rows: string[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAcademicCSV = () => {
    const headers = ['Student Name', 'Admission No', 'Class', 'Subject', 'Obtained Marks', 'Max Marks', 'Grade', 'GPA'];
    const rows = [
      headers,
      ...markRecords.map((m) => [
        m.student?.user?.name || '',
        m.student?.admissionNumber || '',
        m.student?.section?.classLevel?.name || '',
        m.examSubject?.subject?.name || '',
        String(m.obtainedMarks),
        String(m.examSubject?.maxMarks || 100),
        m.grade,
        String(m.gpa),
      ]),
    ];
    handleExportCSV('Sonargaon_Academic_Report', rows);
  };

  const exportFinanceCSV = () => {
    const headers = ['Invoice No', 'Student Name', 'Admission No', 'Class', 'Total', 'Paid', 'Balance', 'Status', 'Due Date'];
    const rows = [
      headers,
      ...invoices.map((inv) => [
        inv.invoiceNumber,
        inv.student?.user?.name || '',
        inv.student?.admissionNumber || '',
        inv.student?.section?.classLevel?.name || '',
        String(inv.totalAmount),
        String(inv.paidAmount),
        String(inv.totalAmount - inv.paidAmount),
        inv.status,
        formatDate(inv.dueDate),
      ]),
    ];
    handleExportCSV('Sonargaon_Financial_Report', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-black text-midnight tracking-tight uppercase">
              Institutional Reports & Scholastic Analytics
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              Session 2026–2027
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Data-backed metrics for academic performance, finance reconciliation, and attendance compliance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-warmIvory/60 p-1 border border-slate-200">
          {[
            { id: 'academic', label: 'Academic' },
            { id: 'finance', label: 'Financial' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'admin', label: 'Executive Stats' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-heading font-bold uppercase transition ${
                activeTab === t.id
                  ? 'bg-midnight text-pureWhite shadow-sm'
                  : 'text-charcoal hover:text-midnight'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm">
          <div className="flex items-center justify-between text-steelGrey text-xs font-heading font-bold uppercase">
            <span>Average Scholastic GPA</span>
            <TrendingUp className="w-4 h-4 text-warmGold" />
          </div>
          <div className="text-2xl font-heading font-black text-midnight mt-2">{avgGPA} / 5.00</div>
          <div className="text-[11px] text-deepEmerald font-semibold mt-1">Pass Rate: {passRate}%</div>
        </div>

        <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm">
          <div className="flex items-center justify-between text-steelGrey text-xs font-heading font-bold uppercase">
            <span>Fee Recovery Rate</span>
            <Receipt className="w-4 h-4 text-warmGold" />
          </div>
          <div className="text-2xl font-heading font-black text-midnight mt-2">{recoveryRate}%</div>
          <div className="text-[11px] text-steelGrey mt-1">Collected: {formatCurrency(totalCollected)}</div>
        </div>

        <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm">
          <div className="flex items-center justify-between text-steelGrey text-xs font-heading font-bold uppercase">
            <span>Outstanding Balance</span>
            <Percent className="w-4 h-4 text-mutedRed" />
          </div>
          <div className="text-2xl font-heading font-black text-mutedRed mt-2">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[11px] text-steelGrey mt-1">Total Due across Grades</div>
        </div>

        <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm">
          <div className="flex items-center justify-between text-steelGrey text-xs font-heading font-bold uppercase">
            <span>Attendance Average</span>
            <CheckCircle2 className="w-4 h-4 text-deepEmerald" />
          </div>
          <div className="text-2xl font-heading font-black text-deepEmerald mt-2">{attRate}%</div>
          <div className="text-[11px] text-steelGrey mt-1">85% Mandatory Compliance</div>
        </div>
      </div>

      {/* Tab 1: Academic Tab */}
      {activeTab === 'academic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-midnight uppercase tracking-wider">
              Cambridge & National Standard Marks Tabulation
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={exportAcademicCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warmIvory hover:bg-slate-200 text-midnight border border-slate-300 font-heading font-bold text-xs uppercase transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase transition"
              >
                <Printer className="w-3.5 h-3.5 text-warmGold" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal">
                <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4 text-right">Score</th>
                    <th className="py-3 px-4 text-right">Letter Grade</th>
                    <th className="py-3 px-4 text-right">GPA Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {markRecords.map((m) => (
                    <tr key={m.id} className="hover:bg-warmIvory/40 transition">
                      <td className="py-3 px-4 font-heading font-bold text-midnight">
                        {m.student?.user?.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-steelGrey">{m.student?.admissionNumber}</td>
                      <td className="py-3 px-4 font-semibold">{m.student?.section?.classLevel?.name}</td>
                      <td className="py-3 px-4">{m.examSubject?.subject?.name}</td>
                      <td className="py-3 px-4 text-steelGrey">{m.examSubject?.examTerm?.name}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-midnight">
                        {m.obtainedMarks} / {m.examSubject?.maxMarks || 100}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold ${
                            m.grade === 'A+'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.grade === 'A'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {m.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-midnight">
                        {m.gpa.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Financial Tab */}
      {activeTab === 'finance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-midnight uppercase tracking-wider">
              Tuition & Fee Collection Ledger
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={exportFinanceCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warmIvory hover:bg-slate-200 text-midnight border border-slate-300 font-heading font-bold text-xs uppercase transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase transition"
              >
                <Printer className="w-3.5 h-3.5 text-warmGold" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal">
                <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                  <tr>
                    <th className="py-3 px-4">Invoice No</th>
                    <th className="py-3 px-4">Student & Roll</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Fee Description</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-right">Paid</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-warmIvory/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-antiqueGold">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-midnight">{inv.student?.user?.name}</div>
                        <div className="text-[10px] text-steelGrey">{inv.student?.admissionNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{inv.student?.section?.classLevel?.name}</td>
                      <td className="py-3 px-4 text-charcoal">{inv.title}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-midnight">
                        {formatCurrency(inv.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-deepEmerald">
                        {formatCurrency(inv.paidAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-mutedRed">
                        {formatCurrency(inv.totalAmount - inv.paidAmount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                            inv.status === 'PAID'
                              ? 'bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30'
                              : 'bg-mutedRed/15 text-mutedRed border border-mutedRed/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm p-6 space-y-4">
          <h2 className="font-heading font-bold text-sm text-midnight uppercase tracking-wider">
            Daily Roll-Call & Compliance Log
          </h2>
          <p className="text-xs text-steelGrey">
            85% attendance compliance is strictly mandated for Cambridge O-Level exam registrations.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceRecords.slice(0, 15).map((att) => (
                  <tr key={att.id} className="hover:bg-warmIvory/40 transition">
                    <td className="py-3 px-4 font-mono text-steelGrey">{formatDate(att.date)}</td>
                    <td className="py-3 px-4 font-heading font-bold text-midnight">{att.student?.user?.name}</td>
                    <td className="py-3 px-4 font-semibold">{att.section?.classLevel?.name} - {att.section?.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                          att.status === 'PRESENT'
                            ? 'bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30'
                            : 'bg-mutedRed/15 text-mutedRed border border-mutedRed/30'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-steelGrey">{att.remarks || 'Standard Roll-Call'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Executive Stats */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-midnight uppercase tracking-wider">
              Institutional Headcount Overview
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-warmIvory/60 border border-slate-200">
                <span className="text-charcoal font-semibold">Total Enrolled Scholars (Grades 1–10)</span>
                <strong className="font-heading text-midnight text-base">{stats.studentCount}</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-warmIvory/60 border border-slate-200">
                <span className="text-charcoal font-semibold">Cambridge Accredited Faculty</span>
                <strong className="font-heading text-midnight text-base">{stats.teacherCount}</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-warmIvory/60 border border-slate-200">
                <span className="text-charcoal font-semibold">Active Grade Levels</span>
                <strong className="font-heading text-midnight text-base">{stats.classCount}</strong>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-warmIvory/60 border border-slate-200">
                <span className="text-charcoal font-semibold">Prospective Admission Applications</span>
                <strong className="font-heading text-midnight text-base">{stats.inquiryCount}</strong>
              </div>
            </div>
          </div>

          <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-midnight uppercase tracking-wider">
              Accreditation & Curriculum Standard
            </h3>
            <p className="text-xs text-charcoal leading-relaxed">
              Sonargaon International School operates under rigorous Cambridge International Examination benchmarks (Assessment International Education) supplemented by Bangladesh National Curriculum fundamentals.
            </p>
            <div className="p-4 rounded-xl bg-midnight text-pureWhite border border-antiqueGold/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Institutional Time Zone:</span>
                <strong className="text-warmGold">Asia/Dhaka</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Instructional Days:</span>
                <strong className="text-warmGold">Sunday through Thursday</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
