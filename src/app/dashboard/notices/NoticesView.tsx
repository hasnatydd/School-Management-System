'use client';

import React, { useState } from 'react';
import { Plus, Calendar, User, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { createAnnouncement } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  targetRole: string;
  createdAt: string;
  author: {
    name: string;
    role: string;
  };
}

export function NoticesView({
  announcements,
  userRole,
  currentUserId,
}: {
  announcements: AnnouncementItem[];
  userRole: string;
  currentUserId: string;
}) {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['ALL', 'General', 'Academic', 'Exam', 'Fee', 'Sports', 'Holiday'];

  const filtered = announcements.filter(
    (a) => selectedCat === 'ALL' || a.category.toLowerCase() === selectedCat.toLowerCase()
  );

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await createAnnouncement(formData, currentUserId);

    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg('Announcement broadcasted successfully!');
      setLoading(false);
    } else {
      setErrorMsg(res.error || 'Failed to post announcement');
      setLoading(false);
    }
  };

  const getCatBadgeColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'exam':
        return 'bg-mutedRed/10 text-mutedRed border-mutedRed/30';
      case 'fee':
        return 'bg-antiqueGold/15 text-antiqueGold border-antiqueGold/35';
      case 'academic':
        return 'bg-midnight/10 text-midnight border-midnight/25';
      case 'holiday':
        return 'bg-deepEmerald/10 text-deepEmerald border-deepEmerald/30';
      default:
        return 'bg-steelGrey/15 text-charcoal border-steelGrey/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-bold text-midnight tracking-tight">Notice Board & Circulars</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-semibold px-2.5 py-0.5 rounded-full border border-antiqueGold/30">
              Institutional Bulletins
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            School-wide updates, academic milestones, circulars, and departmental memos.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setErrorMsg('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-midnight hover:bg-deepNavy text-pureWhite text-xs font-semibold rounded-lg shadow-sm border border-antiqueGold/40 transition"
          >
            <Plus className="w-4 h-4 text-antiqueGold" />
            Post New Notice
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 bg-deepEmerald/10 border border-deepEmerald/20 text-deepEmerald text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-deepEmerald flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-midnight text-pureWhite shadow-sm'
                : 'bg-pureWhite text-steelGrey hover:text-midnight hover:bg-warmIvory/60 border border-steelGrey/20'
            }`}
          >
            {cat === 'ALL' ? 'All Bulletins' : cat}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm p-5 hover:border-antiqueGold/50 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCatBadgeColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span className="text-[11px] text-steelGrey flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-antiqueGold" />
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <h3 className="text-sm font-heading font-bold text-midnight mt-2">{item.title}</h3>
              <p className="text-xs text-charcoal mt-2 leading-relaxed whitespace-pre-line font-sans">
                {item.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-steelGrey/10 flex items-center justify-between text-[11px] text-steelGrey">
              <span className="flex items-center gap-1 text-midnight font-medium">
                <User className="w-3 h-3 text-steelGrey" />
                {item.author.name}
              </span>
              <span className="bg-warmIvory border border-steelGrey/20 px-2 py-0.5 rounded text-[10px] font-semibold text-charcoal">
                Audience: {item.targetRole}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-midnight/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-steelGrey/20">
            <div className="flex items-center justify-between pb-3 border-b border-steelGrey/15">
              <h2 className="text-base font-heading font-bold text-midnight">Broadcast Notice / Announcement</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-steelGrey hover:text-midnight p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 bg-mutedRed/10 text-mutedRed border border-mutedRed/20 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePost} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-heading font-semibold text-midnight mb-1">Notice Headline *</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Science Fair Registration Deadline"
                  className="w-full px-3 py-2 bg-warmIvory/50 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-semibold text-midnight mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 bg-warmIvory/50 border border-steelGrey/30 rounded-lg text-xs font-medium text-midnight focus:outline-none focus:border-antiqueGold"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Fee">Fee</option>
                    <option value="Sports">Sports</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block font-heading font-semibold text-midnight mb-1">Target Audience</label>
                  <select
                    name="targetRole"
                    className="w-full px-3 py-2 bg-warmIvory/50 border border-steelGrey/30 rounded-lg text-xs font-medium text-midnight focus:outline-none focus:border-antiqueGold"
                  >
                    <option value="ALL">All Portal Users</option>
                    <option value="TEACHER">Faculty & Staff Only</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="PARENT">Parents & Guardians Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-heading font-semibold text-midnight mb-1">Message Body *</label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  placeholder="Write announcement details..."
                  className="w-full px-3 py-2 bg-warmIvory/50 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
                />
              </div>

              <div className="pt-3 border-t border-steelGrey/15 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-steelGrey/25 rounded-lg text-steelGrey hover:text-midnight hover:bg-warmIvory/50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-midnight hover:bg-deepNavy text-pureWhite font-semibold rounded-lg shadow-sm border border-antiqueGold/40 transition"
                >
                  {loading ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
