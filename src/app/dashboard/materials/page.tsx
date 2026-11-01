import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MaterialsView } from './MaterialsView';

export default async function MaterialsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const materials = await prisma.learningMaterial.findMany({
    include: {
      subject: true,
      section: { include: { classLevel: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } });
  const sections = await prisma.section.findMany({
    include: { classLevel: true },
    orderBy: { name: 'asc' },
  });

  return (
    <MaterialsView
      materials={JSON.parse(JSON.stringify(materials))}
      subjects={JSON.parse(JSON.stringify(subjects))}
      sections={JSON.parse(JSON.stringify(sections))}
      userRole={role}
      userName={user?.name || ''}
    />
  );
}
