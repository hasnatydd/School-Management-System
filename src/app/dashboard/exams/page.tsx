import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ExamsView } from './ExamsView';

export default async function ExamsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'STUDENT';

  const terms = await prisma.examTerm.findMany({
    include: {
      examSubjects: {
        include: {
          subject: true,
        },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      section: {
        include: {
          classLevel: true,
        },
      },
    },
    orderBy: { rollNumber: 'asc' },
  });

  const allMarks = await prisma.markRecord.findMany();

  let currentStudentId: string | undefined = undefined;
  if (role === 'STUDENT') {
    const student = await prisma.studentProfile.findFirst({
      where: { userId: user.id },
    });
    currentStudentId = student?.id;
  } else if (role === 'PARENT') {
    const parent = await prisma.parentProfile.findFirst({
      where: { userId: user.id },
      include: { students: true },
    });
    currentStudentId = parent?.students[0]?.id;
  }

  return (
    <ExamsView
      terms={terms as any}
      students={students as any}
      allMarks={allMarks as any}
      userRole={role}
      currentStudentId={currentStudentId}
    />
  );
}
