'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Phone,
  X,
  AlertCircle,
  Eye,
  CreditCard,
  Printer,
} from 'lucide-react';
import { createStudent } from '@/app/actions/school-actions';

interface StudentItem {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  gender: string | null;
  bloodGroup: string | null;
  address: string | null;
  user: {
    name: string;
    email: string | null;
    identifier: string;
    phone: string | null;
    avatar?: string | null;
  };
  section: {
    id: string;
    name: string;
    classLevel: {
      id: string;
      name: string;
      code: string;
    };
  };
  parent: {
    user: {
      name: string;
      phone: string | null;
    };
    relationship: string | null;
  } | null;
}

interface SectionOption {
  id: string;
  name: string;
  classLevel: {
    name: string;
  };
}

export function StudentsView({
  students,
  sections,
  userRole,
}: {
  students: StudentItem[];
  sections: SectionOption[];
  userRole: string;
}) {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter students
  const filtered = students.filter((s) => {
    const query = search.toLowerCase();
    const matchesSearch =
      s.user.name.toLowerCase().includes(query) ||
      s.admissionNumber.toLowerCase().includes(query) ||
      s.rollNumber.toLowerCase().includes(query) ||
      s.user.identifier.toLowerCase().includes(query);

    const matchesSection =
      selectedSection === 'ALL' ||
      s.section.id === selectedSection ||
      s.section.classLevel.id === selectedSection;

    return matchesSearch && matchesSection;
  });

  const handleCreateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createStudent(formData);

    if (result.success) {
      setIsModalOpen(false);
      setLoading(false);
    } else {
      setError(result.error || 'Failed to admit student');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-pureWhite p-6 rounded-xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-midnight tracking-tight">Scholar Directory</h1>
            <span className="bg-antiqueGold/15 text-antiqueGold text-xs font-heading font-bold px-2.5 py-0.5 rounded border border-antiqueGold/30">
              {students.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-steelGrey mt-0.5 font-sans">
            Manage academic enrollments, Cambridge section divisions, and emergency contacts.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setError('');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-midnight hover:bg-deepNavy text-pureWhite font-heading text-xs font-bold uppercase tracking-wider rounded-lg shadow-subtle transition"
          >
            <Plus className="w-4 h-4 text-warmGold" />
            Admit New Scholar
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-pureWhite p-4 rounded-xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-steelGrey absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scholar name, roll, or admission ID..."
            className="w-full pl-9 pr-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold focus:bg-pureWhite transition font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-steelGrey" />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-warmIvory/60 border border-slate-300 rounded-lg text-xs font-heading font-medium text-charcoal py-2 px-3 focus:outline-none focus:ring-1 focus:ring-antiqueGold"
          >
            <option value="ALL">All Academic Grades & Sections</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.classLevel.name} - Section {sec.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-pureWhite rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal/80">
            <thead className="bg-warmIvory text-midnight uppercase font-heading font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Scholar Profile</th>
                <th className="py-3 px-4">Adm. ID</th>
                <th className="py-3 px-4">Grade & Section</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Guardian Details</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-steelGrey">
                    No scholars found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-warmIvory/50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-midnight text-warmGold font-heading font-bold flex items-center justify-center text-xs">
                          {s.user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-heading font-bold text-midnight">{s.user.name}</div>
                          <div className="text-[10px] text-steelGrey font-mono">{s.user.email || 'No email registered'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-charcoal">{s.admissionNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-midnight">
                        {s.section.classLevel.name}
                      </span>
                      <span className="text-steelGrey ml-1">({s.section.name})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-midnight">#{s.rollNumber}</td>
                    <td className="py-3 px-4">{s.gender || '—'}</td>
                    <td className="py-3 px-4">
                      {s.parent ? (
                        <div>
                          <div className="font-medium text-charcoal">{s.parent.user.name}</div>
                          <div className="text-[10px] text-steelGrey flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-antiqueGold" /> {s.parent.user.phone || 'N/A'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-steelGrey italic">Not Linked</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-warmIvory hover:bg-slate-200 text-charcoal text-[11px] font-heading font-semibold transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-steelGrey" />
                          Details
                        </button>
                        <button
                          onClick={() => setIdCardStudent(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-midnight hover:bg-deepNavy text-warmGold text-[11px] font-heading font-semibold transition border border-antiqueGold/40 shadow-subtle"
                          title="Generate Official Student ID Card"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-antiqueGold" />
                          ID Card
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admission Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-xl max-w-lg w-full p-6 shadow-elevated border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="font-heading text-base font-bold text-midnight">Scholar Admission Form</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-steelGrey hover:text-midnight p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-mutedRed/10 border border-mutedRed/30 text-mutedRed text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Full Scholar Name *</label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Shafayat Rahman"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Login Identifier *</label>
                  <input
                    name="identifier"
                    required
                    placeholder="e.g. STU-2026-009"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Admission Number *</label>
                  <input
                    name="admissionNumber"
                    required
                    placeholder="e.g. SIS-2026-1009"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Roll Number *</label>
                  <input
                    name="rollNumber"
                    required
                    placeholder="e.g. 09"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Class & Section *</label>
                  <select
                    name="sectionId"
                    required
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.classLevel.name} - Section {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Gender</label>
                  <select
                    name="gender"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Email (Optional)</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="scholar@sonargaon.edu.bd"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Initial Password</label>
                  <input
                    name="password"
                    defaultValue="student123"
                    className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Residential Address (Dhaka)</label>
                <input
                  name="address"
                  placeholder="Sector / Road, Uttara / Banani / Gulshan, Dhaka"
                  className="w-full px-3 py-2 bg-warmIvory/60 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-steelGrey hover:bg-warmIvory font-heading font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
                >
                  {loading ? 'Admitting...' : 'Confirm Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-xl max-w-md w-full p-6 shadow-elevated border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="font-heading text-base font-bold text-midnight">Scholar Profile Record</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-steelGrey hover:text-midnight p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs space-y-3 font-sans">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-midnight text-warmGold font-heading font-bold text-lg flex items-center justify-center">
                  {selectedStudent.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-midnight">{selectedStudent.user.name}</h3>
                  <p className="text-steelGrey font-mono">
                    {selectedStudent.section.classLevel.name} - Section {selectedStudent.section.name} (Roll #{selectedStudent.rollNumber})
                  </p>
                </div>
              </div>

              <div className="bg-warmIvory/60 p-3 rounded-lg border border-slate-200 space-y-1.5 text-charcoal">
                <div className="flex justify-between">
                  <span className="font-semibold text-steelGrey">Admission ID:</span>
                  <span className="font-mono text-midnight font-bold">{selectedStudent.admissionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-steelGrey">Portal Username:</span>
                  <span className="font-mono text-midnight">{selectedStudent.user.identifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-steelGrey">Gender:</span>
                  <span>{selectedStudent.gender || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-steelGrey">Blood Group:</span>
                  <span>{selectedStudent.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-steelGrey">Residential Address:</span>
                  <span>{selectedStudent.address || 'Dhaka, Bangladesh'}</span>
                </div>
              </div>

              {selectedStudent.parent && (
                <div className="bg-pureWhite p-3 rounded-lg border border-slate-200 text-charcoal">
                  <div className="font-heading font-bold text-[10px] uppercase tracking-wider text-midnight mb-1">
                    Guardian Information
                  </div>
                  <div className="font-medium text-midnight">{selectedStudent.parent.user.name} ({selectedStudent.parent.relationship || 'Guardian'})</div>
                  <div className="text-steelGrey text-[11px] mt-0.5 font-mono">Phone: {selectedStudent.parent.user.phone || 'N/A'}</div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => {
                    setIdCardStudent(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-semibold text-xs rounded-lg border border-antiqueGold/40 transition shadow-subtle"
                >
                  <CreditCard className="w-3.5 h-3.5 text-antiqueGold" />
                  <span>Generate Official ID Card (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL STUDENT ID CARD MODAL */}
      {idCardStudent && (
        <div className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-pureWhite rounded-2xl max-w-md w-full p-6 shadow-2xl border border-steelGrey/20 max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between pb-3 border-b border-steelGrey/20 no-print">
              <span className="text-xs font-heading font-bold uppercase text-steelGrey">Official Student ID Card</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-midnight hover:bg-deepNavy text-pureWhite rounded-lg text-xs font-heading font-semibold border border-antiqueGold/40 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-antiqueGold" />
                  Print ID Card (PDF)
                </button>
                <button
                  onClick={() => setIdCardStudent(null)}
                  className="text-steelGrey hover:text-midnight p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ID Card Graphic Container */}
            <div className="my-4 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-antiqueGold/60 shadow-elevated bg-pureWhite text-charcoal">
                {/* ID Card Navy Header */}
                <div className="bg-midnight p-3.5 text-center border-b-2 border-antiqueGold relative">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="h-10 w-auto px-1.5 py-0.5 rounded-lg bg-pureWhite/95 border border-antiqueGold/40 shadow-subtle flex items-center justify-center">
                      <img
                        src="/logo.png"
                        alt="Sonargaon Logo"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-heading font-black text-pureWhite text-xs uppercase tracking-wider leading-tight">
                        SONARGAON INT'L SCHOOL
                      </div>
                      <div className="text-[8.5px] text-warmGold font-semibold uppercase tracking-widest">
                        Building Character. Inspiring Excellence.
                      </div>
                    </div>
                  </div>
                </div>

                {/* ID Card Body */}
                <div className="p-4 space-y-3 bg-gradient-to-b from-pureWhite to-warmIvory/40 font-sans">
                  <div className="flex items-start gap-3.5">
                    {/* Portrait Photo Frame */}
                    <div className="w-20 h-24 rounded-lg bg-midnight border-2 border-antiqueGold/80 overflow-hidden shadow-subtle flex-shrink-0">
                      {idCardStudent.user.avatar ? (
                        <img
                          src={idCardStudent.user.avatar}
                          alt={idCardStudent.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-warmGold font-heading font-bold text-2xl">
                          <span>{idCardStudent.user.name.charAt(0)}</span>
                          <span className="text-[8px] uppercase tracking-wider text-slate-300 font-sans mt-1">Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Student Key Info */}
                    <div className="space-y-1 text-xs">
                      <div className="font-heading font-black text-midnight text-sm uppercase leading-tight">
                        {idCardStudent.user.name}
                      </div>
                      <div className="text-antiqueGold font-heading font-bold text-[11px]">
                        {idCardStudent.section.classLevel.name} • Section {idCardStudent.section.name}
                      </div>
                      <div className="text-[11px] text-steelGrey font-mono">
                        Roll: <strong className="text-midnight">#{idCardStudent.rollNumber}</strong>
                      </div>
                      <div className="text-[11px] text-steelGrey font-mono">
                        Adm ID: <strong className="text-midnight">{idCardStudent.admissionNumber}</strong>
                      </div>
                      <div className="text-[11px] text-steelGrey">
                        Blood: <strong className="text-mutedRed">{idCardStudent.bloodGroup || 'O+'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Session & Validation */}
                  <div className="pt-2 border-t border-steelGrey/20 flex items-center justify-between text-[10px] text-steelGrey">
                    <div>
                      <span>Valid Session:</span>
                      <strong className="block text-midnight font-heading">AY 2026–2027</strong>
                    </div>
                    <div className="text-right">
                      <span>Emergency Contact:</span>
                      <strong className="block text-midnight font-mono">{idCardStudent.parent?.user.phone || '+880 2 8876543'}</strong>
                    </div>
                  </div>

                  {/* Barcode & Security Gate Scan */}
                  <div className="pt-2 border-t border-dashed border-steelGrey/20 flex items-center justify-between">
                    <div>
                      {/* Stylized Barcode */}
                      <div className="font-mono text-[9px] tracking-widest text-steelGrey">
                        ||| | |||| | ||| || |||| |
                      </div>
                      <span className="text-[8px] text-steelGrey font-mono">SIS-AUTH-{idCardStudent.admissionNumber}</span>
                    </div>
                    <div className="text-right">
                      <div className="h-6 border-b border-steelGrey/40 w-24 mb-0.5 ml-auto" />
                      <span className="text-[8px] font-heading font-semibold text-midnight block">Dr. Mansur Ali Chowdhury</span>
                      <span className="text-[7.5px] text-steelGrey block -mt-0.5">Principal & Academic Director</span>
                    </div>
                  </div>
                </div>

                {/* ID Card Footer Strip */}
                <div className="bg-midnight py-1.5 px-3 text-center border-t border-antiqueGold/40">
                  <span className="text-[8px] text-slate-300 font-sans tracking-wide">
                    Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka • www.sonargaon.edu.bd
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
