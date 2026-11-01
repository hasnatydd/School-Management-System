'use client';

import React from 'react';
import { Menu, Bell, Clock } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  userName: string;
  userRole: string;
  userAvatar?: string | null;
  setMobileOpen: (open: boolean) => void;
}

export function Header({ userName, userRole, userAvatar, setMobileOpen }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

  return (
    <header className="h-16 bg-pureWhite border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 no-print shadow-subtle">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-steelGrey hover:text-midnight p-2 rounded-lg hover:bg-warmIvory transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-heading font-semibold text-charcoal bg-warmIvory px-3.5 py-1.5 rounded-md border border-slate-200">
          <img src="/logo.png" alt="Sonargaon Logo" className="h-4 w-auto object-contain" />
          <span>AY 2026–2027</span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-steelGrey font-mono text-[11px]">
            <Clock className="w-3 h-3 text-antiqueGold" />
            {today}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-heading font-semibold text-charcoal hover:text-antiqueGold hover:bg-warmIvory transition"
        >
          Public Portal ↗
        </Link>

        <Link
          href="/dashboard/notices"
          className="relative p-2 text-steelGrey hover:text-antiqueGold hover:bg-warmIvory rounded-lg transition"
          title="Announcements"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mutedRed rounded-full animate-pulse" />
        </Link>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-midnight text-warmGold border border-antiqueGold/40 font-heading font-bold text-xs flex items-center justify-center shadow-subtle overflow-hidden flex-shrink-0">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              userName?.charAt(0) || 'U'
            )}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-heading font-bold text-midnight">{userName}</div>
            <div className="text-[10px] text-steelGrey capitalize font-sans">{userRole.toLowerCase()} Authority</div>
          </div>
        </div>
      </div>
    </header>
  );
}
