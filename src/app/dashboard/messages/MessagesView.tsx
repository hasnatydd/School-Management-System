'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, X } from 'lucide-react';
import { updateContactMessageStatus } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export function MessagesView({ messages }: { messages: ContactMessageItem[] }) {
  const [filter, setFilter] = useState('ALL');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = messages.filter(
    (m) => filter === 'ALL' || m.status.toLowerCase() === filter.toLowerCase()
  );

  const handleUpdateStatus = async (status: string) => {
    if (!selectedMessage) return;
    setLoading(true);
    setSuccessMsg('');

    const res = await updateContactMessageStatus(selectedMessage.id, status, adminNotes);
    if (res.success) {
      setSuccessMsg(`Inquiry marked as ${status}`);
      setSelectedMessage({ ...selectedMessage, status, notes: adminNotes });
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESPONDED':
        return 'bg-deepEmerald/15 text-deepEmerald border-deepEmerald/30';
      case 'READ':
        return 'bg-antiqueGold/15 text-antiqueGold border-antiqueGold/30';
      default:
        return 'bg-mutedRed/15 text-mutedRed border-mutedRed/30';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-xl border border-steelGrey/20 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-midnight tracking-tight">
              Contact & Inquiry Messages
            </h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-heading font-bold px-2.5 py-0.5 rounded border border-antiqueGold/30">
              {messages.length} Messages Logged
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-0.5">
            Public inquiries, campus visit requests, and prospective guardian communications submitted from /contact.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'UNREAD', 'READ', 'RESPONDED'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition ${
              filter === cat
                ? 'bg-midnight text-pureWhite shadow-sm'
                : 'bg-pureWhite text-steelGrey hover:text-midnight border border-steelGrey/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-warmIvory text-midnight uppercase font-heading font-bold text-[11px] border-b border-steelGrey/20">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steelGrey/15">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-steelGrey">
                    No inquiries found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-warmIvory/30 transition">
                    <td className="py-3 px-4 font-mono text-steelGrey">{formatDate(m.createdAt)}</td>
                    <td className="py-3 px-4 font-heading font-bold text-midnight">{m.name}</td>
                    <td className="py-3 px-4 font-medium max-w-xs truncate">{m.subject}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-steelGrey">
                      <div>{m.email}</div>
                      {m.phone && <div className="text-midnight">{m.phone}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase border ${getStatusBadge(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedMessage(m);
                          setAdminNotes(m.notes || '');
                          setSuccessMsg('');
                        }}
                        className="px-3 py-1 bg-warmIvory hover:bg-slate-200 text-midnight text-[11px] font-heading font-semibold rounded transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-xl max-w-lg w-full p-6 shadow-elevated border border-steelGrey/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-steelGrey/20">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-antiqueGold" />
                <h3 className="font-heading font-bold text-base text-midnight">Inquiry Communication Review</h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-steelGrey hover:text-midnight p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-deepEmerald/10 border border-deepEmerald/30 text-deepEmerald text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-warmIvory/60 border border-steelGrey/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-steelGrey">Sender:</span>
                <strong className="text-midnight">{selectedMessage.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-steelGrey">Email:</span>
                <span className="font-mono text-midnight">{selectedMessage.email}</span>
              </div>
              {selectedMessage.phone && (
                <div className="flex justify-between">
                  <span className="text-steelGrey">Phone:</span>
                  <span className="font-mono text-midnight">{selectedMessage.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-steelGrey">Date Received:</span>
                <span className="text-steelGrey font-mono">{formatDate(selectedMessage.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey">Subject</span>
              <h4 className="font-heading font-bold text-midnight text-sm">{selectedMessage.subject}</h4>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey">Message Body</span>
              <p className="p-3 bg-warmIvory/40 rounded-lg border border-steelGrey/20 text-xs text-charcoal font-sans leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-heading font-bold uppercase tracking-wider text-steelGrey block">
                Internal Administrative Response Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                placeholder="Log internal follow-up remarks..."
                className="w-full px-3 py-2 bg-warmIvory/60 border border-steelGrey/30 rounded-lg text-xs text-midnight focus:outline-none focus:border-antiqueGold"
              />
            </div>

            <div className="pt-3 border-t border-steelGrey/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('READ')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded bg-warmIvory text-midnight text-xs font-heading font-semibold hover:bg-slate-200"
                >
                  Mark as Read
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('RESPONDED')}
                  disabled={loading}
                  className="px-3 py-1.5 rounded bg-deepEmerald text-pureWhite text-xs font-heading font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Mark as Responded
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-1.5 text-xs text-steelGrey hover:text-midnight font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
