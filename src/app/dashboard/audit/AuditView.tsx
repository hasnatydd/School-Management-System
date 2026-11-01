'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  User,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function AuditView({
  auditLogs,
}: {
  auditLogs: any[];
  userRole: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.userName && log.userName.toLowerCase().includes(search.toLowerCase()));
    const matchModule = selectedModule === 'ALL' || log.module === selectedModule;
    return matchSearch && matchModule;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-pureWhite p-6 rounded-2xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-black text-midnight tracking-tight uppercase">
              System Security & Administrative Audit Trail
            </h1>
            <span className="bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 text-xs font-heading font-bold px-2.5 py-0.5 rounded-full">
              {auditLogs.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-1">
            Immutable activity trail recording authentication, exam score entries, and financial adjustments.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-deepEmerald/15 text-deepEmerald border border-deepEmerald/30 text-xs font-heading font-bold uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>RBAC Integrity Active</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-pureWhite p-4 rounded-xl border border-steelGrey/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, user, or details..."
            className="w-full pl-9 pr-3 py-2 bg-warmIvory/60 border border-slate-200 rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-steelGrey" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-warmIvory/60 border border-slate-200 rounded-lg text-xs font-medium text-charcoal py-2 px-3 focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          >
            <option value="ALL">All System Modules</option>
            <option value="AUTH">Authentication & Sessions</option>
            <option value="EXAMS">Examinations & Gradebook</option>
            <option value="FINANCE">Fee Collection & Ledger</option>
            <option value="ADMISSIONS">Admissions Directorate</option>
            <option value="SYSTEM">Core System Operations</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-pureWhite rounded-xl border border-steelGrey/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal">
            <thead className="bg-warmIvory/80 text-midnight uppercase font-heading font-extrabold text-[11px] border-b border-steelGrey/20">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / User</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action Key</th>
                <th className="py-3 px-4">Audit Record Details</th>
                <th className="py-3 px-4 text-right">Host IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-warmIvory/40 transition">
                  <td className="py-3 px-4 font-mono text-steelGrey whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="py-3 px-4 font-heading font-bold text-midnight">
                    {log.userName || 'System Service'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-midnight text-warmGold border border-antiqueGold/30">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-charcoal">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-charcoal max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-steelGrey">
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
