import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { TimetableView } from './TimetableView';

export default async function TimetablePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const slots = await prisma.timetableSlot.findMany({
    include: {
      subject: true,
      teacher: {
        include: {
          user: true,
        },
      },
      section: {
        include: {
          classLevel: true,
        },
      },
    },
  });

  const sections = await prisma.section.findMany({
    include: {
      classLevel: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <TimetableView
      slots={slots as any}
      sections={sections as any}
      userRole={user?.role || 'STUDENT'}
    />
  );
}
