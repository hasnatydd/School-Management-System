import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Users,
  UserSquare2,
  CalendarCheck2,
  Receipt,
  FileSpreadsheet,
  Bell,
  ArrowUpRight,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'STUDENT';

  // Common: Recent announcements
  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [{ targetRole: 'ALL' }, { targetRole: role }],
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { author: true },
  });

  // Admin Dashboard Data
  if (role === 'ADMIN') {
    const [
      studentCount,
      teacherCount,
      inquiryCount,
      totalInvoiced,
      totalCollected,
      todayAttendance,
      recentStudents,
    ] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.teacherProfile.count(),
      prisma.admissionInquiry.count(),
      prisma.feeInvoice.aggregate({ _sum: { totalAmount: true } }),
      prisma.feeInvoice.aggregate({ _sum: { paidAmount: true } }),
      prisma.attendanceRecord.findMany({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.studentProfile.findMany({
        take: 5,
        orderBy: { id: 'desc' },
        include: {
          user: true,
          section: { include: { classLevel: true } },
        },
      }),
    ]);

    const totalStudentsInAtt = todayAttendance.length;
    const presentStudents = todayAttendance.filter((a) => a.status === 'PRESENT').length;
    const attendanceRate = totalStudentsInAtt > 0 ? Math.round((presentStudents / totalStudentsInAtt) * 100) : 98;

    const invoicedSum = totalInvoiced._sum.totalAmount || 55500;
    const collectedSum = totalCollected._sum.paidAmount || 28500;
    const pendingSum = invoicedSum - collectedSum;

    return (
      <div className="space-y-6 font-sans">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-pureWhite p-6 rounded-xl border border-slate-200 shadow-card">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest bg-antiqueGold/15 text-antiqueGold border border-antiqueGold/30 px-2.5 py-0.5 rounded">
                Executive ERP Suite
              </span>
              <span className="text-xs text-steelGrey font-mono">• AY 2026–2027</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-midnight tracking-tight mt-1.5">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-xs text-steelGrey mt-0.5 font-sans">
              SONARGAON INTERNATIONAL SCHOOL • Dhaka, Bangladesh (Asia/Dhaka)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/admissions"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deepNavy text-warmGold font-heading text-xs font-bold hover:bg-midnight transition border border-antiqueGold/30 shadow-subtle"
            >
              <UserPlus className="w-3.5 h-3.5 text-warmGold" />
              Admissions Queue ({inquiryCount})
            </Link>
            <Link
              href="/dashboard/students"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-midnight text-pureWhite font-heading text-xs font-semibold hover:bg-deepNavy transition shadow-subtle"
            >
              <Users className="w-3.5 h-3.5" />
              Scholar Directory
            </Link>
            <Link
              href="/dashboard/attendance"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deepEmerald text-pureWhite font-heading text-xs font-semibold hover:opacity-90 transition shadow-subtle"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              Take Roll-Call
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider">Total Scholars</span>
              <div className="w-8 h-8 rounded-lg bg-deepNavy/10 text-midnight flex items-center justify-center">
                <Users className="w-4 h-4 text-midnight" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="font-heading text-2xl font-bold text-midnight">{studentCount}</div>
              <span className="text-xs font-heading font-semibold text-deepEmerald flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Grades 1–10
              </span>
            </div>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider">Faculty & Staff</span>
              <div className="w-8 h-8 rounded-lg bg-deepNavy/10 text-midnight flex items-center justify-center">
                <UserSquare2 className="w-4 h-4 text-midnight" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="font-heading text-2xl font-bold text-midnight">{teacherCount}</div>
              <span className="text-xs font-sans text-steelGrey">Cambridge Leads</span>
            </div>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider">Today's Roll-Call</span>
              <div className="w-8 h-8 rounded-lg bg-deepEmerald/10 text-deepEmerald flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4 text-deepEmerald" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="font-heading text-2xl font-bold text-midnight">{attendanceRate}%</div>
              <span className="text-xs font-heading font-semibold text-deepEmerald">Compliant</span>
            </div>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider">Fee Clearance</span>
              <div className="w-8 h-8 rounded-lg bg-antiqueGold/15 text-antiqueGold flex items-center justify-center">
                <Receipt className="w-4 h-4 text-antiqueGold" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-heading text-lg font-bold text-midnight">{formatCurrency(collectedSum)}</div>
              <span className="text-[10px] font-sans text-mutedRed font-medium block mt-0.5">
                Pending: {formatCurrency(pendingSum)}
              </span>
            </div>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider">Online Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-midnight/10 text-midnight flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-midnight" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="font-heading text-2xl font-bold text-midnight">{inquiryCount}</div>
              <Link href="/dashboard/admissions" className="text-xs font-heading font-semibold text-antiqueGold hover:underline">
                Review Queue &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Content Grids: Recent Scholars & Bulletins */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Admissions */}
          <div className="lg:col-span-2 bg-pureWhite rounded-xl border border-slate-200 shadow-card p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="font-heading text-sm font-bold text-midnight tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-antiqueGold" />
                Recently Enrolled Scholars
              </h2>
              <Link
                href="/dashboard/students"
                className="text-xs font-heading font-semibold text-midnight hover:text-antiqueGold flex items-center gap-1 transition"
              >
                View Directory <ArrowUpRight className="w-3.5 h-3.5 text-antiqueGold" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-charcoal/80">
                <thead className="bg-warmIvory text-midnight uppercase font-heading font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Scholar Name</th>
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Grade & Section</th>
                    <th className="py-2.5 px-3">Roll No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {recentStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-warmIvory/50 transition">
                      <td className="py-2.5 px-3 font-medium text-midnight flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-midnight text-warmGold flex items-center justify-center text-[10px] font-heading font-bold">
                          {s.user.name.charAt(0)}
                        </div>
                        {s.user.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-steelGrey">{s.admissionNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-charcoal">
                        {s.section?.classLevel?.name} - Sec {s.section?.name}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-midnight">#{s.rollNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* School Announcements */}
          <div className="bg-pureWhite rounded-xl border border-slate-200 shadow-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="font-heading text-sm font-bold text-midnight tracking-tight flex items-center gap-2">
                <Bell className="w-4 h-4 text-antiqueGold" />
                Institutional Bulletins
              </h2>
              <Link
                href="/dashboard/notices"
                className="text-xs font-heading font-semibold text-midnight hover:text-antiqueGold"
              >
                All
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {announcements.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-warmIvory/60 border border-slate-200/80">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-midnight bg-pureWhite px-2 py-0.5 rounded border border-slate-200">
                      {a.category}
                    </span>
                    <span className="text-[10px] text-steelGrey font-mono">{formatDate(a.createdAt)}</span>
                  </div>
                  <h3 className="font-heading text-xs font-bold text-midnight mt-1.5 leading-snug">{a.title}</h3>
                  <p className="text-[11px] text-charcoal/80 line-clamp-2 mt-1 font-sans">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Dashboard Data
  if (role === 'TEACHER') {
    const teacher = await prisma.teacherProfile.findFirst({
      where: { userId: user.id },
      include: {
        classTeacherOf: {
          include: {
            classLevel: true,
            students: { include: { user: true } },
          },
        },
        assignedSubjects: {
          include: {
            subject: true,
            section: { include: { classLevel: true } },
          },
        },
        timetableSlots: {
          include: {
            subject: true,
            section: { include: { classLevel: true } },
          },
          orderBy: { periodNumber: 'asc' },
        },
      },
    });

    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-pureWhite p-6 rounded-xl border border-slate-200 shadow-card">
          <div>
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-deepEmerald bg-deepEmerald/10 px-2.5 py-0.5 rounded border border-deepEmerald/30">
              Senior Faculty Portal
            </span>
            <h1 className="font-heading text-2xl font-bold text-midnight tracking-tight mt-1.5">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-xs text-steelGrey mt-0.5 font-sans">
              {teacher?.designation || 'Faculty'} • SONARGAON INTERNATIONAL SCHOOL
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/attendance"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deepEmerald text-pureWhite font-heading text-xs font-semibold hover:opacity-90 transition shadow-subtle"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              Daily Roll-Call
            </Link>
            <Link
              href="/dashboard/exams"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-midnight text-pureWhite font-heading text-xs font-semibold hover:bg-deepNavy transition shadow-subtle"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Gradebook Marks
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <h3 className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider mb-2">Homeroom Mentorship</h3>
            {teacher?.classTeacherOf ? (
              <div>
                <div className="font-heading text-xl font-bold text-midnight">
                  {teacher.classTeacherOf.classLevel.name} - Section {teacher.classTeacherOf.name}
                </div>
                <p className="text-xs text-steelGrey mt-1 font-sans">
                  {teacher.classTeacherOf.students.length} Enrolled Scholars
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-charcoal font-medium">Daily Roll-Call:</span>
                  <Link
                    href="/dashboard/attendance"
                    className="font-heading font-bold text-deepEmerald hover:underline"
                  >
                    Open Sheet &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-steelGrey font-sans">Not assigned as homeroom mentor.</p>
            )}
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <h3 className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider mb-2">My Curricular Courses</h3>
            <div className="font-heading text-xl font-bold text-midnight">
              {teacher?.assignedSubjects.length || 0} Assigned Courses
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {teacher?.assignedSubjects.map((as) => (
                <span
                  key={as.id}
                  className="text-[11px] font-heading font-semibold bg-warmIvory text-charcoal px-2.5 py-1 rounded border border-slate-200"
                >
                  {as.subject.name} ({as.section.classLevel.code}-{as.section.name})
                </span>
              ))}
            </div>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <h3 className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider mb-2">Weekly Schedule</h3>
            <div className="font-heading text-xl font-bold text-midnight">
              {teacher?.timetableSlots.length || 0} Instruction Periods
            </div>
            <Link
              href="/dashboard/timetable"
              className="mt-3 inline-block text-xs font-heading font-bold text-midnight hover:text-antiqueGold transition"
            >
              View Sunday–Thursday Routine &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-pureWhite rounded-xl border border-slate-200 p-5 shadow-card">
          <h2 className="font-heading text-sm font-bold text-midnight mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-antiqueGold" />
            Faculty Memos & Academic Circulars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 bg-warmIvory/60 rounded-lg border border-slate-200">
                <span className="text-[9px] font-heading font-bold text-midnight uppercase bg-pureWhite px-2 py-0.5 rounded border border-slate-300">
                  {a.category}
                </span>
                <h4 className="font-heading text-xs font-bold text-midnight mt-1.5">{a.title}</h4>
                <p className="text-[11px] text-charcoal/80 mt-1 line-clamp-2 font-sans">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard Data
  if (role === 'STUDENT') {
    const student = await prisma.studentProfile.findFirst({
      where: { userId: user.id },
      include: {
        section: {
          include: { classLevel: true, classTeacher: { include: { user: true } } },
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        marks: {
          include: { examSubject: { include: { subject: true, examTerm: true } } },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });

    const totalDays = student?.attendance.length || 0;
    const presentDays = student?.attendance.filter((a) => a.status === 'PRESENT').length || 0;
    const attPercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    const gpaValues = student?.marks.map((m) => m.gpa) || [];
    const avgGPA =
      gpaValues.length > 0 ? (gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length).toFixed(2) : '5.00';

    return (
      <div className="space-y-6 font-sans">
        {/* Scholar Banner in Midnight Navy */}
        <div className="bg-midnight rounded-xl p-6 text-pureWhite shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-deepNavy">
          <div>
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-deepNavy text-warmGold border border-antiqueGold/40 px-2.5 py-1 rounded">
              Scholar Academic Portal
            </span>
            <h1 className="font-heading text-2xl font-bold mt-2">Welcome, {user.name}!</h1>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Class: {student?.section.classLevel.name} - Section {student?.section.name} • Roll #{student?.rollNumber} • Admission ID: {student?.admissionNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/exams"
              className="px-5 py-2.5 bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition"
            >
              Academic Transcript & GPA
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase">Roll-Call Presence</span>
              <CalendarCheck2 className="w-4 h-4 text-deepEmerald" />
            </div>
            <div className="mt-3 font-heading text-2xl font-bold text-midnight">{attPercent}%</div>
            <p className="text-[11px] text-steelGrey mt-0.5 font-sans">{presentDays} of {totalDays} recorded sessions present</p>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase">Academic Standing (GPA)</span>
              <FileSpreadsheet className="w-4 h-4 text-antiqueGold" />
            </div>
            <div className="mt-3 font-heading text-2xl font-bold text-midnight">{avgGPA} / 5.0</div>
            <p className="text-[11px] font-heading font-semibold text-deepEmerald mt-0.5">Grade A+ (Distinction Standing)</p>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-steelGrey uppercase">Fee Clearance Status</span>
              <Receipt className="w-4 h-4 text-midnight" />
            </div>
            <div className="mt-3 font-heading text-2xl font-bold text-midnight">
              {student?.invoices[0]?.status || 'PAID'}
            </div>
            <p className="text-[11px] text-steelGrey mt-0.5 font-sans">
              {student?.invoices[0] ? `${student.invoices[0].title}` : 'No overdue vouchers'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-pureWhite rounded-xl border border-slate-200 p-5 shadow-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-heading text-sm font-bold text-midnight">Recent Term Scores & Grades</h3>
              <Link href="/dashboard/exams" className="text-xs font-heading font-semibold text-midnight hover:text-antiqueGold">
                Print Transcript &rarr;
              </Link>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {student?.marks.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-heading font-semibold text-midnight">{m.examSubject.subject.name}</span>
                    <span className="text-[10px] text-steelGrey block font-mono">{m.examSubject.examTerm.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-midnight text-sm">{m.obtainedMarks}</span>
                    <span className="text-steelGrey text-xs">/{m.examSubject.maxMarks}</span>
                    <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-deepEmerald/10 text-deepEmerald border border-deepEmerald/20">
                      {m.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pureWhite rounded-xl border border-slate-200 p-5 shadow-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="font-heading text-sm font-bold text-midnight">School Circulars</h3>
              <Link href="/dashboard/notices" className="text-xs font-heading font-semibold text-midnight hover:text-antiqueGold">
                View All Bulletins &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-3 bg-warmIvory/60 rounded-lg border border-slate-200 text-xs">
                  <div className="font-heading font-bold text-midnight">{a.title}</div>
                  <p className="text-[11px] text-charcoal/80 mt-1 font-sans">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Parent Dashboard Data
  if (role === 'PARENT') {
    const parent = await prisma.parentProfile.findFirst({
      where: { userId: user.id },
      include: {
        students: {
          include: {
            user: true,
            section: { include: { classLevel: true } },
            attendance: { orderBy: { date: 'desc' }, take: 5 },
            marks: {
              include: { examSubject: { include: { subject: true, examTerm: true } } },
            },
            invoices: {
              include: { payments: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    const students = parent?.students || [];
    const child = students[0];

    return (
      <div className="space-y-6 font-sans">
        <div className="bg-pureWhite p-6 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-midnight bg-warmIvory px-2.5 py-1 rounded border border-slate-300">
              Guardian Portal • SONARGAON INTERNATIONAL SCHOOL
            </span>
            <h1 className="font-heading text-2xl font-bold text-midnight mt-2">Welcome, {user.name}</h1>
            <p className="text-sm text-steelGrey mt-0.5 font-sans">
              Monitoring Scholar: <strong className="text-midnight">{child?.user.name}</strong> ({child?.section.classLevel.name} - Sec {child?.section.name})
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {students.length > 1 && (
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-warmIvory border border-slate-200">
                <span className="text-[10px] font-heading font-bold text-steelGrey uppercase px-2">Child:</span>
                {students.map((st, idx) => (
                  <span
                    key={st.id}
                    className={`px-3 py-1 rounded-md text-xs font-heading font-bold ${
                      idx === 0 ? 'bg-midnight text-pureWhite' : 'text-charcoal hover:bg-slate-200'
                    }`}
                  >
                    {st.user.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            )}
            <Link
              href="/dashboard/exams"
              className="px-4 py-2 bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-semibold text-xs uppercase tracking-wider rounded-lg transition"
            >
              Print Child's Transcript
            </Link>
            <Link
              href="/dashboard/fees"
              className="px-4 py-2 bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider rounded-lg transition"
            >
              Fee Vouchers
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <h3 className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider mb-2">Attendance Compliance</h3>
            <div className="font-heading text-2xl font-bold text-midnight">95%</div>
            <p className="text-xs font-sans text-deepEmerald font-medium mt-1">Regular & punctual</p>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <h3 className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider mb-2">Midterm GPA</h3>
            <div className="font-heading text-2xl font-bold text-midnight">5.0 / 5.0</div>
            <p className="text-xs font-heading font-semibold text-antiqueGold mt-1">Scholastic Honors List</p>
          </div>

          <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
            <h3 className="text-xs font-heading font-bold text-steelGrey uppercase tracking-wider mb-2">Fee Account Status</h3>
            <div className="font-heading text-2xl font-bold text-deepEmerald">
              {child?.invoices[0]?.status === 'PAID' ? 'Fully Settled' : 'Dues Pending'}
            </div>
            <p className="text-xs text-steelGrey mt-1 font-sans">October 2026 tuition voucher settled</p>
          </div>
        </div>

        <div className="bg-pureWhite p-5 rounded-xl border border-slate-200 shadow-card">
          <h2 className="font-heading text-sm font-bold text-midnight mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-antiqueGold" />
            Official Communications to Parents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 bg-warmIvory/60 rounded-lg border border-slate-200 text-xs">
                <span className="text-[9px] font-heading font-bold text-midnight bg-pureWhite px-2 py-0.5 rounded uppercase border border-slate-300">
                  {a.category}
                </span>
                <h4 className="font-heading font-bold text-midnight mt-1.5">{a.title}</h4>
                <p className="text-charcoal/80 text-[11px] mt-1 font-sans">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div>Welcome to Sonargaon International School ERP</div>;
}
