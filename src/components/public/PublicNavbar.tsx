'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Clock,
  MapPin,
  GraduationCap,
  Sparkles,
  Menu,
  X,
  Search,
  ArrowRight,
} from 'lucide-react';

interface PublicNavbarProps {
  schoolSettings?: {
    schoolName: string;
    tagline: string;
    academicYear: string;
  };
}

export function PublicNavbar({ schoolSettings }: PublicNavbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const name = schoolSettings?.schoolName || 'SONARGAON INTERNATIONAL SCHOOL';
  const tagline = schoolSettings?.tagline || 'Building Character. Inspiring Excellence.';
  const academicYear = schoolSettings?.academicYear || '2026–2027';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Admission', href: '/admissions' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Faculty', href: '/teachers' },
    { label: 'Results', href: '/results' },
    { label: 'Notices', href: '/notices' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-midnight text-slate-300 border-b border-deepNavy/80 py-2 px-4 sm:px-8 text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-heading font-bold uppercase tracking-widest text-[10px] bg-antiqueGold/15 text-warmGold border border-antiqueGold/30 px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3 text-warmGold" /> Admissions AY {academicYear}
            </span>
            <span className="hidden md:inline text-slate-300 font-medium">
              Enrollment Open for Grades 1–10 • Cambridge & National Benchmarks
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-antiqueGold" /> Asia/Dhaka
            </span>
            <span className="text-deepNavy">|</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-antiqueGold" /> Dhaka, Bangladesh
            </span>
            <span className="text-deepNavy">|</span>
            <div className="flex items-center gap-1 font-semibold text-slate-200">
              <span className="text-warmGold">EN</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 hover:text-slate-200 cursor-pointer" title="Bangla localization ready">বাং</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-midnight/95 backdrop-blur-md border-b-2 border-antiqueGold/40 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-auto flex items-center justify-center px-2 py-1 rounded-lg bg-pureWhite/95 border border-antiqueGold/40 shadow-subtle group-hover:border-warmGold transition">
              <img
                src="/logo.png"
                alt="Sonargaon International School Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-heading font-black text-pureWhite text-sm sm:text-base tracking-wider uppercase">
                {name}
              </div>
              <div className="text-[10px] text-warmGold tracking-widest font-semibold uppercase">
                {tagline}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-heading font-semibold tracking-wide text-slate-200">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition py-1 ${
                    isActive
                      ? 'text-warmGold border-b-2 border-antiqueGold font-bold'
                      : 'hover:text-warmGold text-slate-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon Trigger */}
            <Link
              href="/notices"
              className="p-2 text-slate-300 hover:text-warmGold hover:bg-deepNavy rounded-lg transition"
              title="Search Notices & Resources"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Apply Now Primary Button from Reference Image */}
            <Link
              href="/admissions"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition transform hover:-translate-y-0.5"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* ERP Login Button */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-deepNavy hover:bg-midnight text-pureWhite border border-antiqueGold/40 font-heading font-bold text-xs uppercase tracking-wider transition"
            >
              <GraduationCap className="w-3.5 h-3.5 text-warmGold" />
              <span>Portal</span>
            </Link>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-warmGold rounded-lg hover:bg-deepNavy transition"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="xl:hidden bg-deepNavy border-b border-antiqueGold/30 px-6 py-5 space-y-2.5 font-heading font-semibold text-xs tracking-wide">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`block py-1.5 transition ${
                  pathname === item.href ? 'text-warmGold font-bold' : 'text-slate-200 hover:text-warmGold'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-700">
              <Link
                href="/admissions"
                onClick={() => setMobileNavOpen(false)}
                className="block text-warmGold hover:text-antiqueGold py-1 font-bold"
              >
                Online Admissions Desk &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
