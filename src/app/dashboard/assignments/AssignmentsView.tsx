'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  User,
  X,
  Award,
} from 'lucide-react';
import { createAssignment, submitAssignment, gradeAssignmentSubmission } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

export function AssignmentsView({
  assignments,
  subjects,
  sections,
  userRole,
  studentProfileId,
  teacherProfileId,
}: {
  assignments: any[];
  subjects: any[];
  sections: any[];
  userRole: string;
  userId: string;
  studentProfileId: string | null;
  teacherProfileId: string | null;
  userName: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitModalAssignment, setSubmitModalAssignment] = useState<any | null>(null);
  const [gradingModalAssignment, setGradingModalAssignment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = assignments.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === 'ALL' || a.subjectId === selectedSubject;
    return matchSearch && matchSubject;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await createAssignment(formData, teacherProfileId || '');

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Assignment created successfully!' });
      setCreateModalOpen(false);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to create assignment.' });
    }
    setLoading(false);
  };

  const handleSubmitWork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentProfileId) return;
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitAssignment(formData, studentProfileId);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Work submitted successfully!' });
      setSubmitModalAssignment(null);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Submission failed.' });
    }
    setLoading(false);
  };

  const handleGrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await gradeAssignmentSubmission(formData);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Grading and feedback recorded!' });
      setGradingModalAssignment(null);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Grading failed.' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-black text-midnight tracking-tight uppercase">
              Homework & Learning Management System
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              {assignments.length} Total
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Cambridge curricula coursework, laboratory reports, continuous assessments, and grading.
          </p>
        </div>

        {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-sans flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-deepEmerald/10 text-deepEmerald border border-deepEmerald/30'
              : 'bg-mutedRed/10 text-mutedRed border border-mutedRed/30'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by assignment title or subject..."
            className="w-full pl-9 pr-3 py-2 bg-warmIvory/60 border border-slate-200 rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-warmIvory/60 border border-slate-200 rounded-lg text-xs font-medium text-charcoal py-2 px-3 focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-pureWhite p-12 rounded-2xl border border-steelGrey/20 text-center text-steelGrey">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-heading font-bold text-sm text-midnight">No Assignments Found</p>
            <p className="text-xs text-steelGrey mt-0.5">Check back later or change filter criteria.</p>
          </div>
        ) : (
          filtered.map((asg) => {
            const mySubmission =
              userRole === 'STUDENT'
                ? asg.submissions?.find((s: any) => s.studentId === studentProfileId)
                : null;
            const isDueSoon = new Date(asg.dueDate) > new Date() && new Date(asg.dueDate).getTime() - Date.now() < 3 * 24 * 3600 * 1000;

            return (
              <div
                key={asg.id}
                className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-sm p-5 flex flex-col justify-between hover:border-antiqueGold/50 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-heading font-extrabold px-2.5 py-0.5 rounded bg-midnight text-warmGold border border-antiqueGold/30">
                      {asg.subject?.name}
                    </span>
                    <span className="text-[10px] font-heading font-semibold text-slate-500">
                      {asg.section?.classLevel?.name} - {asg.section?.name}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-midnight group-hover:text-antiqueGold transition leading-snug">
                    {asg.title}
                  </h3>

                  <p className="text-xs text-charcoal/80 line-clamp-3 font-sans leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-steelGrey">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${isDueSoon ? 'text-mutedRed' : 'text-antiqueGold'}`} />
                      <span>Due: {formatDate(asg.dueDate)}</span>
                    </div>
                    <div className="font-heading font-bold text-midnight">
                      Max: {asg.totalMarks} pts
                    </div>
                  </div>

                  {/* Submission Status for Students */}
                  {userRole === 'STUDENT' && (
                    <div className="pt-2">
                      {mySubmission ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              {mySubmission.status === 'GRADED' ? 'Graded' : 'Submitted'}
                            </span>
                            {mySubmission.marks !== null && (
                              <span className="text-emerald-800 font-heading font-black">
                                {mySubmission.marks} / {asg.totalMarks}
                              </span>
                            )}
                          </div>
                          {mySubmission.feedback && (
                            <div className="text-[10px] text-emerald-700 italic">
                              "{mySubmission.feedback}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Submission</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submissions count for Teacher/Admin */}
                  {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
                    <div className="pt-2 text-[11px] text-steelGrey flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-antiqueGold" />
                        Submissions: {asg.submissions?.length || 0}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        By {asg.teacher?.user?.name || 'Faculty'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  {userRole === 'STUDENT' ? (
                    <button
                      onClick={() => setSubmitModalAssignment(asg)}
                      className="w-full py-2 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider transition text-center"
                    >
                      {mySubmission ? 'Update Submission' : 'Submit Work'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setGradingModalAssignment(asg)}
                      className="w-full py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider transition text-center flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Review Submissions ({asg.submissions?.length || 0})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Assignment Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                Create New Coursework Assignment
              </h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Chapter 4: Quadratic Curves & Optimization"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Subject
                  </label>
                  <select
                    name="subjectId"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Target Section
                  </label>
                  <select
                    name="sectionId"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  >
                    <option value="">Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.classLevel?.name} - {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Maximum Points
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    defaultValue="50"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Coursework Instructions & Guidelines
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Detail the problems, experimental methodology, and formatting guidelines..."
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Attachment Filename or Resource Link (Optional)
                </label>
                <input
                  type="text"
                  name="attachments"
                  placeholder="e.g. MTH4024-Worksheet.pdf"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Publishing...' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Submit Modal */}
      {submitModalAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                  Submit Assignment Work
                </h2>
                <p className="text-xs text-warmGold font-semibold">{submitModalAssignment.title}</p>
              </div>
              <button onClick={() => setSubmitModalAssignment(null)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="mt-4 space-y-4 text-xs font-sans">
              <input type="hidden" name="assignmentId" value={submitModalAssignment.id} />

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Student Solution / Written Summary
                </label>
                <textarea
                  name="textAnswer"
                  rows={4}
                  required
                  placeholder="Type your workings, answers, or commentary here..."
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Document / PDF Attachment Filename
                </label>
                <input
                  type="text"
                  name="fileUrl"
                  placeholder="e.g. Tahmid-M-Assignment-Submission.pdf"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalAssignment(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Grade Submissions Modal */}
      {gradingModalAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                  Review & Grade Submissions
                </h2>
                <p className="text-xs text-warmGold font-semibold">
                  {gradingModalAssignment.title} (Max: {gradingModalAssignment.totalMarks} pts)
                </p>
              </div>
              <button onClick={() => setGradingModalAssignment(null)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {gradingModalAssignment.submissions?.length === 0 ? (
                <p className="text-center py-8 text-xs text-steelGrey">No student submissions recorded yet.</p>
              ) : (
                gradingModalAssignment.submissions?.map((sub: any) => (
                  <div key={sub.id} className="p-4 rounded-xl bg-warmIvory/60 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-bold text-xs text-midnight">
                        {sub.student?.user?.name || 'Student'} ({sub.student?.admissionNumber})
                      </div>
                      <span className="text-[10px] text-steelGrey">
                        Submitted: {formatDate(sub.submittedAt)}
                      </span>
                    </div>

                    <div className="text-xs text-charcoal bg-pureWhite p-3 rounded-lg border border-slate-100">
                      {sub.textAnswer || 'No written comment.'}
                      {sub.fileUrl && (
                        <div className="mt-2 text-[11px] font-mono text-antiqueGold">
                          Attachment: {sub.fileUrl}
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleGrade} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-2">
                      <input type="hidden" name="submissionId" value={sub.id} />
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-heading font-bold uppercase text-charcoal mb-0.5">
                          Score (Max {gradingModalAssignment.totalMarks})
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          name="marks"
                          defaultValue={sub.marks || ''}
                          required
                          className="w-full p-2 bg-pureWhite border border-slate-300 rounded text-xs text-charcoal"
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-heading font-bold uppercase text-charcoal mb-0.5">
                          Feedback / Remarks
                        </label>
                        <input
                          type="text"
                          name="feedback"
                          defaultValue={sub.feedback || ''}
                          placeholder="e.g. Excellent solution structure"
                          className="w-full p-2 bg-pureWhite border border-slate-300 rounded text-xs text-charcoal"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2 rounded bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider transition"
                        >
                          {loading ? 'Saving...' : 'Save Grade'}
                        </button>
                      </div>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
