import React from 'react';
import prisma from '@/lib/prisma';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { PublicFooter } from '@/components/public/PublicFooter';
import { Calendar, User, Bell, Download, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function PublicNoticesPage() {
  const notices = await prisma.announcement.findMany({
    where: {
      OR: [{ targetRole: 'ALL' }, { targetRole: 'PARENT' }, { targetRole: 'STUDENT' }],
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      <PublicNavbar />

      <section className="bg-midnight py-16 sm:py-20 text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-deepNavy border border-antiqueGold/30 text-warmGold text-[11px] font-heading font-bold uppercase tracking-widest">
            Institutional Registry
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Official Notices & Circulars
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
            School-wide announcements, academic circulars, examination schedules, fee notices, and statutory institutional bulletins.
          </p>
        </div>
      </section>

      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-steelGrey/20">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-midnight uppercase">
              <Bell className="w-4 h-4 text-antiqueGold" />
              <span>{notices.length} Active Circulars On Record</span>
            </div>
          </div>

          <div className="space-y-4">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-6 rounded-2xl bg-warmIvory/40 border border-steelGrey/20 hover:border-antiqueGold/60 transition shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-midnight text-pureWhite">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-steelGrey font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-antiqueGold" />
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <span className="text-[10px] text-steelGrey font-mono">
                    Audience: {n.targetRole}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-midnight">{n.title}</h3>

                <p className="text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans whitespace-pre-line">
                  {n.content}
                </p>

                <div className="pt-3 border-t border-steelGrey/15 flex items-center justify-between text-xs text-steelGrey">
                  <span className="flex items-center gap-1.5 font-medium text-midnight">
                    <User className="w-3.5 h-3.5 text-antiqueGold" />
                    Issued by: {n.author.name}
                  </span>
                  <span className="text-antiqueGold font-heading font-bold uppercase text-[10px]">
                    Verified Official Circular
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
