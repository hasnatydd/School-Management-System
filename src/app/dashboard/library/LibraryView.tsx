'use client';

import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  Search,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';
import { issueLibraryBook, returnLibraryBook } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

export function LibraryView({
  books,
  activeLoans,
  userRole,
  userName,
  userIdentifier,
}: {
  books: any[];
  activeLoans: any[];
  userRole: string;
  userName: string;
  userIdentifier: string;
}) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'loans'>('catalog');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [issueModalBook, setIssueModalBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await issueLibraryBook(formData);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Book loan issued successfully!' });
      setIssueModalBook(null);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to issue book.' });
    }
    setLoading(false);
  };

  const handleReturn = async (loanId: string) => {
    setLoading(true);
    setStatusMessage(null);

    const res = await returnLibraryBook(loanId);
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Book returned to library inventory.' });
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to return book.' });
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
              Scholastic Library & Resource Center
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              {books.length} Titles
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Central repository of Cambridge syllabi, reference encyclopedias, literature, and periodicals.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-warmIvory/60 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-1.5 rounded-md text-xs font-heading font-bold uppercase transition ${
              activeTab === 'catalog'
                ? 'bg-midnight text-pureWhite shadow-sm'
                : 'text-charcoal hover:text-midnight'
            }`}
          >
            Book Catalog
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-1.5 rounded-md text-xs font-heading font-bold uppercase transition ${
              activeTab === 'loans'
                ? 'bg-midnight text-pureWhite shadow-sm'
                : 'text-charcoal hover:text-midnight'
            }`}
          >
            Active Circulation ({activeLoans.length})
          </button>
        </div>
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

      {activeTab === 'catalog' && (
        <>
          {/* Filters */}
          <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-9 pr-3 py-2 bg-warmIvory/60 border border-slate-200 rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-warmIvory/60 border border-slate-200 rounded-lg text-xs font-medium text-charcoal py-2 px-3 focus:outline-none focus:ring-1 focus:ring-antiqueGold"
              >
                <option value="ALL">All Disciplines</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics & STEM</option>
                <option value="Literature">World Literature</option>
                <option value="History">History & Social Studies</option>
              </select>
            </div>
          </div>

          {/* Book Catalog Table */}
          <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal">
                <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                  <tr>
                    <th className="py-3 px-4">Book Title & Author</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">ISBN</th>
                    <th className="py-3 px-4">Rack Location</th>
                    <th className="py-3 px-4">Copies In Stock</th>
                    <th className="py-3 px-4 text-right">Circulation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((b) => (
                    <tr key={b.id} className="hover:bg-warmIvory/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-heading font-bold text-midnight">{b.title}</div>
                        <div className="text-[11px] text-steelGrey">By {b.author}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-midnight text-warmGold border border-antiqueGold/30">
                          {b.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-steelGrey">{b.isbn}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-midnight">{b.rackNumber || 'Central Bay'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            b.availableCopies > 0 ? 'text-deepEmerald' : 'text-mutedRed'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              b.availableCopies > 0 ? 'bg-deepEmerald' : 'bg-mutedRed'
                            }`}
                          />
                          {b.availableCopies} of {b.totalCopies} Available
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                          <button
                            onClick={() => setIssueModalBook(b)}
                            disabled={b.availableCopies <= 0}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-[11px] uppercase tracking-wider transition disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Issue Loan</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'loans' && (
        <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Borrower Details</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Return Book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-steelGrey">
                      No active library loans currently checked out.
                    </td>
                  </tr>
                ) : (
                  activeLoans.map((loan) => {
                    const isOverdue = new Date(loan.dueDate) < new Date();
                    return (
                      <tr key={loan.id} className="hover:bg-warmIvory/40 transition">
                        <td className="py-3 px-4 font-heading font-bold text-midnight">
                          {loan.book?.title}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-charcoal">{loan.borrowerName}</div>
                          <div className="font-mono text-[10px] text-steelGrey">{loan.borrowerId}</div>
                        </td>
                        <td className="py-3 px-4 text-steelGrey">{formatDate(loan.issueDate)}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${isOverdue ? 'text-mutedRed' : 'text-charcoal'}`}>
                            {formatDate(loan.dueDate)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                              isOverdue
                                ? 'bg-mutedRed/15 text-mutedRed border border-mutedRed/30'
                                : 'bg-antiqueGold/15 text-warmGold border border-antiqueGold/30'
                            }`}
                          >
                            {isOverdue ? 'OVERDUE' : 'CHECKED OUT'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                            <button
                              onClick={() => handleReturn(loan.id)}
                              disabled={loading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-[11px] uppercase tracking-wider transition"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-warmGold" />
                              <span>Check-In</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issue Book Modal */}
      {issueModalBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                  Issue Book Circulation
                </h2>
                <p className="text-xs text-warmGold font-semibold">{issueModalBook.title}</p>
              </div>
              <button onClick={() => setIssueModalBook(null)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssue} className="mt-4 space-y-4 text-xs font-sans">
              <input type="hidden" name="bookId" value={issueModalBook.id} />

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Borrower Full Name
                </label>
                <input
                  type="text"
                  name="borrowerName"
                  required
                  placeholder="e.g. Tahmid Mahmud"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Student / Staff ID Number
                </label>
                <input
                  type="text"
                  name="borrowerId"
                  required
                  placeholder="e.g. SIS-2026-1001 or EMP-001"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Loan Duration (Days)
                </label>
                <input
                  type="number"
                  name="dueDays"
                  defaultValue="14"
                  min="1"
                  max="60"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIssueModalBook(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Processing...' : 'Confirm Loan Issue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
