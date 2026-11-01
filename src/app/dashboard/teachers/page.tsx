import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { TeachersView } from './TeachersView';

export default async function TeachersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      classTeacherOf: {
        include: {
          classLevel: true,
        },
      },
      assignedSubjects: {
        include: {
          subject: true,
          section: {
            include: {
              classLevel: true,
            },
          },
        },
      },
    },
    orderBy: { employeeId: 'asc' },
  });

  return (
    <TeachersView
      teachers={teachers as any}
      userRole={user?.role || 'TEACHER'}
    />
  );
}
