'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { createFeeInvoice, recordFeePayment } from '@/app/actions/school-actions';
import { formatCurrency, formatDate } from '@/lib/utils';

interface StudentInfo {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  user: {
    name: string;
  };
  section: {
    name: string;
    classLevel: {
      name: string;
    };
  };
}

interface PaymentItem {
  id: string;
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionRef: string | null;
  notes: string | null;
}

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  createdAt: string;
  student: StudentInfo;
  payments: PaymentItem[];
}

export function FeesView({
  invoices,
  students,
  userRole,
}: {
  invoices: InvoiceItem[];
  students: StudentInfo[];
  userRole: string;
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceItem | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<InvoiceItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.title.toLowerCase().includes(q) ||
      inv.student.user.name.toLowerCase().includes(q) ||
      inv.student.admissionNumber.toLowerCase().includes(q);

    const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await createFeeInvoice(formData);

    if (res.success) {
      setIsInvoiceModalOpen(false);
      setSuccessMsg('Invoice generated successfully!');
      setLoading(false);
    } else {
      setErrorMsg(res.error || 'Failed to create invoice');
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const res = await recordFeePayment(formData);

    if (res.success) {
      setPaymentInvoice(null);
      setSuccessMsg('Payment logged and receipt issued successfully!');
      setLoading(false);
    } else {
      setErrorMsg(res.error || 'Failed to record payment');
      setLoading(false);
    }
  };

  // Status badge helper
  const getBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PARTIAL':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'UNPAID':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fee Collection & Invoicing</h1>
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-100">
              Billing Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Student fee bills, dues reconciliation, and cash/bank payment receipt slips.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={() => {
              setIsInvoiceModalOpen(true);
              setErrorMsg('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Generate Fee Invoice
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number, student, or title..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">Paid in Full</option>
            <option value="PARTIAL">Partially Paid</option>
            <option value="UNPAID">Unpaid / Due</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No fee invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const balanceDue = Math.max(0, inv.totalAmount - inv.paidAmount);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{inv.student.user.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {inv.student.section.classLevel.name} - Sec {inv.student.section.name} (Roll #{inv.student.rollNumber})
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{inv.title}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(inv.totalAmount)}</td>
                      <td className="py-3 px-4 font-medium text-emerald-600">{formatCurrency(inv.paidAmount)}</td>
                      <td className="py-3 px-4 font-bold text-red-600">{formatCurrency(balanceDue)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatDate(inv.dueDate)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadge(
                            inv.status
                          )}`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {userRole === 'ADMIN' && inv.status !== 'PAID' && (
                          <button
                            onClick={() => {
                              setPaymentInvoice(inv);
                              setErrorMsg('');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] transition"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => setReceiptInvoice(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Generate Fee Invoice</h2>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student *</label>
                <select
                  name="studentId"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.user.name} ({st.section.classLevel.name} - Sec {st.section.name}, Roll #{st.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Description / Title *</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. November 2026 Tuition & Activities"
                  defaultValue="November 2026 Tuition Fee"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Amount *</label>
                  <input
                    name="totalAmount"
                    type="number"
                    step="1"
                    required
                    placeholder="18500"
                    defaultValue="18500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    name="dueDate"
                    type="date"
                    defaultValue={new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {loading ? 'Creating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Record Fee Payment</h2>
              <button
                onClick={() => setPaymentInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-slate-900">{paymentInvoice.student.user.name}</div>
              <div className="text-slate-500">Invoice: {paymentInvoice.invoiceNumber} • {paymentInvoice.title}</div>
              <div className="font-bold text-red-600">
                Pending Balance: {formatCurrency(paymentInvoice.totalAmount - paymentInvoice.paidAmount)}
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <input type="hidden" name="invoiceId" value={paymentInvoice.id} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount to Pay *</label>
                  <input
                    name="amount"
                    type="number"
                    step="1"
                    required
                    defaultValue={(paymentInvoice.totalAmount - paymentInvoice.paidAmount).toFixed(0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  >
                    <option value="CASH">Cash at Counter</option>
                    <option value="BANK_TRANSFER">Bank Wire / Transfer</option>
                    <option value="CHEQUE">Bank Cheque</option>
                    <option value="ONLINE">Online Portal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Cheque No</label>
                <input
                  name="transactionRef"
                  placeholder="e.g. TXN-984274 or Cheque #10492"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cashier Remarks / Notes</label>
                <input
                  name="notes"
                  placeholder="e.g. Paid in full by father at front desk"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentInvoice(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  {loading ? 'Recording...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL PRINTABLE FEE RECEIPT MODAL */}
      {receiptInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <span className="text-xs font-bold uppercase text-slate-500">Official Payment Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setReceiptInvoice(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Content */}
            <div className="p-4 sm:p-6 text-charcoal text-xs font-sans">
              <div className="text-center pb-4 border-b border-steelGrey/20">
                <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-pureWhite mb-2 shadow-sm border border-antiqueGold/40">
                  <img
                    src="/logo.png"
                    alt="Sonargaon International School Crest"
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <h2 className="font-heading text-lg font-black uppercase text-midnight">SONARGAON INTERNATIONAL SCHOOL</h2>
                <p className="text-[10px] font-bold text-antiqueGold uppercase tracking-widest font-heading mt-0.5">
                  Building Character. Inspiring Excellence.
                </p>
                <p className="text-[11px] text-steelGrey mt-0.5">Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh • +880 2 8876543</p>
                <div className="inline-block mt-2.5 px-3.5 py-1 rounded-full bg-warmIvory font-heading font-bold text-[10px] text-midnight uppercase tracking-widest border border-antiqueGold/30">
                  Official Fee Payment Clearance Voucher
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoice No</span>
                  <span className="font-mono font-bold text-slate-900">{receiptInvoice.invoiceNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date</span>
                  <span className="font-medium text-slate-900">{formatDate(new Date())}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                  <span className="font-bold text-slate-900">{receiptInvoice.student.user.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Class / Section</span>
                  <span className="font-medium text-slate-900">
                    {receiptInvoice.student.section.classLevel.name} - Sec {receiptInvoice.student.section.name} (Roll #{receiptInvoice.student.rollNumber})
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{receiptInvoice.title}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(receiptInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-2 border-t border-slate-100">
                  <span>Total Amount Paid:</span>
                  <span>{formatCurrency(receiptInvoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600 font-bold">
                  <span>Remaining Dues Balance:</span>
                  <span>{formatCurrency(Math.max(0, receiptInvoice.totalAmount - receiptInvoice.paidAmount))}</span>
                </div>
              </div>

              {receiptInvoice.payments.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Payment Transactions</span>
                  {receiptInvoice.payments.map((p) => (
                    <div key={p.id} className="flex justify-between text-[11px] py-1 border-b border-slate-200/50 last:border-none">
                      <div>
                        <span className="font-mono font-semibold">{p.receiptNumber}</span>
                        <span className="text-slate-400 ml-1">({p.paymentMethod})</span>
                      </div>
                      <span className="font-bold text-slate-900">{formatCurrency(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
                <div>
                  <span className="block font-semibold text-slate-800">Status: {receiptInvoice.status}</span>
                  <span>System Generated Electronic Receipt</span>
                </div>
                <div className="text-center">
                  <div className="h-8 border-b border-slate-400 w-28 mb-1" />
                  <span>Authorized Cashier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
