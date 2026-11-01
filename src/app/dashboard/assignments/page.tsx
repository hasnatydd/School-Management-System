import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AssignmentsView } from './AssignmentsView';

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  let assignments: any[] = [];
  let subjects: any[] = [];
  let sections: any[] = [];

  if (role === 'STUDENT' && user?.sectionId) {
    assignments = await prisma.assignment.findMany({
      where: { sectionId: user.sectionId },
      include: {
        subject: true,
        section: { include: { classLevel: true } },
        teacher: { include: { user: true } },
        submissions: {
          where: { studentId: user.studentProfileId || '' },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  } else if (role === 'TEACHER' && user?.teacherProfileId) {
    assignments = await prisma.assignment.findMany({
      where: { teacherId: user.teacherProfileId },
      include: {
        subject: true,
        section: { include: { classLevel: true } },
        teacher: { include: { user: true } },
        submissions: {
          include: { student: { include: { user: true } } },
        },
      },
      orderBy: { dueDate: 'desc' },
    });

    subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } });
    sections = await prisma.section.findMany({
      include: { classLevel: true },
      orderBy: { name: 'asc' },
    });
  } else {
    // Admin & Parent
    assignments = await prisma.assignment.findMany({
      include: {
        subject: true,
        section: { include: { classLevel: true } },
        teacher: { include: { user: true } },
        submissions: {
          include: { student: { include: { user: true } } },
        },
      },
      orderBy: { dueDate: 'desc' },
    });

    subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } });
    sections = await prisma.section.findMany({
      include: { classLevel: true },
      orderBy: { name: 'asc' },
    });
  }

  return (
    <AssignmentsView
      assignments={JSON.parse(JSON.stringify(assignments))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      sections={JSON.parse(JSON.stringify(sections))}
      userRole={role}
      userId={user?.id || ''}
      studentProfileId={user?.studentProfileId || null}
      teacherProfileId={user?.teacherProfileId || null}
      userName={user?.name || ''}
    />
  );
}
