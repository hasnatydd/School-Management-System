'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface Props {
  children: React.ReactNode;
  user: {
    name?: string | null;
    role?: string | null;
    email?: string | null;
    identifier?: string | null;
    avatar?: string | null;
  };
}

export function DashboardLayoutClient({ children, user }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || 'STUDENT';
  const userName = user?.name || 'User';
  const userAvatar = user?.avatar;

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        role={role}
        userName={userName}
        userRoleLabel={role}
        userAvatar={userAvatar}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area: Sophisticated light content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header userName={userName} userRole={role} userAvatar={userAvatar} setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
