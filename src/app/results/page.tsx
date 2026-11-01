'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Search, Award, Printer, AlertCircle, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { lookupPublicResult } from '@/app/actions/school-actions';

export default function PublicResultsPage() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const res = await lookupPublicResult(admissionNumber, rollNumber);
    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.error || 'No academic transcript found.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Official Scholastic Assessment Portal
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Public Term Examination Results
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            Scholars and guardians can verify official published term scores and GPA rankings using their institutional credentials. Personal data is protected in accordance with educational privacy standards.
          </p>
        </div>
      </section>

      <section className="py-16 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Search Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-warmIvory/60 border border-steelGrey/20 shadow-card space-y-5 no-print">
            <div className="flex items-center gap-2 pb-3 border-b border-steelGrey/20">
              <Lock className="w-4 h-4 text-antiqueGold" />
              <h3 className="font-heading font-bold text-base text-midnight uppercase">
                Secure Scholar Credential Verification
              </h3>
            </div>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Official Admission ID *</label>
                <input
                  type="text"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  placeholder="e.g. SIS-2026-1001"
                  required
                  className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight font-mono focus:outline-none focus:border-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Class Roll Number *</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 01"
                  required
                  className="w-full px-3.5 py-2.5 bg-pureWhite border border-steelGrey/30 rounded-lg text-midnight font-mono focus:outline-none focus:border-antiqueGold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-5 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-antiqueGold/40 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-antiqueGold" />
                  <span>{loading ? 'Verifying...' : 'Look Up Results'}</span>
                </button>
              </div>
            </form>

            <div className="text-[11px] text-steelGrey flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-deepEmerald" />
              <span>Privacy Guard: Unrestricted private contacts and residential records are strictly masked.</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-mutedRed/10 border border-mutedRed/30 text-mutedRed text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result Card Display */}
          {result && (
            <div className="space-y-6">
              <div className="flex items-center justify-end no-print">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-midnight hover:bg-deepNavy text-pureWhite text-xs font-heading font-bold uppercase rounded-lg border border-antiqueGold/40 transition"
                >
                  <Printer className="w-4 h-4 text-antiqueGold" />
                  <span>Print Result Slip (PDF)</span>
                </button>
              </div>

              {/* Printable Result Slip */}
              <div className="bg-pureWhite p-8 sm:p-12 rounded-2xl border-2 border-antiqueGold/40 shadow-elevated max-w-3xl mx-auto print:border-none print:shadow-none print:p-0">
                {/* Header */}
                <div className="text-center pb-6 border-b-2 border-midnight space-y-2">
                  <div className="inline-block p-2 rounded-xl bg-pureWhite border border-antiqueGold/40 shadow-subtle mb-1">
                    <img src="/logo.png" alt="Sonargaon Logo" className="h-14 w-auto object-contain" />
                  </div>
                  <h2 className="font-heading font-black text-xl text-midnight uppercase tracking-wider">
                    SONARGAON INTERNATIONAL SCHOOL
                  </h2>
                  <p className="text-[10px] font-heading font-bold text-antiqueGold uppercase tracking-widest">
                    Building Character. Inspiring Excellence.
                  </p>
                  <div className="inline-block px-3 py-1 bg-warmIvory border border-steelGrey/20 rounded-full text-[11px] font-heading font-bold text-midnight uppercase tracking-wider mt-2">
                    Official Term Examination Performance Summary
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 my-6 text-xs font-sans">
                  <div>
                    <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Scholar Name</span>
                    <span className="font-heading font-bold text-midnight">{result.maskedName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Admission ID</span>
                    <span className="font-mono font-bold text-midnight">{result.admissionNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Class & Section</span>
                    <span className="font-semibold text-charcoal">{result.className} - Sec {result.sectionName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-heading font-bold text-steelGrey block">Roll Number</span>
                    <span className="font-heading font-bold text-midnight">#{result.rollNumber}</span>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="overflow-hidden border border-steelGrey/20 rounded-xl my-6">
                  <table className="w-full text-left text-xs text-charcoal font-sans">
                    <thead className="bg-warmIvory text-midnight uppercase font-heading font-bold text-[11px] border-b border-steelGrey/20">
                      <tr>
                        <th className="py-3 px-4">Subject Course</th>
                        <th className="py-3 px-4 text-center">Max Marks</th>
                        <th className="py-3 px-4 text-center">Marks Obtained</th>
                        <th className="py-3 px-4 text-center">Letter Grade</th>
                        <th className="py-3 px-4 text-center">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-steelGrey/15">
                      {result.marks.map((m: any, idx: number) => (
                        <tr key={idx} className="hover:bg-warmIvory/30">
                          <td className="py-3 px-4 font-semibold text-midnight">
                            {m.subjectName}
                            <span className="text-steelGrey text-[10px] block font-mono">{m.subjectCode}</span>
                          </td>
                          <td className="py-3 px-4 text-center font-medium">{m.maxMarks}</td>
                          <td className="py-3 px-4 text-center font-bold text-midnight text-sm">{m.obtainedMarks}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-heading font-bold text-deepEmerald">{m.grade}</span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-midnight">
                            {m.gpa.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Overall Standing */}
                <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 my-6">
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase text-steelGrey block">Cumulative Grade Point Average</span>
                    <span className="text-2xl font-heading font-black text-midnight">{result.avgGPA} / 5.0</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-deepEmerald text-pureWhite font-heading font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 text-warmGold" />
                    <span>Passed With Distinction</span>
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="pt-6 border-t border-steelGrey/20 text-center text-[10px] text-steelGrey font-mono">
                  This document is an electronically authenticated result slip generated by Sonargaon International School ERP.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
