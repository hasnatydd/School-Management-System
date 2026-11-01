import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { SettingsView } from './SettingsView';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  let settings = await prisma.schoolSetting.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.schoolSetting.create({
      data: {
        id: 'default',
        schoolName: 'Springfield Academy',
        tagline: 'Empowering Minds, Shaping Tomorrow',
        email: 'contact@springfieldacademy.edu',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Springfield, OR',
        academicYear: '2026-2027',
        currency: '$',
      },
    });
  }

  return (
    <SettingsView
      settings={settings as any}
      userRole={user?.role || 'ADMIN'}
    />
  );
}
