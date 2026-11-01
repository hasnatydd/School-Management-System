'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  FileText,
  Clock,
  User,
  X,
} from 'lucide-react';
import { submitStaffLeave, updateStaffLeaveStatus } from '@/app/actions/school-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

export function PayrollView({
  payrollRecords,
  staffLeaves,
  departments,
  userRole,
  userId,
  userName,
}: {
  payrollRecords: any[];
  staffLeaves: any[];
  departments: any[];
  userRole: string;
  userId: string;
  userName: string;
}) {
  const [activeTab, setActiveTab] = useState<'payroll' | 'leaves'>('payroll');
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRequestLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitStaffLeave(formData, userId, userName);

    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Leave application submitted to administration!' });
      setLeaveModalOpen(false);
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to submit leave.' });
    }
    setLoading(false);
  };

  const handleLeaveDecision = async (leaveId: string, status: string) => {
    setLoading(true);
    setStatusMessage(null);

    const res = await updateStaffLeaveStatus(leaveId, status, userName);
    if (res.success) {
      setStatusMessage({ type: 'success', text: `Leave request marked as ${status}.` });
      window.location.reload();
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Action failed.' });
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
              Human Resources & Payroll Directorate
            </h1>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Faculty compensation schedules, automated payslip vouchers, and institutional leave management.
          </p>
        </div>

        {/* Tab Switcher & Action */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-warmIvory/60 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-4 py-1.5 rounded-md text-xs font-heading font-bold uppercase transition ${
                activeTab === 'payroll'
                  ? 'bg-midnight text-pureWhite shadow-sm'
                  : 'text-charcoal hover:text-midnight'
              }`}
            >
              Payroll Ledger
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-4 py-1.5 rounded-md text-xs font-heading font-bold uppercase transition ${
                activeTab === 'leaves'
                  ? 'bg-midnight text-pureWhite shadow-sm'
                  : 'text-charcoal hover:text-midnight'
              }`}
            >
              Staff Leave Records ({staffLeaves.length})
            </button>
          </div>

          {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Leave</span>
            </button>
          )}
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

      {/* Tab 1: Payroll Records Table */}
      {activeTab === 'payroll' && (
        <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                <tr>
                  <th className="py-3 px-4">Employee Details</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Basic Pay</th>
                  <th className="py-3 px-4">Allowances</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Disbursed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRecords.map((pay) => (
                  <tr key={pay.id} className="hover:bg-warmIvory/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-heading font-bold text-midnight">{pay.employeeName}</div>
                      <div className="text-[11px] text-steelGrey">
                        {pay.employeeId} • {pay.designation}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-charcoal">{pay.monthYear}</td>
                    <td className="py-3 px-4 font-mono">{formatCurrency(pay.basicSalary)}</td>
                    <td className="py-3 px-4 font-mono text-deepEmerald">+{formatCurrency(pay.allowances)}</td>
                    <td className="py-3 px-4 font-mono text-mutedRed">-{formatCurrency(pay.deductions)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-midnight text-sm">
                      {formatCurrency(pay.netSalary)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30">
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayslip(pay)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-[11px] uppercase tracking-wider transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-warmGold" />
                        <span>Voucher</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Staff Leave Records */}
      {activeTab === 'leaves' && (
        <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Dates Duration</th>
                  <th className="py-3 px-4">Reason Statement</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-warmIvory/40 transition">
                    <td className="py-3 px-4 font-heading font-bold text-midnight">
                      {leave.userName}
                    </td>
                    <td className="py-3 px-4 font-semibold text-charcoal">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-steelGrey">
                      {formatDate(leave.startDate)} to {formatDate(leave.endDate)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-charcoal">
                      {leave.reason}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${
                          leave.status === 'APPROVED'
                            ? 'bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30'
                            : leave.status === 'REJECTED'
                            ? 'bg-mutedRed/15 text-mutedRed border border-mutedRed/30'
                            : 'bg-antiqueGold/15 text-warmGold border border-antiqueGold/30'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {userRole === 'ADMIN' && leave.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleLeaveDecision(leave.id, 'APPROVED')}
                            className="px-2.5 py-1 rounded bg-deepEmerald text-pureWhite font-bold text-[10px] hover:bg-emerald-800 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveDecision(leave.id, 'REJECTED')}
                            className="px-2.5 py-1 rounded bg-mutedRed text-pureWhite font-bold text-[10px] hover:bg-red-800 transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                <div>
                  <h2 className="font-heading font-black text-sm text-midnight uppercase">
                    SONARGAON INTERNATIONAL SCHOOL
                  </h2>
                  <p className="text-[10px] text-warmGold font-bold uppercase tracking-wider">
                    Official Salary Disbursal Voucher
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs font-sans">
              <div className="p-3 rounded-xl bg-warmIvory/60 border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-steelGrey text-[10px] block">EMPLOYEE NAME</span>
                  <strong className="text-midnight">{selectedPayslip.employeeName}</strong>
                </div>
                <div>
                  <span className="text-steelGrey text-[10px] block">STAFF ID & DESIGNATION</span>
                  <strong className="text-midnight">
                    {selectedPayslip.employeeId} • {selectedPayslip.designation}
                  </strong>
                </div>
                <div>
                  <span className="text-steelGrey text-[10px] block">PAY PERIOD</span>
                  <strong className="text-midnight">{selectedPayslip.monthYear}</strong>
                </div>
                <div>
                  <span className="text-steelGrey text-[10px] block">PAYSLIP NUMBER</span>
                  <strong className="font-mono text-antiqueGold">{selectedPayslip.payslipNumber}</strong>
                </div>
              </div>

              {/* Salary Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-heading font-bold text-[10px] uppercase text-midnight">
                    <tr>
                      <th className="py-2 px-3">Earnings Component</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3">Basic Instructional Salary</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(selectedPayslip.basicSalary)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Cambridge Faculty Allowance</td>
                      <td className="py-2 px-3 text-right font-mono text-deepEmerald">+{formatCurrency(selectedPayslip.allowances)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Provident Fund & Statutory Deductions</td>
                      <td className="py-2 px-3 text-right font-mono text-mutedRed">-{formatCurrency(selectedPayslip.deductions)}</td>
                    </tr>
                    <tr className="bg-warmIvory/60 font-bold">
                      <td className="py-2.5 px-3 font-heading uppercase text-midnight">Net Disbursed Compensation</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm text-midnight">
                        {formatCurrency(selectedPayslip.netSalary)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 text-[11px] text-steelGrey">
                <div>Payment Method: {selectedPayslip.paymentMethod}</div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-warmGold" />
                  <span>Print Formal Voucher</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-heading font-bold text-midnight uppercase tracking-wider">
                Staff Leave Application
              </h2>
              <button onClick={() => setLeaveModalOpen(false)} className="text-steelGrey hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestLeave} className="mt-4 space-y-4 text-xs font-sans">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Leave Classification
                </label>
                <select
                  name="leaveType"
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Medical / Sick Leave</option>
                  <option value="ANNUAL">Annual Institutional Leave</option>
                  <option value="MATERNITY">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Reason for Absence
                </label>
                <textarea
                  name="reason"
                  rows={3}
                  required
                  placeholder="State the purpose of leave and class proxy arrangements..."
                  className="w-full p-2.5 bg-warmIvory/60 border border-slate-200 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
