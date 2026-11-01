'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoFill = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-antiqueGold selection:text-midnight font-sans">
      {/* Return to Public Website */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-heading font-semibold text-slate-400 hover:text-warmGold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-pureWhite/95 border border-antiqueGold/40 shadow-card mb-4">
          <img
            src="/logo.png"
            alt="Sonargaon International School Logo"
            className="h-20 w-auto object-contain"
          />
        </div>
        <h1 className="font-heading text-xl sm:text-2xl font-black text-pureWhite tracking-tight uppercase">
          SONARGAON INTERNATIONAL SCHOOL
        </h1>
        <p className="mt-1 text-xs text-warmGold font-semibold tracking-widest uppercase">
          Building Character. Inspiring Excellence.
        </p>
        <p className="mt-1 text-[11px] text-slate-300 font-sans">
          Integrated Enterprise ERP & Scholastic Portal System
        </p>
      </div>

      <div className="relative mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-pureWhite py-8 px-6 shadow-card rounded-xl sm:px-10 border border-slate-200 text-charcoal">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-mutedRed/10 border border-mutedRed/30 p-3 flex items-start gap-2.5 text-mutedRed text-xs font-sans">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-mutedRed" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Email, Student ID, or Staff ID
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steelGrey">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. admin, TCH-001, or STU-2026-001"
                  className="block w-full pl-9 pr-3 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal text-xs focus:outline-none focus:ring-1 focus:ring-antiqueGold focus:bg-pureWhite transition font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steelGrey">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-warmIvory/60 border border-slate-300 rounded-lg text-charcoal text-xs focus:outline-none focus:ring-1 focus:ring-antiqueGold focus:bg-pureWhite transition font-sans"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-sm text-xs font-heading font-bold uppercase tracking-wider text-midnight bg-antiqueGold hover:bg-warmGold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antiqueGold disabled:opacity-50 transition"
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-midnight border-t-transparent" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center gap-1.5 text-[10px] font-heading font-bold text-steelGrey uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-antiqueGold" />
              One-Click Demonstration Logins
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('admin', 'admin123')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-warmIvory/60 hover:bg-warmIvory hover:border-antiqueGold/40 text-left transition group"
              >
                <div>
                  <div className="font-heading font-bold text-midnight group-hover:text-antiqueGold transition">Super Admin</div>
                  <div className="text-[10px] text-steelGrey">Dr. Mansur Ali</div>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-antiqueGold" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('teacher@sonargaon.edu.bd', 'teacher123')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-warmIvory/60 hover:bg-warmIvory hover:border-antiqueGold/40 text-left transition group"
              >
                <div>
                  <div className="font-heading font-bold text-midnight group-hover:text-antiqueGold transition">Faculty Lead</div>
                  <div className="text-[10px] text-steelGrey">Kazi Farhana (Math)</div>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-antiqueGold" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('STU-2026-001', 'student123')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-warmIvory/60 hover:bg-warmIvory hover:border-antiqueGold/40 text-left transition group"
              >
                <div>
                  <div className="font-heading font-bold text-midnight group-hover:text-antiqueGold transition">Scholar</div>
                  <div className="text-[10px] text-steelGrey">Tahmid (Grade 10)</div>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-antiqueGold" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('PRN-001', 'parent123')}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-warmIvory/60 hover:bg-warmIvory hover:border-antiqueGold/40 text-left transition group"
              >
                <div>
                  <div className="font-heading font-bold text-midnight group-hover:text-antiqueGold transition">Guardian</div>
                  <div className="text-[10px] text-steelGrey">Tareq Mahmud</div>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-antiqueGold" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400 font-sans">
          SONARGAON INTERNATIONAL SCHOOL • Dhaka, Bangladesh • AY 2026–2027
        </p>
      </div>
    </div>
  );
}
