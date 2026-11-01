import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdmissionsView } from './AdmissionsView';

export default async function AdmissionsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  const inquiries = await prisma.admissionInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdmissionsView
      inquiries={inquiries as any}
      userRole={user?.role || 'ADMIN'}
    />
  );
}
