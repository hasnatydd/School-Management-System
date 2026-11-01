import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { FeesView } from './FeesView';

export default async function FeesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'STUDENT';

  let invoiceWhere = {};
  if (role === 'STUDENT') {
    invoiceWhere = { student: { userId: user.id } };
  } else if (role === 'PARENT') {
    invoiceWhere = { student: { parent: { userId: user.id } } };
  }

  const invoices = await prisma.feeInvoice.findMany({
    where: invoiceWhere,
    include: {
      student: {
        include: {
          user: true,
          section: {
            include: {
              classLevel: true,
            },
          },
        },
      },
      payments: {
        orderBy: { paymentDate: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
      section: {
        include: {
          classLevel: true,
        },
      },
    },
    orderBy: { rollNumber: 'asc' },
  });

  return (
    <FeesView
      invoices={invoices as any}
      students={students as any}
      userRole={role}
    />
  );
}
