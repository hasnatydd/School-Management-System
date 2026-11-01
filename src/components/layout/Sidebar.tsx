'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Layers,
  CalendarCheck2,
  FileSpreadsheet,
  Receipt,
  Clock,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
  X,
  UserPlus,
  Globe,
  Mail,
  BookOpen,
  FileText,
  Library,
  Bus,
  Wallet,
  Boxes,
  BarChart3,
  MonitorCheck,
  ShieldAlert,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: string;
  userName: string;
  userRoleLabel: string;
  userAvatar?: string | null;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ role, userName, userRoleLabel, userAvatar, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  // Role-based navigation items
  const getNavItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { label: 'ERP Overview', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Admissions Inquiries', href: '/dashboard/admissions', icon: UserPlus },
          { label: 'Contact Messages', href: '/dashboard/messages', icon: Mail },
          { label: 'Student Directory', href: '/dashboard/students', icon: Users },
          { label: 'Faculty & Staff', href: '/dashboard/teachers', icon: UserSquare2 },
          { label: 'Grades & Sections', href: '/dashboard/classes', icon: Layers },
          { label: 'Attendance Sheet', href: '/dashboard/attendance', icon: CalendarCheck2 },
          { label: 'Exams & Reports', href: '/dashboard/exams', icon: FileSpreadsheet },
          { label: 'Fee Management', href: '/dashboard/fees', icon: Receipt },
          { label: 'Class Timetable', href: '/dashboard/timetable', icon: Clock },
          { label: 'Homework & LMS', href: '/dashboard/assignments', icon: BookOpen },
          { label: 'Study Materials', href: '/dashboard/materials', icon: FileText },
          { label: 'Library Management', href: '/dashboard/library', icon: Library },
          { label: 'Transport Management', href: '/dashboard/transport', icon: Bus },
          { label: 'HR & Payroll', href: '/dashboard/payroll', icon: Wallet },
          { label: 'Campus Inventory', href: '/dashboard/inventory', icon: Boxes },
          { label: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
          { label: 'Website CMS', href: '/dashboard/cms', icon: MonitorCheck },
          { label: 'Notice Board', href: '/dashboard/notices', icon: Bell },
          { label: 'Security & Audit Logs', href: '/dashboard/audit', icon: ShieldAlert },
          { label: 'School Settings', href: '/dashboard/settings', icon: Settings },
        ];
      case 'TEACHER':
        return [
          { label: 'Faculty Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Daily Roll-Call', href: '/dashboard/attendance', icon: CalendarCheck2 },
          { label: 'Gradebook Marks Entry', href: '/dashboard/exams', icon: FileSpreadsheet },
          { label: 'Homework & LMS', href: '/dashboard/assignments', icon: BookOpen },
          { label: 'Study Materials', href: '/dashboard/materials', icon: FileText },
          { label: 'Teaching Schedule', href: '/dashboard/timetable', icon: Clock },
          { label: 'Assigned Classes', href: '/dashboard/classes', icon: Layers },
          { label: 'Library Catalog', href: '/dashboard/library', icon: Library },
          { label: 'Staff Leave', href: '/dashboard/payroll', icon: Wallet },
          { label: 'Official Notices', href: '/dashboard/notices', icon: Bell },
        ];
      case 'STUDENT':
        return [
          { label: 'Academic Dashboard', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Homework & Assignments', href: '/dashboard/assignments', icon: BookOpen },
          { label: 'Study Materials', href: '/dashboard/materials', icon: FileText },
          { label: 'Official Transcript & GPA', href: '/dashboard/exams', icon: FileSpreadsheet },
          { label: 'Attendance History', href: '/dashboard/attendance', icon: CalendarCheck2 },
          { label: 'Weekly Timetable', href: '/dashboard/timetable', icon: Clock },
          { label: 'Fee Invoices', href: '/dashboard/fees', icon: Receipt },
          { label: 'Library Catalog', href: '/dashboard/library', icon: Library },
          { label: 'Transport Route', href: '/dashboard/transport', icon: Bus },
          { label: 'School Bulletins', href: '/dashboard/notices', icon: Bell },
        ];
      case 'PARENT':
        return [
          { label: 'Scholar Overview', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Child Homework & Progress', href: '/dashboard/assignments', icon: BookOpen },
          { label: 'Child Report Card', href: '/dashboard/exams', icon: FileSpreadsheet },
          { label: 'Attendance Logs', href: '/dashboard/attendance', icon: CalendarCheck2 },
          { label: 'Class Routine', href: '/dashboard/timetable', icon: Clock },
          { label: 'Fee Vouchers & Receipts', href: '/dashboard/fees', icon: Receipt },
          { label: 'School Bus Route', href: '/dashboard/transport', icon: Bus },
          { label: 'School Bulletins', href: '/dashboard/notices', icon: Bell },
        ];
      default:
        return [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  const roleBadgeColors: Record<string, string> = {
    ADMIN: 'bg-mutedRed/20 text-mutedRed border-mutedRed/30',
    TEACHER: 'bg-deepEmerald/20 text-deepEmerald border-deepEmerald/30',
    STUDENT: 'bg-slate-800 text-slate-300 border-slate-700',
    PARENT: 'bg-amber-950/40 text-warmGold border-antiqueGold/30',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container: Deep Navy */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-midnight text-slate-200 flex flex-col border-r border-deepNavy transition-transform duration-300 ease-in-out lg:translate-x-0 no-print',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-deepNavy bg-midnight">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-10 w-auto px-1.5 py-0.5 rounded-lg bg-pureWhite/95 border border-antiqueGold/40 flex items-center justify-center shadow-subtle flex-shrink-0">
              <img
                src="/logo.png"
                alt="Sonargaon Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <div className="font-heading font-black text-pureWhite text-[11px] tracking-wider uppercase leading-tight truncate">
                SONARGAON
              </div>
              <div className="text-[8.5px] text-warmGold font-semibold tracking-wider uppercase truncate">
                INT'L SCHOOL ERP
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-pureWhite p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="p-4 border-b border-deepNavy/80 bg-deepNavy/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-midnight border border-antiqueGold/40 flex items-center justify-center text-warmGold font-heading font-bold text-sm overflow-hidden flex-shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName?.charAt(0) || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-heading font-bold text-pureWhite truncate">{userName}</div>
              <span
                className={cn(
                  'inline-block px-2 py-0.5 mt-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider border',
                  roleBadgeColors[role] || 'bg-slate-800 text-slate-300'
                )}
              >
                {userRoleLabel || role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-heading font-medium tracking-wide transition group',
                  isActive
                    ? 'bg-antiqueGold text-midnight font-bold shadow-subtle'
                    : 'text-slate-300 hover:bg-deepNavy hover:text-warmGold'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition',
                      isActive ? 'text-midnight' : 'text-slate-400 group-hover:text-warmGold'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-midnight" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer: View Public Portal & Sign Out */}
        <div className="p-3 border-t border-deepNavy bg-midnight space-y-1">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-heading font-semibold text-slate-400 hover:text-warmGold hover:bg-deepNavy transition"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-warmGold" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Live ↗</span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold text-slate-400 hover:text-mutedRed hover:bg-mutedRed/10 transition group"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-mutedRed" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
