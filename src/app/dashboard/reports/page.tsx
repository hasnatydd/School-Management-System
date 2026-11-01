import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ReportsView } from './ReportsView';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  // 1. Academic marks
  const markRecords = await prisma.markRecord.findMany({
    include: {
      student: { include: { user: true, section: { include: { classLevel: true } } } },
      examSubject: { include: { subject: true, examTerm: true } },
    },
  });

  // 2. Financial invoices
  const invoices = await prisma.feeInvoice.findMany({
    include: {
      student: { include: { user: true, section: { include: { classLevel: true } } } },
      payments: true,
    },
  });

  // 3. Attendance
  const attendanceRecords = await prisma.attendanceRecord.findMany({
    include: {
      student: { include: { user: true } },
      section: { include: { classLevel: true } },
    },
  });

  // 4. Students & Teachers count
  const studentCount = await prisma.studentProfile.count();
  const teacherCount = await prisma.teacherProfile.count();
  const classCount = await prisma.classLevel.count();
  const inquiryCount = await prisma.admissionInquiry.count();

  return (
    <ReportsView
      markRecords={JSON.parse(JSON.stringify(markRecords))}
      invoices={JSON.parse(JSON.stringify(invoices))}
      attendanceRecords={JSON.parse(JSON.stringify(attendanceRecords))}
      stats={{
        studentCount,
        teacherCount,
        classCount,
        inquiryCount,
      }}
      userRole={role}
    />
  );
}
