'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Send,
  AlertCircle,
  Check,
  Star,
  Quote,
  Play,
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Bell,
} from 'lucide-react';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { submitAdmissionInquiry } from '@/app/actions/school-actions';
import { formatDate } from '@/lib/utils';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface PublicWebsiteProps {
  announcements: AnnouncementItem[];
  schoolSettings: {
    schoolName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    academicYear: string;
    currency: string;
    timeZone: string;
    country: string;
  };
}

export function PublicWebsite({ announcements, schoolSettings }: PublicWebsiteProps) {
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryAppNum, setInquiryAppNum] = useState('');
  const [inquiryError, setInquiryError] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError('');
    setInquirySuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await submitAdmissionInquiry(formData);

    if (res.success) {
      setInquirySuccess(true);
      setInquiryAppNum(res.applicationNumber || '');
      (e.target as HTMLFormElement).reset();
    } else {
      setInquiryError(res.error || 'Failed to submit application. Please check your inputs.');
    }
    setInquirySubmitting(false);
  };

  return (
    <div className="min-h-screen bg-warmIvory text-charcoal flex flex-col font-sans selection:bg-antiqueGold selection:text-midnight">
      {/* 1. Premium Navigation Bar */}
      <PublicNavbar schoolSettings={schoolSettings} />

      {/* 2. Hero Section & Campus Photography (Exact Reference Layout) */}
      <section className="relative overflow-hidden bg-midnight text-pureWhite border-b border-antiqueGold/30">
        <div className="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          {/* Carousel Arrows */}
          <button 
            type="button" 
            aria-label="Previous slide"
            className="hidden xl:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-deepNavy/90 hover:bg-midnight border border-white/20 text-white items-center justify-center transition shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            type="button" 
            aria-label="Next slide"
            className="hidden xl:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-deepNavy/90 hover:bg-midnight border border-white/20 text-white items-center justify-center transition shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 z-10">
              <div className="text-warmGold text-xs sm:text-sm font-heading font-extrabold tracking-[0.25em] uppercase">
                WELCOME TO
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl lg:text-4xl xl:text-5xl font-black text-pureWhite tracking-tight uppercase leading-[1.1]">
                SONARGAON <br className="hidden sm:inline" />
                INTERNATIONAL SCHOOL
              </h1>

              <div className="font-serif italic text-warmGold text-lg sm:text-2xl font-medium tracking-wide">
                Building Character. Inspiring Excellence.
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans font-normal leading-relaxed max-w-xl">
                A premier educational institution in Bangladesh, dedicated to academic excellence and holistic development.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/admissions"
                  className="px-5 py-2.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#campus-tour"
                  className="px-4 py-2.5 rounded-full bg-deepNavy/80 hover:bg-deepNavy text-pureWhite font-heading font-semibold text-xs tracking-wider border border-white/30 transition flex items-center gap-2"
                >
                  <Play className="w-3 h-3 fill-warmGold text-warmGold" />
                  <span>Watch Our Campus</span>
                </a>
              </div>
            </div>

            {/* Right Campus Building Photography */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-antiqueGold/40 shadow-2xl">
                <img
                  src="/images/campus-building.jpg"
                  alt="Sonargaon International School Campus Building"
                  className="w-full h-[280px] sm:h-[360px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-transparent" />
              </div>

              {/* Carousel Indicators */}
              <div className="flex items-center justify-end gap-1.5 mt-2.5 pr-2">
                <span className="w-6 h-2 rounded-full bg-warmGold" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
                <span className="w-2 h-2 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Pillars Ribbon Bar (Exact Reference Mockup) */}
      <section className="bg-midnight border-b border-antiqueGold/30 text-pureWhite py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-antiqueGold/30 text-center">
            <div className="flex items-center justify-center gap-3 py-2 md:py-1 px-4">
              <div className="p-2 rounded-lg bg-deepNavy border border-antiqueGold/30 text-warmGold">
                <GraduationCap className="w-5 h-5 text-warmGold" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-pureWhite leading-tight">Academic</div>
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-warmGold leading-tight">Excellence</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 md:py-1 px-4">
              <div className="p-2 rounded-lg bg-deepNavy border border-antiqueGold/30 text-warmGold">
                <Trophy className="w-5 h-5 text-warmGold" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-pureWhite leading-tight">Experienced</div>
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-warmGold leading-tight">Faculty</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 md:py-1 px-4">
              <div className="p-2 rounded-lg bg-deepNavy border border-antiqueGold/30 text-warmGold">
                <Building2 className="w-5 h-5 text-warmGold" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-pureWhite leading-tight">Modern</div>
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-warmGold leading-tight">Campus</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 md:py-1 px-4">
              <div className="p-2 rounded-lg bg-deepNavy border border-antiqueGold/30 text-warmGold">
                <Users className="w-5 h-5 text-warmGold" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-pureWhite leading-tight">Supportive</div>
                <div className="font-heading font-bold text-xs uppercase tracking-wider text-warmGold leading-tight">Community</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three-Card Section (About Principal + Latest Notices + Upcoming Events) */}
      <section className="py-12 bg-warmIvory border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Card 1: About Our School / Principal */}
            <div className="lg:col-span-5 bg-pureWhite rounded-2xl border border-steelGrey/20 p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-28 sm:w-32 h-40 rounded-xl overflow-hidden border-2 border-antiqueGold/40 flex-shrink-0 bg-slate-100 shadow-sm">
                <img
                  src="/images/people/principal.jpg"
                  alt="Dr. Mansur Ali Chowdhury - Principal"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 text-left flex-1">
                <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-antiqueGold flex items-center gap-1.5">
                  <span className="w-3.5 h-0.5 bg-antiqueGold" />
                  ABOUT OUR SCHOOL
                </div>
                <h3 className="font-heading font-bold text-lg text-midnight tracking-tight">
                  A Tradition of Excellence
                </h3>
                <p className="text-[11px] text-charcoal leading-relaxed font-sans">
                  Sonargaon International School is committed to providing quality education, fostering creativity and building strong values for a brighter future.
                </p>
                <div className="pt-0.5">
                  <div className="font-serif italic font-bold text-midnight text-xs">Dr. Mansur Ali Chowdhury</div>
                  <div className="text-[10px] text-steelGrey uppercase tracking-wider">Principal</div>
                </div>
                <div className="pt-1.5">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-[11px] uppercase tracking-wider shadow-sm transition"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Latest Notices */}
            <div className="lg:col-span-3 bg-pureWhite rounded-2xl border border-steelGrey/20 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-warmGold" />
                    <h3 className="font-heading font-bold text-xs text-midnight uppercase tracking-wider">Latest Notices</h3>
                  </div>
                  <Link href="/notices" className="text-[10px] font-heading font-semibold text-antiqueGold hover:text-warmGold">
                    View All &rarr;
                  </Link>
                </div>

                <div className="space-y-2.5 pt-3">
                  {[
                    { date: 'Oct 30', title: 'Admission Open for 2027', desc: 'Apply Now and be a part of our family.' },
                    { date: 'Oct 28', title: 'Annual Sports Day', desc: 'Next Friday at School Playground.' },
                    { date: 'Oct 25', title: 'Exam Routine Published', desc: 'Check your schedule from the portal.' },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href="/notices"
                      className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold uppercase leading-none">{item.date.split(' ')[0]}</span>
                        <span className="text-xs font-black leading-none mt-0.5">{item.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading font-bold text-[11px] text-midnight group-hover:text-antiqueGold transition truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-antiqueGold self-center" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Upcoming Events */}
            <div className="lg:col-span-4 bg-pureWhite rounded-2xl border border-steelGrey/20 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-warmGold" />
                    <h3 className="font-heading font-bold text-xs text-midnight uppercase tracking-wider">Upcoming Events</h3>
                  </div>
                  <Link href="/events" className="text-[10px] font-heading font-semibold text-antiqueGold hover:text-warmGold">
                    View All &rarr;
                  </Link>
                </div>

                <div className="space-y-2.5 pt-3">
                  {[
                    { date: 'Nov 05', title: 'Science Fair', desc: 'Showcase your ideas.' },
                    { date: 'Nov 12', title: 'Parent-Teacher Meeting', desc: "Discuss your child's progress." },
                    { date: 'Nov 20', title: 'Annual Result Day', desc: 'Celebrate the success.' },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href="/events"
                      className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-bold uppercase leading-none">{item.date.split(' ')[0]}</span>
                        <span className="text-xs font-black leading-none mt-0.5">{item.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading font-bold text-[11px] text-midnight group-hover:text-antiqueGold transition truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-antiqueGold self-center" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statistics Ribbon & Academic Programs Banner (Exact Reference Mockup) */}
      <section className="bg-midnight border-y-2 border-antiqueGold/40 text-pureWhite py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Stats with Laurel Trophy */}
            <div className="lg:col-span-5 flex items-center gap-5 divide-x divide-antiqueGold/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-full bg-deepNavy border border-antiqueGold/40 text-warmGold shadow-sm">
                  <Trophy className="w-6 h-6 text-warmGold" />
                </div>
                <div>
                  <div className="font-heading font-black text-xl text-pureWhite">10K+</div>
                  <div className="text-[9px] text-slate-300 uppercase tracking-wider">Happy Students</div>
                </div>
              </div>

              <div className="pl-5">
                <div className="font-heading font-black text-xl text-pureWhite">500+</div>
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">Alumni</div>
              </div>

              <div className="pl-5">
                <div className="font-heading font-black text-xl text-pureWhite">25+</div>
                <div className="text-[9px] text-slate-300 uppercase tracking-wider">Years of Excellence</div>
              </div>
            </div>

            {/* Center: Our Academic Programs */}
            <div className="lg:col-span-4 flex items-center justify-between gap-3 bg-deepNavy/80 border border-antiqueGold/30 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-midnight text-warmGold border border-antiqueGold/30">
                  <BookOpen className="w-4 h-4 text-warmGold" />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs uppercase tracking-wider text-pureWhite">
                    Our Academic Programs
                  </div>
                  <div className="text-[10px] text-slate-300">From Primary to Higher Secondary</div>
                </div>
              </div>
              <Link
                href="/academics"
                className="px-2.5 py-1.5 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-[10px] uppercase tracking-wider shadow-sm transition whitespace-nowrap"
              >
                Explore Programs &rarr;
              </Link>
            </div>

            {/* Right: Students Group Photo */}
            <div className="lg:col-span-3">
              <div className="h-14 rounded-lg overflow-hidden border border-antiqueGold/40 shadow-md">
                <img
                  src="/images/students-group.jpg"
                  alt="Sonargaon International School Students"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. School Introduction & 8. About Our School */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-antiqueGold">
                <span className="w-8 h-0.5 bg-antiqueGold" />
                <span>Institutional Heritage & Philosophy</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight leading-snug">
                Fostering Moral Fortitude, Analytical Acumen, and Global Preparedness
              </h2>
              <p className="text-sm sm:text-base text-charcoal leading-relaxed font-sans">
                Sonargaon International School was founded on the conviction that genuine education synthesizes uncompromising intellectual rigor with principled character. Located in the diplomatic and educational heart of Dhaka, Bangladesh, we cultivate critical inquiry, linguistic fluency in English and Bangla, and lifelong ethical leadership.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  'Cambridge International standards combined with deep cultural grounding in Bangladesh history and heritage.',
                  'Rigorous laboratory sciences, advanced mathematics, and computational robotics from primary grades.',
                  'Comprehensive physical conditioning, competitive debate, and character mentoring under Oxford and BUET accredited faculty.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-deepEmerald/15 text-deepEmerald flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-charcoal font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-midnight hover:bg-deepNavy text-pureWhite font-heading font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>Read Complete School History</span>
                  <ArrowRight className="w-4 h-4 text-antiqueGold" />
                </Link>
              </div>
            </div>

            {/* Architecture Photography Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-antiqueGold/40 shadow-elevated">
                <img
                  src="/images/campus-building.jpg"
                  alt="Modern Campus Facade"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/30 to-transparent flex items-end p-6">
                  <div className="text-pureWhite space-y-1">
                    <div className="font-heading font-bold text-sm text-warmGold uppercase tracking-wider">
                      Academic Campus Infrastructure
                    </div>
                    <div className="text-xs text-slate-300">
                      Sprawling modern laboratories, climate-controlled smart classrooms, and international athletic facilities.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Principal's Message */}
      <section className="py-20 bg-warmIvory/60 border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-pureWhite rounded-2xl border border-steelGrey/20 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="w-36 h-36 rounded-2xl bg-midnight border-4 border-antiqueGold/60 overflow-hidden shadow-elevated flex items-center justify-center">
                <img
                  src="/images/people/principal.jpg"
                  alt="Dr. Mansur Ali Chowdhury - Principal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-midnight uppercase">Dr. Mansur Ali Chowdhury</h3>
                <p className="text-xs text-antiqueGold font-heading font-bold uppercase tracking-wider">
                  Director of Academics & Principal
                </p>
                <p className="text-[11px] text-steelGrey mt-0.5">Ph.D. (Curriculum Design), M.Ed. (Excellence in Leadership)</p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 font-sans">
              <div className="flex items-center gap-2 text-antiqueGold">
                <Quote className="w-8 h-8" />
                <span className="font-heading font-bold uppercase tracking-widest text-xs text-midnight">
                  Principal's Executive Address
                </span>
              </div>
              <blockquote className="text-sm sm:text-base text-charcoal leading-relaxed italic border-l-4 border-antiqueGold pl-4">
                "At Sonargaon International School, we do not view education merely as the transmission of factual knowledge; we regard it as the deliberate cultivation of the human spirit. Our scholars are taught that intellect without virtue is incomplete. Every lesson in our classrooms, laboratories, and playing fields is structured to instill moral integrity, disciplined stamina, and the courage to lead with empathy."
              </blockquote>
              <p className="text-xs text-steelGrey leading-relaxed">
                We take immense pride in our Cambridge assessment records, our championship-winning parliamentary debate societies, and our inclusive, respectful scholastic community. We invite you to experience the Sonargaon difference.
              </p>
              <div className="pt-2">
                <Link
                  href="/about#principal"
                  className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold inline-flex items-center gap-1.5 transition"
                >
                  Read Full Executive Message & Governance &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Academic Programs (Primary, Junior Secondary, Secondary) */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
              Curricular Continuum
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight uppercase">
              Academic Wings (Grades 1 through 10)
            </h2>
            <p className="text-sm text-steelGrey font-sans">
              Structured developmental tiers aligned to international benchmarks, preparing scholars for lifelong distinction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Wing */}
            <div className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 p-6 flex flex-col justify-between hover:border-antiqueGold/60 transition shadow-sm group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-midnight text-warmGold flex items-center justify-center font-heading font-bold text-sm shadow-subtle group-hover:bg-deepNavy transition">
                  G 1–5
                </div>
                <h3 className="font-heading text-xl font-bold text-midnight">Primary Wing (Grades 1–5)</h3>
                <p className="text-xs text-charcoal leading-relaxed font-sans">
                  Foundational mastery in bilingual literacy, conceptual mathematics, nature science, and creative arts. Small class sizes ensure intimate guidance and habituation of curiosity.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-steelGrey font-medium">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Singapore Mathematics Concepts</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Phonics & Creative Composition</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Moral Science & Physical Play</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-steelGrey/20">
                <Link href="/academics#primary" className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold flex items-center justify-between">
                  <span>Explore Primary Curriculum</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Junior Secondary Wing */}
            <div className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 p-6 flex flex-col justify-between hover:border-antiqueGold/60 transition shadow-sm group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-midnight text-warmGold flex items-center justify-center font-heading font-bold text-sm shadow-subtle group-hover:bg-deepNavy transition">
                  G 6–8
                </div>
                <h3 className="font-heading text-xl font-bold text-midnight">Junior Secondary (Grades 6–8)</h3>
                <p className="text-xs text-charcoal leading-relaxed font-sans">
                  Transition to rigorous departmental disciplines with laboratory sciences, parliamentary public speaking, pre-algebra, world history, and computer algorithm design.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-steelGrey font-medium">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Dedicated Physics & Chemistry Labs</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Parliamentary Debate & Essay Writing</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Computer Coding & Robotics</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-steelGrey/20">
                <Link href="/academics#junior" className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold flex items-center justify-between">
                  <span>Explore Middle School</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Secondary Wing */}
            <div className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 p-6 flex flex-col justify-between hover:border-antiqueGold/60 transition shadow-sm group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-midnight text-warmGold flex items-center justify-center font-heading font-bold text-sm shadow-subtle group-hover:bg-deepNavy transition">
                  G 9–10
                </div>
                <h3 className="font-heading text-xl font-bold text-midnight">Senior Secondary (Grades 9–10)</h3>
                <p className="text-xs text-charcoal leading-relaxed font-sans">
                  Comprehensive preparation for Cambridge International IGCSE and National standards in Science, Commerce, and Humanities with full mock exam protocols and university guidance.
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-steelGrey font-medium">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Advanced Mathematics & Pure Sciences</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Economics, Accounting & Business</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-deepEmerald" /> Pre-University Scholastic Counseling</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-steelGrey/20">
                <Link href="/academics#secondary" className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold flex items-center justify-between">
                  <span>Explore Secondary Wing</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Why Choose Our School & 15. School Statistics */}
      <section className="py-20 bg-midnight text-pureWhite border-b-2 border-antiqueGold/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-heading font-bold text-warmGold tracking-widest uppercase">
                Institutional Distinctions
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-pureWhite tracking-tight uppercase leading-snug">
                Why Discerning Families Choose Sonargaon
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Uncompromised Cambridge Assessment Results',
                    desc: 'Year-on-year 100% distinction pass rate across Mathematics, Pure Sciences, and English Language examinations.',
                  },
                  {
                    title: 'Holistic Character Formation & Ethical Discipline',
                    desc: 'Honor codes, mutual respect, and community volunteering embedded into weekly co-curricular schedules.',
                  },
                  {
                    title: 'Air-Conditioned Campus with Digital Safety Protocols',
                    desc: 'Secure RFID attendance tracking, 24/7 CCTV surveillance, and verified security fleet transport across Dhaka.',
                  },
                  {
                    title: 'Integrated Enterprise ERP & Parent Mobile Visibility',
                    desc: 'Real-time roll-call attendance alerts, digital fee payment vouchers, and instant gradebook review from your portal.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-deepNavy/80 border border-antiqueGold/30 space-y-1">
                    <h4 className="font-heading font-bold text-warmGold text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* School Statistics */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-deepNavy border border-antiqueGold/40 text-center space-y-2 shadow-elevated">
                <div className="font-heading font-black text-4xl text-warmGold">25+</div>
                <div className="font-heading font-bold text-xs uppercase text-pureWhite tracking-wider">Years of Heritage</div>
                <p className="text-[11px] text-slate-400">Founded on academic excellence & moral leadership</p>
              </div>

              <div className="p-6 rounded-2xl bg-deepNavy border border-antiqueGold/40 text-center space-y-2 shadow-elevated">
                <div className="font-heading font-black text-4xl text-pureWhite">1:12</div>
                <div className="font-heading font-bold text-xs uppercase text-pureWhite tracking-wider">Teacher Ratio</div>
                <p className="text-[11px] text-slate-400">Intimate guidance and personalized scholar mentorship</p>
              </div>

              <div className="p-6 rounded-2xl bg-deepNavy border border-antiqueGold/40 text-center space-y-2 shadow-elevated">
                <div className="font-heading font-black text-4xl text-pureWhite">100%</div>
                <div className="font-heading font-bold text-xs uppercase text-pureWhite tracking-wider">Pass Rate</div>
                <p className="text-[11px] text-slate-400">Flawless achievement across all term examinations</p>
              </div>

              <div className="p-6 rounded-2xl bg-deepNavy border border-antiqueGold/40 text-center space-y-2 shadow-elevated">
                <div className="font-heading font-black text-4xl text-warmGold">10</div>
                <div className="font-heading font-bold text-xs uppercase text-pureWhite tracking-wider">Grade Tiers</div>
                <p className="text-[11px] text-slate-400">Complete Grade 1 through Grade 10 continuum</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Campus Facilities */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
                Infrastructure
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight uppercase">
                World-Class Campus Facilities
              </h2>
              <p className="text-sm text-steelGrey font-sans">
                Designed to stimulate analytical inquiry, athletic fortitude, and creative mastery.
              </p>
            </div>
            <Link
              href="/facilities"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight hover:bg-deepNavy text-pureWhite text-xs font-heading font-bold uppercase rounded-lg transition"
            >
              <span>View All Facilities</span>
              <ArrowRight className="w-3.5 h-3.5 text-antiqueGold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'STEM & Robotics Lab',
                img: '/images/stem-lab.jpg',
                desc: 'Equipped with microcontrollers, 3D prototyping tools, and advanced algorithmic programming suites.',
              },
              {
                title: 'Academic Scholars',
                img: '/images/students-group.jpg',
                desc: 'Dedicated seminar rooms, smart classrooms, and collaborative study groups fostering academic discipline.',
              },
              {
                title: 'Central Scholastic Library',
                img: '/images/library-students.jpg',
                desc: 'Over 15,000 academic titles, reference journals, research computers, and silent study carrels.',
              },
              {
                title: 'Astroturf Athletics Complex',
                img: '/images/sports-students.jpg',
                desc: 'All-weather football pitch, basketball court, badminton pavilion, and physical training zone.',
              },
            ].map((f, idx) => (
              <div key={idx} className="bg-warmIvory/40 rounded-xl overflow-hidden border border-steelGrey/20 hover:border-antiqueGold/50 transition shadow-sm group">
                <div className="h-44 overflow-hidden relative">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-heading font-bold text-midnight text-sm">{f.title}</h4>
                  <p className="text-xs text-steelGrey font-sans leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Latest Notices & 13. Upcoming Events */}
      <section className="py-20 bg-warmIvory/60 border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Notices */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-steelGrey/20">
                <div className="space-y-1">
                  <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">Bulletins</span>
                  <h3 className="font-heading text-2xl font-bold text-midnight uppercase">Latest Notices & Circulars</h3>
                </div>
                <Link href="/notices" className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold flex items-center gap-1">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3.5">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-4 rounded-xl bg-pureWhite border border-steelGrey/20 shadow-sm space-y-1.5 hover:border-antiqueGold/40 transition">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-heading font-bold uppercase px-2 py-0.5 rounded bg-warmIvory text-midnight border border-steelGrey/20">
                        {a.category}
                      </span>
                      <span className="text-steelGrey font-mono">{formatDate(a.createdAt)}</span>
                    </div>
                    <h4 className="font-heading font-bold text-midnight text-sm">{a.title}</h4>
                    <p className="text-xs text-charcoal/80 font-sans line-clamp-2">{a.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-steelGrey/20">
                <div className="space-y-1">
                  <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">Calendar</span>
                  <h3 className="font-heading text-2xl font-bold text-midnight uppercase">Upcoming School Events</h3>
                </div>
                <Link href="/events" className="text-xs font-heading font-bold text-midnight hover:text-antiqueGold flex items-center gap-1">
                  Calendar &rarr;
                </Link>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    title: 'Annual Inter-School Science & Robotics Fair',
                    date: 'Nov 18, 2026',
                    time: '09:00 AM – 03:30 PM',
                    venue: 'Central Auditorium & STEM Pavilion',
                  },
                  {
                    title: 'Midterm Parent-Teacher Academic Conference',
                    date: 'Nov 24, 2026',
                    time: '08:30 AM – 01:00 PM',
                    venue: 'Main Academic Wing, Floor 2',
                  },
                  {
                    title: 'Winter Track & Field Athletics Meet 2026',
                    date: 'Dec 05, 2026',
                    time: '08:00 AM – 02:00 PM',
                    venue: 'Astroturf Athletics Complex',
                  },
                ].map((ev, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-pureWhite border border-steelGrey/20 shadow-sm flex items-start gap-4 hover:border-antiqueGold/40 transition">
                    <div className="p-2.5 rounded-lg bg-midnight text-warmGold text-center font-heading font-bold flex-shrink-0 w-16">
                      <Calendar className="w-4 h-4 mx-auto mb-1 text-antiqueGold" />
                      <div className="text-[10px] leading-tight uppercase font-mono">{ev.date.split(',')[0]}</div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-midnight text-sm">{ev.title}</h4>
                      <div className="text-[11px] text-steelGrey flex items-center gap-2 font-sans">
                        <span>{ev.time}</span>
                        <span>•</span>
                        <span>{ev.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Student Achievements */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
              Scholastic Honors
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight uppercase">
              Distinguished Scholar Achievements
            </h2>
            <p className="text-sm text-steelGrey font-sans">
              Celebrating exceptional distinction in international Olympiads, debate championships, and Cambridge accolades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'National Math Olympiad Champions',
                student: 'Tahmid Mahmud & Grade 10 Team',
                badge: 'Gold Medal',
                desc: 'Secured 1st place in the Bangladesh National Mathematics Olympiad (Senior Division) with full marks in advanced geometry.',
              },
              {
                title: 'International Cambridge Top in Country',
                student: 'Zareen Anjum (Grade 10)',
                badge: 'Cambridge Award',
                desc: 'Recognized by Cambridge Assessment International Education for the highest score nationally in Additional Mathematics.',
              },
              {
                title: 'Inter-School Parliamentary Debate Gala',
                student: 'Sonargaon Senior Debate Society',
                badge: 'Champions Trophy',
                desc: 'Emerging victorious undefeated against leading Dhaka international schools on ethics in emerging artificial intelligence.',
              },
            ].map((ach, idx) => (
              <div key={idx} className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 p-6 space-y-3 shadow-sm hover:border-antiqueGold/50 transition">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-antiqueGold/15 text-antiqueGold border border-antiqueGold/30 text-[10px] font-heading font-bold uppercase">
                  <Trophy className="w-3.5 h-3.5" /> {ach.badge}
                </div>
                <h3 className="font-heading font-bold text-midnight text-base">{ach.title}</h3>
                <div className="text-xs font-heading font-semibold text-deepEmerald">{ach.student}</div>
                <p className="text-xs text-charcoal/80 leading-relaxed font-sans">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Photo Gallery Preview */}
      <section className="py-20 bg-warmIvory/60 border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
                Life at Sonargaon
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight uppercase">
                Photo Gallery Preview
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight hover:bg-deepNavy text-pureWhite text-xs font-heading font-bold uppercase rounded-lg transition"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 text-antiqueGold" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'STEM & Robotics Lab', img: '/images/stem-lab.jpg' },
              { title: 'Academic Scholars', img: '/images/students-group.jpg' },
              { title: 'Track & Field Meet', img: '/images/sports-students.jpg' },
              { title: 'Scholastic Library', img: '/images/library-students.jpg' },
            ].map((g, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-steelGrey/20 h-52 relative group">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-pureWhite font-heading font-bold text-xs uppercase">{g.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17. Parent Testimonials */}
      <section className="py-20 bg-pureWhite border-b border-steelGrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-heading font-bold text-antiqueGold tracking-widest uppercase">
              Guardian Endorsements
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight uppercase">
              What Parents Say About Sonargaon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Tareq Mahmud',
                role: 'Managing Director, Father of Grade 10 Scholar',
                avatar: '/images/people/parent-tareq.jpg',
                comment:
                  'The transformation in our son over the past four years has been remarkable. His Cambridge preparation was second to none, but what truly impresses us is his moral discipline, manners, and confidence in public speaking.',
              },
              {
                name: 'Dr. Samira Khan',
                role: 'Consultant Surgeon, Mother of Grade 8 Scholar',
                avatar: '/images/people/parent-samira.jpg',
                comment:
                  'Finding a school in Dhaka that balances modern science laboratories with genuine respect for our cultural values is rare. Sonargaon has exceeded our expectations in every academic term.',
              },
              {
                name: 'Barrister Rafiqul Islam',
                role: 'Supreme Court Advocate, Father of Grade 6 Scholar',
                avatar: '/images/people/parent-rafiqul.jpg',
                comment:
                  'The ERP system provides complete visibility into attendance and grades, and the faculty mentorship is exceptional. The teachers know our child individually and support his interests wholeheartedly.',
              },
            ].map((t, idx) => (
              <div key={idx} className="bg-warmIvory/50 rounded-2xl border border-steelGrey/20 p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3 font-sans">
                  <div className="flex items-center gap-1 text-antiqueGold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-antiqueGold text-antiqueGold" />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="pt-4 border-t border-steelGrey/20 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-antiqueGold/50 shadow-subtle flex-shrink-0"
                  />
                  <div>
                    <div className="font-heading font-bold text-midnight text-sm">{t.name}</div>
                    <div className="text-[11px] text-steelGrey">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. & 18. Apply for Admission Form & CTA */}
      <section id="admissions" className="py-20 bg-midnight text-pureWhite border-b-2 border-antiqueGold/40 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-heading font-bold text-warmGold tracking-widest uppercase bg-deepNavy px-3 py-1 rounded border border-antiqueGold/40">
              Direct Application Desk • AY {schoolSettings.academicYear}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-pureWhite tracking-tight uppercase">
              Apply for Scholar Admission
            </h2>
            <p className="text-sm text-slate-300 font-sans max-w-xl mx-auto">
              Prospective students and guardians are invited to initiate their admission inquiry online. Our admissions team will review your application within 48 hours.
            </p>
          </div>

          <div className="bg-pureWhite text-charcoal rounded-2xl p-6 sm:p-10 shadow-elevated border border-steelGrey/20">
            {inquirySuccess ? (
              <div className="p-8 text-center space-y-4 bg-deepEmerald/10 border border-deepEmerald/30 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-deepEmerald text-pureWhite mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-midnight">
                  Admission Inquiry Successfully Registered!
                </h3>
                <p className="text-xs text-charcoal max-w-md mx-auto font-sans leading-relaxed">
                  Thank you for applying to Sonargaon International School. Your inquiry has been routed to our Academic Admissions Committee.
                </p>
                {inquiryAppNum && (
                  <div className="bg-pureWhite p-3 rounded-lg border border-antiqueGold/40 inline-block font-mono text-sm font-bold text-midnight">
                    Application Tracking ID: <span className="text-antiqueGold">{inquiryAppNum}</span>
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    href="/admissions"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-midnight text-pureWhite font-heading font-bold text-xs uppercase"
                  >
                    Track Application Status &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs font-sans">
                {inquiryError && (
                  <div className="p-3 bg-mutedRed/10 border border-mutedRed/30 text-mutedRed rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Scholar Full Name *</label>
                    <input
                      name="studentName"
                      required
                      placeholder="e.g. Farhan Chowdhury"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Grade Level Applying For *</label>
                    <select
                      name="gradeApplying"
                      required
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    >
                      <option value="Grade 1">Grade 1 (Primary)</option>
                      <option value="Grade 2">Grade 2 (Primary)</option>
                      <option value="Grade 3">Grade 3 (Primary)</option>
                      <option value="Grade 4">Grade 4 (Primary)</option>
                      <option value="Grade 5">Grade 5 (Primary)</option>
                      <option value="Grade 6">Grade 6 (Junior Secondary)</option>
                      <option value="Grade 7">Grade 7 (Junior Secondary)</option>
                      <option value="Grade 8">Grade 8 (Junior Secondary)</option>
                      <option value="Grade 9">Grade 9 (Senior Cambridge)</option>
                      <option value="Grade 10">Grade 10 (Senior Cambridge)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Date of Birth</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Gender</label>
                    <select
                      name="gender"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal font-medium focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Parent / Guardian Name *</label>
                    <input
                      name="parentName"
                      required
                      placeholder="e.g. Dr. Tanvir Chowdhury"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Contact Phone (with Country Code) *</label>
                    <input
                      name="parentPhone"
                      required
                      placeholder="+880 1711 000000"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Parent Email</label>
                    <input
                      name="parentEmail"
                      type="email"
                      placeholder="parent@example.com"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Previous School (if applicable)</label>
                    <input
                      name="previousSchool"
                      placeholder="e.g. Scholastica, Senior Campus"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Residential Address (Area / Sector)</label>
                    <input
                      name="address"
                      placeholder="e.g. Sector 3, Uttara / Banani, Dhaka"
                      className="w-full px-3.5 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-antiqueGold"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-antiqueGold hover:bg-warmGold text-midnight font-heading font-bold text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{inquirySubmitting ? 'Registering Application...' : 'Submit Admission Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 20. Professional Footer */}
      <PublicFooter schoolSettings={schoolSettings} />
    </div>
  );
}
