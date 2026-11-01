import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { LibraryView } from './LibraryView';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const books = await prisma.libraryBook.findMany({
    include: {
      loans: {
        orderBy: { issueDate: 'desc' },
      },
    },
    orderBy: { title: 'asc' },
  });

  const activeLoans = await prisma.libraryLoan.findMany({
    where: { status: 'ISSUED' },
    include: { book: true },
    orderBy: { dueDate: 'asc' },
  });

  return (
    <LibraryView
      books={JSON.parse(JSON.stringify(books))}
      activeLoans={JSON.parse(JSON.stringify(activeLoans))}
      userRole={role}
      userName={user?.name || ''}
      userIdentifier={user?.identifier || ''}
    />
  );
}
