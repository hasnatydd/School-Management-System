import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { StudentsView } from './StudentsView';

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      section: {
        include: {
          classLevel: true,
        },
      },
      parent: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { rollNumber: 'asc' },
  });

  const sections = await prisma.section.findMany({
    include: {
      classLevel: true,
    },
    orderBy: [
      { classLevel: { order: 'asc' } },
      { name: 'asc' },
    ],
  });

  return (
    <StudentsView
      students={students as any}
      sections={sections as any}
      userRole={user?.role || 'STUDENT'}
    />
  );
}
