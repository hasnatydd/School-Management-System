import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CMSView } from './CMSView';

export default async function CMSPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const cmsItems = await prisma.websiteCMS.findMany({
    orderBy: { sectionKey: 'asc' },
  });

  return (
    <CMSView
      cmsItems={JSON.parse(JSON.stringify(cmsItems))}
      userRole={role}
    />
  );
}
