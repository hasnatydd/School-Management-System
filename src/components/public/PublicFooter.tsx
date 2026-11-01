import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface PublicFooterProps {
  schoolSettings?: {
    schoolName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    timeZone: string;
  };
}

export function PublicFooter({ schoolSettings }: PublicFooterProps) {
  const name = schoolSettings?.schoolName || 'SONARGAON INTERNATIONAL SCHOOL';
  const tagline = schoolSettings?.tagline || 'Building Character. Inspiring Excellence.';
  const email = schoolSettings?.email || 'admissions@sonargaon.edu.bd';
  const phone = schoolSettings?.phone || '+880 2 8876543';
  const address = schoolSettings?.address || 'Plot 14, Road 7, Sector 3, Uttara / Banani, Dhaka, Bangladesh';
  const timeZone = schoolSettings?.timeZone || 'Asia/Dhaka';

  return (
    <footer className="bg-midnight py-16 border-t-2 border-antiqueGold/40 text-slate-300 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-auto flex items-center justify-center px-2 py-1 rounded-lg bg-pureWhite/95 border border-antiqueGold/40">
                <img
                  src="/logo.png"
                  alt="Sonargaon International School"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <div className="font-heading font-black text-pureWhite text-base uppercase tracking-wider">
                  {name}
                </div>
                <div className="text-[10px] text-warmGold tracking-widest font-semibold uppercase">
                  {tagline}
                </div>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              An institution of distinction delivering rigorous character education, Cambridge-aligned academic excellence, and international poise for Grades 1 through 10 in Dhaka, Bangladesh.
            </p>

            <div className="text-[11px] text-slate-400 font-mono space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-antiqueGold" />
                <span>Instructional Week: <strong className="text-pureWhite">Sunday – Thursday</strong> (08:30 AM – 01:50 PM)</span>
              </div>
            </div>
          </div>

          {/* Academic Divisions */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-pureWhite uppercase tracking-wider text-[11px]">
              Academic Programs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/academics#primary" className="hover:text-warmGold transition">Primary Wing (Grades 1–5)</Link></li>
              <li><Link href="/academics#junior" className="hover:text-warmGold transition">Junior Secondary (Grades 6–8)</Link></li>
              <li><Link href="/academics#secondary" className="hover:text-warmGold transition">Senior Secondary (Grades 9–10)</Link></li>
              <li><Link href="/academics#calendar" className="hover:text-warmGold transition">Academic Calendar</Link></li>
              <li><Link href="/results" className="hover:text-warmGold transition">Public Results Lookup</Link></li>
            </ul>
          </div>

          {/* Quick Links & Information */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-pureWhite uppercase tracking-wider text-[11px]">
              School Life
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-warmGold transition">About Our School</Link></li>
              <li><Link href="/admissions" className="hover:text-warmGold transition">Admissions Desk</Link></li>
              <li><Link href="/facilities" className="hover:text-warmGold transition">Campus Infrastructure</Link></li>
              <li><Link href="/teachers" className="hover:text-warmGold transition">Faculty & Directorate</Link></li>
              <li><Link href="/gallery" className="hover:text-warmGold transition">Campus Photo Gallery</Link></li>
              <li><Link href="/news" className="hover:text-warmGold transition">News & Articles</Link></li>
              <li><Link href="/notices" className="hover:text-warmGold transition">Notice Board & Circulars</Link></li>
              <li><Link href="/events" className="hover:text-warmGold transition">Upcoming Events</Link></li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-pureWhite uppercase tracking-wider text-[11px]">
              Campus Contact
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-antiqueGold mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-antiqueGold flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-antiqueGold flex-shrink-0" />
                <span>{email}</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-deepNavy border border-antiqueGold/40 text-warmGold hover:bg-midnight transition text-[11px] font-heading font-bold"
                >
                  Contact Desk &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Demonstration Notice */}
        <div className="pt-8 border-t border-deepNavy flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 {name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/faq" className="hover:text-warmGold">FAQ</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-warmGold">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-warmGold">Terms & Conditions</Link>
          </div>
          <div className="text-slate-500 italic text-[10px]">
            Demonstration Content — All identities and records are simulated for enterprise product demonstration.
          </div>
        </div>
      </div>
    </footer>
  );
}
