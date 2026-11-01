import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ClassesView } from './ClassesView';

export default async function ClassesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const classes = await prisma.classLevel.findMany({
    include: {
      sections: {
        include: {
          classTeacher: {
            include: {
              user: true,
            },
          },
          students: true,
        },
      },
      subjects: true,
    },
    orderBy: { order: 'asc' },
  });

  return (
    <ClassesView
      classes={classes as any}
      userRole={user?.role || 'ADMIN'}
    />
  );
}
