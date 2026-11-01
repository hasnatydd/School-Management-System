'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Phone,
  Mail,
  Eye,
  X,
} from 'lucide-react';
import { updateAdmissionInquiryStatus } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

interface InquiryItem {
  id: string;
  applicationNumber: string | null;
  studentName: string;
  gender: string;
  dateOfBirth: string | null;
  gradeApplying: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  previousSchool: string | null;
  address: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

export function AdmissionsView({
  inquiries,
  userRole,
}: {
  inquiries: InquiryItem[];
  userRole: string;
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const filtered = inquiries.filter((inq) => {
    const q = search.toLowerCase();
    const matchSearch =
      inq.studentName.toLowerCase().includes(q) ||
      (inq.applicationNumber && inq.applicationNumber.toLowerCase().includes(q)) ||
      inq.parentName.toLowerCase().includes(q) ||
      inq.gradeApplying.toLowerCase().includes(q) ||
      inq.parentPhone.includes(q);

    const matchStatus = filterStatus === 'ALL' || inq.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (inquiryId: string, status: string) => {
    setStatusUpdating(true);
    await updateAdmissionInquiryStatus(inquiryId, status);
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
    setStatusUpdating(false);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prospective Student Admissions</h1>
            <span className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
              {inquiries.length} Inquiries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review online application inquiries submitted through the public Sonargaon portal.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by applicant name, parent, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Application Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="REVIEWED">Under Interview / Reviewed</option>
            <option value="APPROVED">Approved for Enrollment</option>
            <option value="REJECTED">Declined</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Applicant Student</th>
                <th className="py-3 px-4">Grade Applying</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Previous School</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No admission applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{inq.studentName}</span>
                        {inq.applicationNumber && (
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                            {inq.applicationNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{inq.gender} • Applied {formatDate(inq.createdAt)}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{inq.gradeApplying}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{inq.parentName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{inq.parentPhone}</td>
                    <td className="py-3 px-4">{inq.previousSchool || 'Not Specified'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          inq.status
                        )}`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-semibold text-[11px] transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
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

      {/* Review & Status Dialog */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Admission Inquiry Details</h2>
                {selectedInquiry.applicationNumber && (
                  <span className="font-mono text-xs text-amber-700 font-semibold">
                    Tracking ID: {selectedInquiry.applicationNumber}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-900">{selectedInquiry.studentName}</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Applying for {selectedInquiry.gradeApplying}
                  </span>
                </div>
                <div className="text-slate-500">Gender: {selectedInquiry.gender}</div>
                {selectedInquiry.dateOfBirth && (
                  <div className="text-slate-500">Date of Birth: {formatDate(selectedInquiry.dateOfBirth)}</div>
                )}
                <div className="text-slate-500">Previous School: {selectedInquiry.previousSchool || 'N/A'}</div>
                <div className="text-slate-500">Residential Area: {selectedInquiry.address || 'Dhaka, Bangladesh'}</div>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 text-indigo-950 space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-[10px] text-indigo-800">
                  Guardian Contact Information
                </div>
                <div className="font-semibold text-slate-900">{selectedInquiry.parentName}</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5" /> {selectedInquiry.parentPhone}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5" /> {selectedInquiry.parentEmail}
                </div>
              </div>

              {selectedInquiry.notes && (
                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900">
                  <span className="font-bold block text-[11px] mb-0.5">Application Notes:</span>
                  <p>{selectedInquiry.notes}</p>
                </div>
              )}

              {userRole === 'ADMIN' && (
                <div className="pt-3 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 mb-2 uppercase tracking-wider text-[10px]">
                    Update Application Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'APPROVED')}
                      disabled={statusUpdating}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                    >
                      Approve & Shortlist
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'REVIEWED')}
                      disabled={statusUpdating}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                    >
                      Mark Interviewed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedInquiry.id, 'REJECTED')}
                      disabled={statusUpdating}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
