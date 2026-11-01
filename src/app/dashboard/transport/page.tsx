import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { TransportView } from './TransportView';

export default async function TransportPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const routes = await prisma.transportRoute.findMany({
    include: {
      stops: true,
      passengers: {
        include: {
          student: {
            include: {
              user: true,
              section: { include: { classLevel: true } },
            },
          },
        },
      },
    },
    orderBy: { routeName: 'asc' },
  });

  return (
    <TransportView
      routes={JSON.parse(JSON.stringify(routes))}
      userRole={role}
    />
  );
}
