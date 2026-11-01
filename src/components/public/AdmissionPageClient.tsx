'use client';

import React, { useState } from 'react';
import {
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { submitAdmissionInquiry, trackAdmissionApplication } from '@/app/actions/school-actions';

interface AdmissionPageClientProps {
  schoolSettings: {
    schoolName: string;
    tagline: string;
    academicYear: string;
    email: string;
    phone: string;
  };
}

export function AdmissionPageClient({ schoolSettings }: AdmissionPageClientProps) {
  const [activeTab, setActiveTab] = useState<'FORM' | 'TRACKER'>('FORM');

  // Application submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedAppNum, setGeneratedAppNum] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Application tracking states
  const [trackQuery, setTrackQuery] = useState('');
  const [tracking, setTracking] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await submitAdmissionInquiry(formData);

    if (res.success) {
      setSubmitSuccess(true);
      setGeneratedAppNum(res.applicationNumber || '');
      (e.target as HTMLFormElement).reset();
    } else {
      setSubmitError(res.error || 'Failed to register application. Please check required details.');
    }
    setSubmitting(false);
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTracking(true);
    setTrackError('');
    setTrackResult(null);

    const res = await trackAdmissionApplication(trackQuery);
    if (res.success) {
      setTrackResult(res.data);
    } else {
      setTrackError(res.error || 'No matching application found.');
    }
    setTracking(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-deepEmerald/15 text-deepEmerald border-deepEmerald/30';
      case 'REVIEWED':
        return 'bg-antiqueGold/15 text-antiqueGold border-antiqueGold/30';
      case 'REJECTED':
        return 'bg-mutedRed/15 text-mutedRed border-mutedRed/30';
      case 'ENROLLED':
        return 'bg-midnight text-pureWhite border-antiqueGold/40';
      default:
        return 'bg-steelGrey/15 text-charcoal border-steelGrey/30';
    }
  };

  return (
    <div className="space-y-12">
      {/* Switcher Bar */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-xl bg-warmIvory border border-steelGrey/20">
          <button
            onClick={() => setActiveTab('FORM')}
            className={`px-5 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition ${
              activeTab === 'FORM'
                ? 'bg-midnight text-pureWhite shadow-sm'
                : 'text-steelGrey hover:text-midnight'
            }`}
          >
            Online Application Form
          </button>
          <button
            onClick={() => setActiveTab('TRACKER')}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition ${
              activeTab === 'TRACKER'
                ? 'bg-antiqueGold text-midnight font-black shadow-sm'
                : 'text-steelGrey hover:text-midnight'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Application Status</span>
          </button>
        </div>
      </div>

      {/* TAB 1: APPLICATION FORM */}
      {activeTab === 'FORM' && (
        <div className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-card p-6 sm:p-10 max-w-4xl mx-auto">
          {submitSuccess ? (
            <div className="p-8 sm:p-12 text-center space-y-4 bg-deepEmerald/10 border border-deepEmerald/30 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-deepEmerald text-pureWhite mx-auto flex items-center justify-center shadow-subtle">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-heading text-2xl font-black text-midnight uppercase">
                Application Successfully Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-charcoal max-w-lg mx-auto font-sans leading-relaxed">
                Thank you for applying to Sonargaon International School for Academic Session {schoolSettings.academicYear}. Your application has been assigned an official reference number and routed to our Academic Directorate.
              </p>
              {generatedAppNum && (
                <div className="p-4 bg-pureWhite rounded-xl border-2 border-antiqueGold/60 shadow-sm inline-block">
                  <span className="text-[10px] font-heading font-bold uppercase text-steelGrey block">Your Application Tracking ID</span>
                  <span className="font-mono text-xl font-black text-midnight">{generatedAppNum}</span>
                </div>
              )}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setTrackQuery(generatedAppNum);
                    setActiveTab('TRACKER');
                  }}
                  className="px-5 py-2.5 bg-midnight text-pureWhite font-heading font-bold text-xs uppercase rounded-lg hover:bg-deepNavy transition shadow-sm"
                >
                  Track Application Now &rarr;
                </button>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 bg-warmIvory text-charcoal border border-steelGrey/30 font-heading font-semibold text-xs rounded-lg hover:bg-slate-200 transition"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6 font-sans">
              <div className="pb-4 border-b border-steelGrey/20 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-xl text-midnight uppercase">
                    Official Scholar Admission Application
                  </h3>
                  <p className="text-xs text-steelGrey mt-0.5">
                    Please provide complete and accurate information for prompt admissions processing.
                  </p>
                </div>
                <span className="text-[10px] font-heading font-bold uppercase bg-warmIvory border border-steelGrey/20 px-2.5 py-1 rounded text-midnight">
                  Grades 1 through 10
                </span>
              </div>

              {submitError && (
                <div className="p-3.5 bg-mutedRed/10 border border-mutedRed/30 text-mutedRed text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Scholar Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-antiqueGold">
                  1. Scholar Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Full Scholar Name *</label>
                    <input
                      name="studentName"
                      required
                      placeholder="e.g. Farhan Chowdhury"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Applying for Grade Tier *</label>
                    <select
                      name="gradeApplying"
                      required
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight font-medium focus:outline-none focus:border-antiqueGold"
                    >
                      <option value="Grade 1">Grade 1 (Age 6+)</option>
                      <option value="Grade 2">Grade 2 (Age 7+)</option>
                      <option value="Grade 3">Grade 3 (Age 8+)</option>
                      <option value="Grade 4">Grade 4 (Age 9+)</option>
                      <option value="Grade 5">Grade 5 (Age 10+)</option>
                      <option value="Grade 6">Grade 6 (Age 11+)</option>
                      <option value="Grade 7">Grade 7 (Age 12+)</option>
                      <option value="Grade 8">Grade 8 (Age 13+)</option>
                      <option value="Grade 9">Grade 9 (Cambridge Senior O-Level)</option>
                      <option value="Grade 10">Grade 10 (Cambridge Senior O-Level)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Date of Birth</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Gender</label>
                    <select
                      name="gender"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight font-medium focus:outline-none focus:border-antiqueGold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4 pt-4 border-t border-steelGrey/20">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-antiqueGold">
                  2. Parent & Guardian Contacts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Parent / Guardian Name *</label>
                    <input
                      name="parentName"
                      required
                      placeholder="e.g. Dr. Tanvir Chowdhury"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Contact Phone *</label>
                    <input
                      name="parentPhone"
                      required
                      placeholder="+880 1711 000000"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Parent Email</label>
                    <input
                      name="parentEmail"
                      type="email"
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>
                </div>
              </div>

              {/* Academic History & Documents */}
              <div className="space-y-4 pt-4 border-t border-steelGrey/20">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-antiqueGold">
                  3. Previous School & Documentation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Previous School Attended</label>
                    <input
                      name="previousSchool"
                      placeholder="e.g. Scholastica / Mastermind"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Residential Address (Area / Sector)</label>
                    <input
                      name="address"
                      placeholder="e.g. Sector 3, Uttara / Banani, Dhaka"
                      className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight focus:outline-none focus:border-antiqueGold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1 text-xs">
                    Submitted Documents Checklist (Digital Verification)
                  </label>
                  <input
                    name="documents"
                    defaultValue="Birth Certificate, 2 Recent Passport Photos, Prior Grade Report Card"
                    className="w-full px-3.5 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-midnight text-xs focus:outline-none focus:border-antiqueGold"
                  />
                  <span className="text-[11px] text-steelGrey mt-1 block">
                    Original physical credentials will be inspected during the in-person diagnostic assessment.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-steelGrey/20 flex items-center justify-between">
                <p className="text-[11px] text-steelGrey">
                  All admissions inquiries are recorded in our secure institutional database.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm border border-antiqueGold/40 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-antiqueGold" />
                  <span>{submitting ? 'Registering...' : 'Submit Application Form'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: APPLICATION TRACKER */}
      {activeTab === 'TRACKER' && (
        <div className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-card p-6 sm:p-10 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-heading font-extrabold text-2xl text-midnight uppercase">
              Track Your Admission Application
            </h3>
            <p className="text-xs text-steelGrey max-w-md mx-auto">
              Enter your Application Reference Number (e.g., <strong className="text-midnight">SIS-ADM-2026-101</strong>) or registered Contact Phone number.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="e.g. SIS-ADM-2026-101 or +880 1711 000000"
              required
              className="flex-1 px-4 py-2.5 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs font-mono text-midnight focus:outline-none focus:border-antiqueGold"
            />
            <button
              type="submit"
              disabled={tracking}
              className="px-6 py-2.5 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider rounded-lg border border-antiqueGold/40 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-antiqueGold" />
              <span>{tracking ? 'Checking...' : 'Track'}</span>
            </button>
          </form>

          {trackError && (
            <div className="p-4 bg-mutedRed/10 border border-mutedRed/30 text-mutedRed text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {trackResult && (
            <div className="p-6 rounded-xl bg-warmIvory/50 border border-steelGrey/20 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-steelGrey/20">
                <div>
                  <span className="text-[10px] font-heading font-bold text-steelGrey uppercase block">Tracking Reference</span>
                  <span className="font-mono font-bold text-midnight text-sm">{trackResult.applicationNumber}</span>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-heading font-bold uppercase border ${getStatusBadge(trackResult.status)}`}>
                    {trackResult.status === 'PENDING' ? 'Submitted (Under Review)' : trackResult.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-steelGrey font-medium block">Applicant Name:</span>
                  <strong className="text-midnight font-heading">{trackResult.studentName}</strong>
                </div>
                <div>
                  <span className="text-steelGrey font-medium block">Grade Level:</span>
                  <strong className="text-midnight font-heading">{trackResult.gradeApplying}</strong>
                </div>
                <div>
                  <span className="text-steelGrey font-medium block">Parent/Guardian:</span>
                  <strong className="text-midnight">{trackResult.parentName}</strong>
                </div>
                <div>
                  <span className="text-steelGrey font-medium block">Submitted On:</span>
                  <span className="text-charcoal font-mono text-[11px]">{new Date(trackResult.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-4 border-t border-steelGrey/20 space-y-2">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey block">
                  Application Lifecycle Progress:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-heading font-bold">
                  <div className="p-2 rounded bg-deepEmerald text-pureWhite">1. Submitted</div>
                  <div className={`p-2 rounded ${trackResult.status !== 'PENDING' ? 'bg-deepEmerald text-pureWhite' : 'bg-warmIvory border border-steelGrey/30 text-steelGrey'}`}>
                    2. Reviewed
                  </div>
                  <div className={`p-2 rounded ${trackResult.status === 'APPROVED' || trackResult.status === 'ENROLLED' ? 'bg-deepEmerald text-pureWhite' : trackResult.status === 'REJECTED' ? 'bg-mutedRed text-pureWhite' : 'bg-warmIvory border border-steelGrey/30 text-steelGrey'}`}>
                    3. Decision
                  </div>
                  <div className={`p-2 rounded ${trackResult.status === 'ENROLLED' ? 'bg-midnight text-pureWhite' : 'bg-warmIvory border border-steelGrey/30 text-steelGrey'}`}>
                    4. Enrolled
                  </div>
                </div>
              </div>

              <div className="p-3 bg-pureWhite rounded-lg border border-steelGrey/20 text-xs">
                <span className="font-heading font-bold text-midnight block text-[11px]">Directorate Notes:</span>
                <p className="text-steelGrey mt-0.5 font-sans leading-relaxed">{trackResult.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
