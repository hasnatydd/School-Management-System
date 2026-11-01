'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Plus,
  Search,
  BookOpen,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Video,
} from 'lucide-react';
import { createLearningMaterial } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

export function MaterialsView({
  materials,
  subjects,
  sections,
  userRole,
  userName,
}: {
  materials: any[];
  subjects: any[];
  sections: any[];
  userRole: string;
  userName: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = materials.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.chapter && m.chapter.toLowerCase().includes(search.toLowerCase())) ||
      m.subject.name.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === 'ALL' || m.subjectId === selectedSubject;
    return matchSearch && matchSubject;
  });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await createLearningMaterial(formData, userName);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Learning resource uploaded successfully!' });
      setUploadModalOpen(false);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to upload material.' });
    }
    setLoading(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'CODE':
        return <FileCode className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-antiqueGold" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-black text-midnight tracking-tight uppercase">
              Curricular Study Materials & Resources
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              {materials.length} Documents
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Cambridge syllabus guides, laboratory manuals, formula sheets, and chapter lecture slides.
          </p>
        </div>

        {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resource</span>
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

      {/* Filter and Search */}
      <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, chapter, or subject..."
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

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-pureWhite p-12 rounded-2xl border border-steelGrey/20 text-center text-steelGrey">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-heading font-bold text-sm text-midnight">No Study Materials Found</p>
            <p className="text-xs text-steelGrey mt-0.5">Change search filters or upload a new resource.</p>
          </div>
        ) : (
          filtered.map((mat) => (
            <div
              key={mat.id}
              className="bg-pureWhite rounded-2xl border border-steelGrey/20 shadow-sm p-5 flex flex-col justify-between hover:border-antiqueGold/50 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-warmIvory border border-steelGrey/20">
                      {getFileIcon(mat.fileType)}
                    </div>
                    <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded bg-midnight text-warmGold border border-antiqueGold/30">
                      {mat.subject?.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    {mat.fileType}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm text-midnight group-hover:text-antiqueGold transition leading-snug">
                    {mat.title}
                  </h3>
                  {mat.chapter && (
                    <div className="text-[11px] font-semibold text-antiqueGold mt-0.5">
                      {mat.chapter}
                    </div>
                  )}
                </div>

                <p className="text-xs text-charcoal/80 line-clamp-2 font-sans leading-relaxed">
                  {mat.description || 'Institutional syllabus resource.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-steelGrey">
                  <span>Uploaded by: {mat.uploadedBy}</span>
                  <span>{formatDate(mat.createdAt)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="w-full py-2 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
                >
                  <Download className="w-3.5 h-3.5 text-warmGold" />
                  <span>Download Resource</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                Upload Curricular Material
              </h2>
              <button onClick={() => setUploadModalOpen(false)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Cambridge O-Level Physics Lab Practical Guide"
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
                    File Type
                  </label>
                  <select
                    name="fileType"
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOC">Word / Notes (.docx)</option>
                    <option value="VIDEO">Recorded Lecture / Video</option>
                    <option value="LINK">External Academic Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Chapter / Unit Classification
                </label>
                <input
                  type="text"
                  name="chapter"
                  placeholder="e.g. Unit 3: Kinematics & Vectors"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  File Path or Download Link
                </label>
                <input
                  type="text"
                  name="fileUrl"
                  required
                  placeholder="e.g. /materials/physics-lab-guide.pdf"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Brief Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Summary of syllabus topics covered in this document..."
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Uploading...' : 'Upload Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
