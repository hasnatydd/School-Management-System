import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NoticesView } from './NoticesView';

export default async function NoticesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'STUDENT';

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [{ targetRole: 'ALL' }, { targetRole: role }],
    },
    include: {
      author: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <NoticesView
      announcements={announcements as any}
      userRole={role}
      currentUserId={user?.id || ''}
    />
  );
}
