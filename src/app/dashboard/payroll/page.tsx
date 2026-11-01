import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PayrollView } from './PayrollView';

export default async function PayrollPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const payrollRecords = await prisma.payrollRecord.findMany({
    orderBy: { paymentDate: 'desc' },
  });

  const staffLeaves = await prisma.staffLeave.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <PayrollView
      payrollRecords={JSON.parse(JSON.stringify(payrollRecords))}
      staffLeaves={JSON.parse(JSON.stringify(staffLeaves))}
      departments={JSON.parse(JSON.stringify(departments))}
      userRole={role}
      userId={user?.id || ''}
      userName={user?.name || ''}
    />
  );
}
