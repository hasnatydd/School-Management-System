import React from 'react';
import prisma from '@/lib/prisma';
import { PublicWebsite } from '@/components/public/PublicWebsite';

export default async function HomePage() {
  const [announcements, setting] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        OR: [{ targetRole: 'ALL' }, { targetRole: 'STUDENT' }, { targetRole: 'PARENT' }],
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.schoolSetting.findUnique({
      where: { id: 'default' },
    }),
  ]);

  const schoolSettings = {
    schoolName: setting?.schoolName || 'SONARGAON INTERNATIONAL SCHOOL',
    tagline: setting?.tagline || 'Building Character. Inspiring Excellence.',
    email: setting?.email || 'admissions@sonargaon.edu.bd',
    phone: setting?.phone || '+880 2 8876543',
    address: setting?.address || 'Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh',
    academicYear: setting?.academicYear || '2026-2027',
    currency: setting?.currency || '৳',
    timeZone: setting?.timeZone || 'Asia/Dhaka',
    country: setting?.country || 'Bangladesh',
  };

  return (
    <PublicWebsite
      announcements={announcements as any}
      schoolSettings={schoolSettings}
    />
  );
}
