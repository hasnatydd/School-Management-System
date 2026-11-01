import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AuditView } from './AuditView';

export default async function AuditPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AuditView
      auditLogs={JSON.parse(JSON.stringify(auditLogs))}
      userRole={role}
    />
  );
}
