import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AttendanceView } from './AttendanceView';

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'STUDENT';

  // Sections with students
  const sections = await prisma.section.findMany({
    include: {
      classLevel: true,
      students: {
        include: { user: true },
        orderBy: { rollNumber: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Today's existing records
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = await prisma.attendanceRecord.findMany({
    where: { date: { gte: today } },
  });

  const existingMap: Record<string, { status: string; remarks?: string }> = {};
  records.forEach((r) => {
    existingMap[r.studentId] = { status: r.status, remarks: r.remarks || undefined };
  });

  // If Student or Parent, fetch student personal history
  let studentHistory: any[] = [];
  if (role === 'STUDENT') {
    studentHistory = await prisma.attendanceRecord.findMany({
      where: { student: { userId: user.id } },
      include: {
        student: { include: { user: true } },
        section: { include: { classLevel: true } },
      },
      orderBy: { date: 'desc' },
      take: 30,
    });
  } else if (role === 'PARENT') {
    studentHistory = await prisma.attendanceRecord.findMany({
      where: { student: { parent: { userId: user.id } } },
      include: {
        student: { include: { user: true } },
        section: { include: { classLevel: true } },
      },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  return (
    <AttendanceView
      sections={sections as any}
      initialSectionId={sections[0]?.id || ''}
      existingRecords={existingMap}
      userRole={role}
      studentHistory={studentHistory as any}
    />
  );
}
