import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { InventoryView } from './InventoryView';

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const role = user?.role || 'ADMIN';

  const items = await prisma.inventoryItem.findMany({
    include: {
      transactions: {
        orderBy: { transactionDate: 'desc' },
      },
    },
    orderBy: { itemName: 'asc' },
  });

  return (
    <InventoryView
      items={JSON.parse(JSON.stringify(items))}
      userRole={role}
    />
  );
}
